import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import type { Attachment, DocumentTypeCode } from "@/lib/types";

export async function uploadAttachment(
  documentType: DocumentTypeCode,
  documentId: string,
  file: File,
  category: Attachment["category"],
  uploadedBy: string
): Promise<string> {
  const storagePath = `documents/${documentType}/${documentId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);

  const attachmentRef = await addDoc(collection(db, "attachments"), {
    documentId,
    documentType,
    fileName: file.name,
    storagePath,
    category,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
  } satisfies Omit<Attachment, "id">);

  return attachmentRef.id;
}

export async function getAttachmentUrl(storagePath: string): Promise<string> {
  return getDownloadURL(ref(storage, storagePath));
}

export async function listAttachmentsByDocument(
  documentType: DocumentTypeCode,
  documentId: string
): Promise<Attachment[]> {
  const snap = await getDocs(
    query(
      collection(db, "attachments"),
      where("documentType", "==", documentType),
      where("documentId", "==", documentId)
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Attachment, "id">) }));
}
