"use client";

import { useState } from "react";
import type { Attachment, DocumentTypeCode } from "@/lib/types";
import { uploadAttachment } from "@/lib/firestore/attachments";
import { useAuth } from "@/components/providers/AuthProvider";

const CATEGORY_LABEL: Record<Attachment["category"], string> = {
  DRAWING: "도면",
  LABEL: "라벨",
  MANUAL: "사용설명서",
  OTHER: "기타",
};

interface Props {
  documentType: DocumentTypeCode;
  documentId: string;
  attachments: Attachment[];
  onUploaded: (attachmentId: string) => void;
}

export function AttachmentUploader({ documentType, documentId, attachments, onUploaded }: Props) {
  const { user } = useAuth();
  const [category, setCategory] = useState<Attachment["category"]>("DRAWING");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const id = await uploadAttachment(documentType, documentId, file, category, user.uid);
      onUploaded(id);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-2 text-sm font-semibold">첨부파일</h3>
      <ul className="mb-3 space-y-1 text-sm">
        {attachments.map((a) => (
          <li key={a.id} className="flex justify-between text-slate-700">
            <span>
              [{CATEGORY_LABEL[a.category]}] {a.fileName}
            </span>
          </li>
        ))}
        {!attachments.length && <li className="text-slate-400">첨부된 파일이 없습니다.</li>}
      </ul>
      <div className="flex items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Attachment["category"])}
          className="rounded border px-2 py-1 text-sm"
        >
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleFileChange} disabled={uploading} className="text-sm" />
        {uploading && <span className="text-xs text-slate-400">업로드 중...</span>}
      </div>
    </div>
  );
}
