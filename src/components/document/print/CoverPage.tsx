import type { DocumentHeader, DocumentStatus } from "@/lib/types";

const STATUS_LABEL: Record<DocumentStatus, string> = {
  DRAFT: "초안",
  SUBMITTED: "제출됨",
  IN_REVIEW: "검토중",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
};

interface Props {
  formTitle: string; // 예: 개발계획서 (F702-1)
  projectName: string;
  header: DocumentHeader;
}

export function CoverPage({ formTitle, projectName, header }: Props) {
  return (
    <div className="a4-sheet a4-page-break flex flex-col">
      <div className="mb-16 flex justify-end text-sm">
        <span className="border border-slate-800 px-3 py-1">관리 상태: ■ 관리본 &nbsp;&nbsp; □ 비관리본</span>
      </div>

      <div className="mt-24 flex flex-1 flex-col items-center justify-center text-center">
        <p className="mb-3 text-lg text-slate-500">{projectName}</p>
        <h1 className="mb-2 text-4xl font-bold tracking-wide">{formTitle}</h1>
        <p className="mt-6 text-sm text-slate-500">문서번호 {header.docNo}</p>
      </div>

      <table className="mt-auto w-full border-collapse border border-slate-800 text-center text-sm">
        <tbody>
          <tr>
            <th className="border border-slate-800 bg-slate-100 py-2">개정번호</th>
            <td className="border border-slate-800 py-2">Rev.{header.revNo}</td>
            <th className="border border-slate-800 bg-slate-100 py-2">상태</th>
            <td className="border border-slate-800 py-2">{STATUS_LABEL[header.status]}</td>
          </tr>
          <tr>
            <th className="border border-slate-800 bg-slate-100 py-2">작성</th>
            <td className="border border-slate-800 py-8 align-top">
              {header.authorUid.slice(0, 8)}
              <br />
              <span className="text-xs text-slate-400">{new Date(header.createdAt).toLocaleDateString()}</span>
            </td>
            <th className="border border-slate-800 bg-slate-100 py-2">검토</th>
            <td className="border border-slate-800 py-8 align-top">
              {header.reviewerUid ? header.reviewerUid.slice(0, 8) : "-"}
              <br />
              <span className="text-xs text-slate-400">
                {header.reviewedAt ? new Date(header.reviewedAt).toLocaleDateString() : ""}
              </span>
            </td>
          </tr>
          <tr>
            <th className="border border-slate-800 bg-slate-100 py-2">승인</th>
            <td colSpan={3} className="border border-slate-800 py-8 align-top">
              {header.approverUid ? header.approverUid.slice(0, 8) : "-"}
              <br />
              <span className="text-xs text-slate-400">
                {header.approvedAt ? new Date(header.approvedAt).toLocaleDateString() : ""}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
