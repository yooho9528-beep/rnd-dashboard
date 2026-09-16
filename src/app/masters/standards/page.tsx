"use client";

import { useEffect, useState } from "react";
import { createStandard, deleteStandard, listStandards } from "@/lib/firestore/standards";
import type { Standard } from "@/lib/types";

export default function StandardsMasterPage() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [category, setCategory] = useState("");

  async function refresh() {
    setStandards(await listStandards());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 1회 목록 조회
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createStandard({ name, version, category });
    setName("");
    setVersion("");
    setCategory("");
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">규격 마스터</h1>
        <p className="text-sm text-slate-500">
          개발입력서·개발출력서 등 여러 문서에서 공통으로 참조하는 적용 규격 목록입니다.
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2 rounded-lg border bg-white p-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">규격명</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: ISO 14155-1"
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">버전</label>
          <input value={version} onChange={(e) => setVersion(e.target.value)} className="rounded border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">분류</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border px-2 py-1 text-sm" />
        </div>
        <button type="submit" className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
          등록
        </button>
      </form>

      <ul className="divide-y rounded-lg border bg-white">
        {standards.map((s) => (
          <li key={s.id} className="flex items-center justify-between px-4 py-2 text-sm">
            <span>
              {s.name} {s.version && `(${s.version})`} {s.category && `— ${s.category}`}
            </span>
            <button
              onClick={async () => {
                await deleteStandard(s.id);
                await refresh();
              }}
              className="text-xs text-red-500"
            >
              삭제
            </button>
          </li>
        ))}
        {!standards.length && <li className="px-4 py-3 text-sm text-slate-400">등록된 규격이 없습니다.</li>}
      </ul>
    </div>
  );
}
