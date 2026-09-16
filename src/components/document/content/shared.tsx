import type { ReactNode } from "react";

export type ContentVariant = "detail" | "print";

export function Section({
  title,
  children,
  variant,
}: {
  title: string;
  children: ReactNode;
  variant: ContentVariant;
}) {
  if (variant === "print") {
    return (
      <section className="mb-6 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-slate-800 pb-1 text-base font-bold">{title}</h2>
        <div className="text-sm leading-relaxed">{children}</div>
      </section>
    );
  }
  return (
    <section className="mb-4 rounded-lg border bg-white p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-500">{title}</h2>
      <div className="text-sm text-slate-800">{children}</div>
    </section>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="whitespace-pre-wrap">{children || "-"}</p>;
}

export function SimpleTable({
  headers,
  rows,
  variant,
}: {
  headers: string[];
  rows: (string | number)[][];
  variant: ContentVariant;
}) {
  const cellBorder = variant === "print" ? "border border-slate-800" : "border border-slate-200";
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} className={`${cellBorder} bg-slate-100 px-2 py-1 text-left`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={`${cellBorder} px-2 py-1`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td className={`${cellBorder} px-2 py-2 text-center text-slate-400`} colSpan={headers.length}>
              내용 없음
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
