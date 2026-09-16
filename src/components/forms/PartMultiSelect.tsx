"use client";

import { useEffect, useState } from "react";
import type { Part } from "@/lib/types";
import { listParts } from "@/lib/firestore/parts";

interface Props {
  value: string[];
  onChange: (ids: string[]) => void;
}

export function PartMultiSelect({ value, onChange }: Props) {
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    listParts().then(setParts);
  }, []);

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  if (!parts.length) {
    return <p className="text-xs text-slate-400">등록된 부품이 없습니다. 부품 마스터에서 먼저 등록하세요.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {parts.map((p) => (
        <label
          key={p.id}
          className={`cursor-pointer rounded border px-2 py-1 text-xs ${
            value.includes(p.id) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600"
          }`}
        >
          <input type="checkbox" className="hidden" checked={value.includes(p.id)} onChange={() => toggle(p.id)} />
          {p.partNo} {p.name}
        </label>
      ))}
    </div>
  );
}
