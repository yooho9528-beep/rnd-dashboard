"use client";

import { useEffect, useState } from "react";
import { createPart, deletePart, listParts } from "@/lib/firestore/parts";
import type { Part } from "@/lib/types";

export default function PartsMasterPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [partNo, setPartNo] = useState("");
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unit, setUnit] = useState("");

  async function refresh() {
    setParts(await listParts());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 1회 목록 조회
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createPart({ partNo, name, spec, supplier, unit });
    setPartNo("");
    setName("");
    setSpec("");
    setSupplier("");
    setUnit("");
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">부품 / BOM 마스터</h1>
        <p className="text-sm text-slate-500">개발출력서·이관보고서 등 여러 문서에서 공통으로 참조하는 부품 목록입니다.</p>
      </div>

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2 rounded-lg border bg-white p-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">품번</label>
          <input required value={partNo} onChange={(e) => setPartNo(e.target.value)} className="rounded border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">품명</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="rounded border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">사양</label>
          <input value={spec} onChange={(e) => setSpec(e.target.value)} className="rounded border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">공급업체</label>
          <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="rounded border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">단위</label>
          <input value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded border px-2 py-1 text-sm" />
        </div>
        <button type="submit" className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
          등록
        </button>
      </form>

      <ul className="divide-y rounded-lg border bg-white">
        {parts.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-4 py-2 text-sm">
            <span>
              {p.partNo} — {p.name} {p.spec && `(${p.spec})`}
            </span>
            <button
              onClick={async () => {
                await deletePart(p.id);
                await refresh();
              }}
              className="text-xs text-red-500"
            >
              삭제
            </button>
          </li>
        ))}
        {!parts.length && <li className="px-4 py-3 text-sm text-slate-400">등록된 부품이 없습니다.</li>}
      </ul>
    </div>
  );
}
