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
import { InputForm } from "@/components/forms/InputForm";
import type { ApprovalHistoryEntry, Attachment, InputDocument } from "@/lib/types";
import type { InputFormValues } from "@/lib/schemas/input";

export default function InputDocumentPage() {
  const { projectId, docId } = useParams<{ projectId: string; docId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = docId === "new";

  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [doc, setDoc] = useState<(InputDocument & { id: string }) | null>(null);
  const [history, setHistory] = useState<ApprovalHistoryEntry[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(!isNew);

  const load = useCallback(async () => {
    const project = await getProject(projectId);
    setProjectCode(project?.code ?? null);

    if (!isNew) {
      setLoading(true);
      const [d, h, a] = await Promise.all([
        getDocumentById<InputDocument>("INPUT", docId),
        listApprovalHistory("INPUT", docId),
        listAttachmentsByDocument("INPUT", docId),
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

  async function handleSubmit(values: InputFormValues) {
    if (!user) return;
    if (isNew) {
      if (!projectCode) return;
      const newId = await createDocument<InputDocument>("INPUT", projectId, projectCode, user.uid, {
        ...values,
        attachmentIds: [],
      });
      router.push(`/projects/${projectId}/input/${newId}`);
      return;
    }
    await updateDocumentBody("INPUT", docId, values);
    await load();
  }

  if (!isNew && loading) return <p className="text-sm text-slate-400">불러오는 중...</p>;
  if (!isNew && !doc) return <p className="text-sm text-red-500">문서를 찾을 수 없습니다.</p>;

  const readOnly = !isNew && doc!.header.status !== "DRAFT";

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">개발입력서 (F702-2)</h1>
      {doc && <HeaderPanel header={doc.header} />}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InputForm defaultValues={doc ?? undefined} readOnly={readOnly} onSubmit={handleSubmit} />
        </div>
        {!isNew && doc && (
          <div className="space-y-4">
            <ApprovalActions docType="INPUT" docId={docId} header={doc.header} onChanged={load} />
            <AttachmentUploader
              documentType="INPUT"
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
    </div>
  );
}
