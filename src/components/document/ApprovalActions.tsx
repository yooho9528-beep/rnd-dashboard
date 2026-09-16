"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { isTransitionAllowed } from "@/lib/documents/workflow";
import type { ApprovalAction, DocumentHeader, DocumentTypeCode } from "@/lib/types";
import { applyApprovalAction } from "@/lib/firestore/documents";

const ACTIONS: { action: ApprovalAction; label: string; className: string }[] = [
  { action: "SUBMIT", label: "제출", className: "bg-slate-900 text-white" },
  { action: "REVIEW", label: "검토 완료", className: "bg-blue-600 text-white" },
  { action: "APPROVE", label: "승인", className: "bg-green-600 text-white" },
  { action: "REJECT", label: "반려", className: "bg-red-600 text-white" },
  { action: "REVISE", label: "수정 재작성", className: "bg-amber-500 text-white" },
];

interface Props {
  docType: DocumentTypeCode;
  docId: string;
  header: DocumentHeader;
  onChanged: () => void;
}

export function ApprovalActions({ docType, docId, header, onChanged }: Props) {
  const { user, roles } = useAuth();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const available = ACTIONS.filter((a) => isTransitionAllowed(docType, header.status, a.action, roles));

  if (!user) return null;

  async function run(action: ApprovalAction) {
    if (!user) return;
    setBusy(true);
    try {
      await applyApprovalAction(docType, docId, header.status, action, user.uid, comment || undefined);
      setComment("");
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  if (!available.length) {
    return <p className="text-sm text-slate-400">현재 상태에서 회원님이 수행할 수 있는 결재 작업이 없습니다.</p>;
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-2 text-sm font-semibold">결재 처리</h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="의견 (선택)"
        className="mb-2 w-full rounded border px-2 py-1 text-sm"
        rows={2}
      />
      <div className="flex gap-2">
        {available.map((a) => (
          <button
            key={a.action}
            disabled={busy}
            onClick={() => run(a.action)}
            className={`rounded px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${a.className}`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
