export type DocumentViewMode = "edit" | "detail" | "print";

const TABS: { mode: DocumentViewMode; label: string }[] = [
  { mode: "edit", label: "수정" },
  { mode: "detail", label: "상세보기" },
  { mode: "print", label: "문서형식보기" },
];

interface Props {
  value: DocumentViewMode;
  onChange: (mode: DocumentViewMode) => void;
}

export function DocumentViewTabs({ value, onChange }: Props) {
  return (
    <div className="no-print flex gap-1 rounded-lg border bg-white p-1">
      {TABS.map((tab) => (
        <button
          key={tab.mode}
          onClick={() => onChange(tab.mode)}
          className={`rounded px-3 py-1.5 text-sm font-medium transition ${
            value === tab.mode ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
