"use client";

import type { ReactNode } from "react";
import type { DocumentHeader } from "@/lib/types";
import { CoverPage } from "./CoverPage";

interface Props {
  formTitle: string;
  projectName: string;
  header: DocumentHeader;
  children: ReactNode;
}

export function PrintLayout({ formTitle, projectName, header, children }: Props) {
  return (
    <div>
      <div className="no-print mb-4 flex justify-end">
        <button
          onClick={() => window.print()}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          PDF로 출력
        </button>
      </div>
      <div className="print-area">
        <CoverPage formTitle={formTitle} projectName={projectName} header={header} />
        <div className="a4-sheet">{children}</div>
      </div>
    </div>
  );
}
