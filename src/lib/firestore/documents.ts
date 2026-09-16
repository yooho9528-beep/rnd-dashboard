import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { collectionNameFor, generateDocNo } from "@/lib/documents/doc-no";
import { nextStatus } from "@/lib/documents/workflow";
import type {
  ApprovalAction,
  ApprovalHistoryEntry,
  DocumentHeader,
  DocumentTypeCode,
} from "@/lib/types";

async function nextSeq(projectId: string, docType: DocumentTypeCode): Promise<number> {
  const counterRef = doc(db, "doc_counters", `${projectId}_${docType}`);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const seq = (snap.exists() ? (snap.data().seq as number) : 0) + 1;
    tx.set(counterRef, { seq }, { merge: true });
    return seq;
  });
}

export async function createDocument<T extends { header: DocumentHeader }>(
  docType: DocumentTypeCode,
  projectId: string,
  projectCode: string,
  authorUid: string,
  body: Omit<T, "header">
): Promise<string> {
  const seq = await nextSeq(projectId, docType);
  const header: DocumentHeader = {
    docNo: generateDocNo(docType, projectCode, seq),
    revNo: 0,
    projectId,
    status: "DRAFT",
    authorUid,
    createdAt: new Date().toISOString(),
  };
  const ref = doc(collection(db, collectionNameFor(docType)));
  await setDoc(ref, { header, ...body });
  return ref.id;
}

export async function getDocumentById<T>(
  docType: DocumentTypeCode,
  docId: string
): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, collectionNameFor(docType), docId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) };
}

export async function listDocumentsByProject<T>(
  docType: DocumentTypeCode,
  projectId: string
): Promise<(T & { id: string })[]> {
  const snap = await getDocs(
    query(collection(db, collectionNameFor(docType)), where("header.projectId", "==", projectId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function updateDocumentBody(
  docType: DocumentTypeCode,
  docId: string,
  body: Record<string, unknown>
): Promise<void> {
  await updateDoc(doc(db, collectionNameFor(docType), docId), body);
}

export async function applyApprovalAction(
  docType: DocumentTypeCode,
  docId: string,
  currentStatus: DocumentHeader["status"],
  action: ApprovalAction,
  actorUid: string,
  comment?: string
): Promise<void> {
  const to = nextStatus(currentStatus, action);
  if (!to) throw new Error(`허용되지 않는 상태 전이입니다: ${currentStatus} -> ${action}`);

  const patch: Record<string, unknown> = { "header.status": to };
  const now = new Date().toISOString();
  if (action === "REVIEW") {
    patch["header.reviewerUid"] = actorUid;
    patch["header.reviewedAt"] = now;
  }
  if (action === "APPROVE") {
    patch["header.approverUid"] = actorUid;
    patch["header.approvedAt"] = now;
  }
  if (action === "REVISE") {
    patch["header.revNo"] = increment(1);
  }

  await updateDoc(doc(db, collectionNameFor(docType), docId), patch);

  const historyRef = doc(collection(db, "approval_history"));
  const entry: Omit<ApprovalHistoryEntry, "id"> = {
    documentId: docId,
    documentType: docType,
    action,
    actorUid,
    comment,
    createdAt: now,
  };
  await setDoc(historyRef, entry);
}

export async function listApprovalHistory(
  docType: DocumentTypeCode,
  docId: string
): Promise<ApprovalHistoryEntry[]> {
  const snap = await getDocs(
    query(
      collection(db, "approval_history"),
      where("documentType", "==", docType),
      where("documentId", "==", docId),
      orderBy("createdAt", "asc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ApprovalHistoryEntry, "id">) }));
}
