"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProject } from "@/lib/firestore/projects";
import { listDocumentsByProject } from "@/lib/firestore/documents";
import type { DocumentTypeCode, Project } from "@/lib/types";

type DocSummary = { id: string; docNo: string; status: string; revNo: number };

const DOC_TYPE_CONFIGS: { type: DocumentTypeCode; title: string; path: string }[] = [
  { type: "PLAN", title: "개발계획서 (F702-1)", path: "plan" },
  { type: "INPUT", title: "개발입력서 (F702-2)", path: "input" },
  { type: "OUTPUT", title: "개발출력서 (F702-3)", path: "output" },
  { type: "REVIEW", title: "설계검토회의록 (F702-4)", path: "review" },
  { type: "VV_PLAN", title: "검증/유효성 확인계획서 (F702-5)", path: "vv-plan" },
  { type: "VV_REPORT", title: "검증/유효성 확인보고서 (F702-6)", path: "vv-report" },
  { type: "CHANGE_REQUEST", title: "설계변경요청서 (F702-7)", path: "change-request" },
  { type: "TRANSFER", title: "설계 및 개발 이관보고서 (F702-8)", path: "transfer" },
];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [docsByType, setDocsByType] = useState<Partial<Record<DocumentTypeCode, DocSummary[]>>>({});

  useEffect(() => {
    getProject(projectId).then(setProject);
    DOC_TYPE_CONFIGS.forEach(({ type }) => {
      listDocumentsByProject<{ header: { docNo: string; status: string; revNo: number } }>(type, projectId).then(
        (docs) => {
          const summaries = docs.map((d) => ({
            id: d.id,
            docNo: d.header.docNo,
            status: d.header.status,
            revNo: d.header.revNo,
          }));
          setDocsByType((prev) => ({ ...prev, [type]: summaries }));
        }
      );
    });
  }, [projectId]);

  if (!project) return <p className="text-sm text-slate-400">불러오는 중...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">{project.name}</h1>
        <p className="text-sm text-slate-500">{project.code}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DOC_TYPE_CONFIGS.map(({ type, title, path }) => (
          <DocTypeCard
            key={type}
            title={title}
            docs={docsByType[type] ?? []}
            newHref={`/projects/${projectId}/${path}/new`}
            hrefFor={(id) => `/projects/${projectId}/${path}/${id}`}
          />
        ))}
      </div>
    </div>
  );
}

function DocTypeCard({
  title,
  docs,
  newHref,
  hrefFor,
}: {
  title: string;
  docs: DocSummary[];
  newHref: string;
  hrefFor: (id: string) => string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link href={newHref} className="text-xs text-blue-600 underline">
          + 신규 작성
        </Link>
      </div>
      <ul className="space-y-1 text-sm">
        {docs.map((d) => (
          <li key={d.id}>
            <Link href={hrefFor(d.id)} className="text-slate-700 hover:underline">
              {d.docNo} (Rev.{d.revNo}) — {d.status}
            </Link>
          </li>
        ))}
        {!docs.length && <li className="text-xs text-slate-400">작성된 문서가 없습니다.</li>}
      </ul>
    </div>
  );
}
