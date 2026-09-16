"use client";

import { useEffect, useState } from "react";
import type { Standard } from "@/lib/types";
import { listStandards } from "@/lib/firestore/standards";

interface Props {
  value: string[];
  onChange: (ids: string[]) => void;
}

export function StandardMultiSelect({ value, onChange }: Props) {
  const [standards, setStandards] = useState<Standard[]>([]);

  useEffect(() => {
    listStandards().then(setStandards);
  }, []);

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  if (!standards.length) {
    return <p className="text-xs text-slate-400">등록된 규격이 없습니다. 규격 마스터에서 먼저 등록하세요.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {standards.map((s) => (
        <label
          key={s.id}
          className={`cursor-pointer rounded border px-2 py-1 text-xs ${
            value.includes(s.id) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600"
          }`}
        >
          <input type="checkbox" className="hidden" checked={value.includes(s.id)} onChange={() => toggle(s.id)} />
          {s.name}
        </label>
      ))}
    </div>
  );
}
