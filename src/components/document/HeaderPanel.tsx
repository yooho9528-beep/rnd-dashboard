import type { DocumentHeader, DocumentStatus } from "@/lib/types";

const STATUS_LABEL: Record<DocumentStatus, string> = {
  DRAFT: "초안",
  SUBMITTED: "제출됨",
  IN_REVIEW: "검토중",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
};

const STATUS_COLOR: Record<DocumentStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-amber-100 text-amber-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function HeaderPanel({ header }: { header: DocumentHeader }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-white p-4 text-sm">
      <div>
        <span className="text-slate-500">문서번호</span>
        <div className="font-medium">{header.docNo}</div>
      </div>
      <div>
        <span className="text-slate-500">개정번호</span>
        <div className="font-medium">Rev.{header.revNo}</div>
      </div>
      <div>
        <span className="text-slate-500">상태</span>
        <div className={`mt-0.5 inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[header.status]}`}>
          {STATUS_LABEL[header.status]}
        </div>
      </div>
      <div>
        <span className="text-slate-500">작성일</span>
        <div className="font-medium">{new Date(header.createdAt).toLocaleString()}</div>
      </div>
      {header.reviewedAt && (
        <div>
          <span className="text-slate-500">검토일</span>
          <div className="font-medium">{new Date(header.reviewedAt).toLocaleString()}</div>
        </div>
      )}
      {header.approvedAt && (
        <div>
          <span className="text-slate-500">승인일</span>
          <div className="font-medium">{new Date(header.approvedAt).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
