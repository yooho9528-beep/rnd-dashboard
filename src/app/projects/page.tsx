"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { createProject, listProjects } from "@/lib/firestore/projects";
import type { Project, ProjectCategory } from "@/lib/types";

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  NEW: "신규 개발",
  MAJOR_CHANGE: "중대한 변경",
  MINOR_CHANGE: "사소한 변경",
  MODEL_ADD: "모델 추가",
  TECH_CHANGE: "기술적 변경",
};

const STATUS_LABEL: Record<Project["status"], string> = {
  PLANNING: "기획",
  IN_DEVELOPMENT: "개발중",
  VERIFICATION: "검증",
  TRANSFERRED: "이관완료",
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("NEW");

  async function refresh() {
    setLoading(true);
    setProjects(await listProjects());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 1회 목록 조회
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    await createProject({ code, name, category, ownerUid: user.uid });
    setCode("");
    setName("");
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">프로젝트</h1>
        <p className="text-sm text-slate-500">개발과제/제품 단위로 설계관리 문서를 관리합니다.</p>
      </div>

      {user && (
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2 rounded-lg border bg-white p-4">
          <div>
            <label className="mb-1 block text-xs text-slate-500">프로젝트 코드</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded border px-2 py-1 text-sm"
              placeholder="예: ABC001"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">제품명</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">분류</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="rounded border px-2 py-1 text-sm"
            >
              {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
            프로젝트 생성
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">불러오는 중...</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id} className="rounded-lg border bg-white p-4">
              <Link href={`/projects/${p.id}`} className="font-medium text-slate-900 hover:underline">
                {p.name}
              </Link>
              <div className="mt-1 text-xs text-slate-500">{p.code}</div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="rounded bg-slate-100 px-2 py-0.5">{CATEGORY_LABEL[p.category]}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5">{STATUS_LABEL[p.status]}</span>
              </div>
            </li>
          ))}
          {!projects.length && <p className="text-sm text-slate-400">등록된 프로젝트가 없습니다.</p>}
        </ul>
      )}
    </div>
  );
}
