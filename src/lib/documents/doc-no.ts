import type { DocumentTypeCode } from "../types";

const FORM_CODE: Record<DocumentTypeCode, string> = {
  PLAN: "F702-1",
  INPUT: "F702-2",
  OUTPUT: "F702-3",
};

/** 예: F702-1-ABC001-003 (양식코드-프로젝트코드-일련번호) */
export function generateDocNo(docType: DocumentTypeCode, projectCode: string, seq: number): string {
  return `${FORM_CODE[docType]}-${projectCode}-${String(seq).padStart(3, "0")}`;
}

export function collectionNameFor(docType: DocumentTypeCode): string {
  switch (docType) {
    case "PLAN":
      return "documents_plan";
    case "INPUT":
      return "documents_input";
    case "OUTPUT":
      return "documents_output";
  }
}
