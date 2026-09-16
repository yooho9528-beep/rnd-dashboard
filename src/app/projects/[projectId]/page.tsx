"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProject } from "@/lib/firestore/projects";
import { listDocumentsByProject } from "@/lib/firestore/documents";
import type { InputDocument, OutputDocument, PlanDocument, Project } from "@/lib/types";

type DocSummary = { id: string; docNo: string; status: string; revNo: number };

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [plans, setPlans] = useState<DocSummary[]>([]);
  const [inputs, setInputs] = useState<DocSummary[]>([]);
  const [outputs, setOutputs] = useState<DocSummary[]>([]);

  useEffect(() => {
    getProject(projectId).then(setProject);
    listDocumentsByProject<PlanDocument>("PLAN", projectId).then((docs) =>
      setPlans(docs.map((d) => ({ id: d.id, docNo: d.header.docNo, status: d.header.status, revNo: d.header.revNo })))
    );
    listDocumentsByProject<InputDocument>("INPUT", projectId).then((docs) =>
      setInputs(docs.map((d) => ({ id: d.id, docNo: d.header.docNo, status: d.header.status, revNo: d.header.revNo })))
    );
    listDocumentsByProject<OutputDocument>("OUTPUT", projectId).then((docs) =>
      setOutputs(docs.map((d) => ({ id: d.id, docNo: d.header.docNo, status: d.header.status, revNo: d.header.revNo })))
    );
  }, [projectId]);

  if (!project) return <p className="text-sm text-slate-400">불러오는 중...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">{project.name}</h1>
        <p className="text-sm text-slate-500">{project.code}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DocTypeCard
          title="개발계획서 (F702-1)"
          docs={plans}
          newHref={`/projects/${projectId}/plan/new`}
          hrefFor={(id) => `/projects/${projectId}/plan/${id}`}
        />
        <DocTypeCard
          title="개발입력서 (F702-2)"
          docs={inputs}
          newHref={`/projects/${projectId}/input/new`}
          hrefFor={(id) => `/projects/${projectId}/input/${id}`}
        />
        <DocTypeCard
          title="개발출력서 (F702-3)"
          docs={outputs}
          newHref={`/projects/${projectId}/output/new`}
          hrefFor={(id) => `/projects/${projectId}/output/${id}`}
        />
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
