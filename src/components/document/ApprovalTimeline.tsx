import type { ApprovalHistoryEntry } from "@/lib/types";

const ACTION_LABEL: Record<ApprovalHistoryEntry["action"], string> = {
  SUBMIT: "제출",
  REVIEW: "검토 완료",
  APPROVE: "승인",
  REJECT: "반려",
  REVISE: "수정 재작성",
};

export function ApprovalTimeline({ entries }: { entries: ApprovalHistoryEntry[] }) {
  if (!entries.length) {
    return <p className="text-sm text-slate-400">아직 승인 이력이 없습니다.</p>;
  }

  return (
    <ol className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded border bg-white p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">{ACTION_LABEL[entry.action]}</span>
            <span className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-xs text-slate-500">담당자 UID: {entry.actorUid}</div>
          {entry.comment && <p className="mt-1 text-slate-700">{entry.comment}</p>}
        </li>
      ))}
    </ol>
  );
}
