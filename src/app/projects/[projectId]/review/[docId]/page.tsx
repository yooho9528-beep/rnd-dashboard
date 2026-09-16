"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getProject } from "@/lib/firestore/projects";
import {
  createDocument,
  getDocumentById,
  listApprovalHistory,
  updateDocumentBody,
} from "@/lib/firestore/documents";
import { listAttachmentsByDocument } from "@/lib/firestore/attachments";
import { HeaderPanel } from "@/components/document/HeaderPanel";
import { ApprovalTimeline } from "@/components/document/ApprovalTimeline";
import { ApprovalActions } from "@/components/document/ApprovalActions";
import { AttachmentUploader } from "@/components/document/AttachmentUploader";
import { DocumentViewTabs, type DocumentViewMode } from "@/components/document/DocumentViewTabs";
import { PrintLayout } from "@/components/document/print/PrintLayout";
import { ReviewContent } from "@/components/document/content/ReviewContent";
import { ReviewForm } from "@/components/forms/ReviewForm";
import type { ApprovalHistoryEntry, Attachment, ReviewDocument } from "@/lib/types";
import type { ReviewFormValues } from "@/lib/schemas/review";

const FORM_TITLE = "설계검토회의록 (F702-4)";

export default function ReviewDocumentPage() {
  const { projectId, docId } = useParams<{ projectId: string; docId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = docId === "new";

  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [doc, setDoc] = useState<(ReviewDocument & { id: string }) | null>(null);
  const [history, setHistory] = useState<ApprovalHistoryEntry[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [viewMode, setViewMode] = useState<DocumentViewMode>("edit");

  const load = useCallback(async () => {
    const project = await getProject(projectId);
    setProjectCode(project?.code ?? null);
    setProjectName(project?.name ?? "");

    if (!isNew) {
      setLoading(true);
      const [d, h, a] = await Promise.all([
        getDocumentById<ReviewDocument>("REVIEW", docId),
        listApprovalHistory("REVIEW", docId),
        listAttachmentsByDocument("REVIEW", docId),
      ]);
      setDoc(d);
      setHistory(h);
      setAttachments(a);
      setLoading(false);
    }
  }, [projectId, docId, isNew]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 문서 로드는 마운트/id 변경 시 1회
    load();
  }, [load]);

  async function handleSubmit(values: ReviewFormValues) {
    if (!user) return;
    if (isNew) {
      if (!projectCode) return;
      const newId = await createDocument<ReviewDocument>("REVIEW", projectId, projectCode, user.uid, {
        ...values,
        attachmentIds: [],
      });
      router.push(`/projects/${projectId}/review/${newId}`);
      return;
    }
    await updateDocumentBody("REVIEW", docId, values);
    await load();
  }

  if (!isNew && loading) return <p className="text-sm text-slate-400">불러오는 중...</p>;
  if (!isNew && !doc) return <p className="text-sm text-red-500">문서를 찾을 수 없습니다.</p>;

  const readOnly = !isNew && doc!.header.status !== "DRAFT";

  if (viewMode === "print" && doc) {
    return (
      <div>
        <div className="no-print mb-4">
          <DocumentViewTabs value={viewMode} onChange={setViewMode} />
        </div>
        <PrintLayout formTitle={FORM_TITLE} projectName={projectName} header={doc.header}>
          <ReviewContent doc={doc} variant="print" />
        </PrintLayout>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{FORM_TITLE}</h1>
        {!isNew && doc && <DocumentViewTabs value={viewMode} onChange={setViewMode} />}
      </div>
      {doc && <HeaderPanel header={doc.header} />}

      {viewMode === "detail" && doc ? (
        <ReviewContent doc={doc} variant="detail" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ReviewForm defaultValues={doc ?? undefined} readOnly={readOnly} onSubmit={handleSubmit} />
          </div>
          {!isNew && doc && (
            <div className="space-y-4">
              <ApprovalActions docType="REVIEW" docId={docId} header={doc.header} onChanged={load} />
              <AttachmentUploader
                documentType="REVIEW"
                documentId={docId}
                attachments={attachments}
                onUploaded={load}
              />
              <div>
                <h3 className="mb-2 text-sm font-semibold">승인 이력</h3>
                <ApprovalTimeline entries={history} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
