import type { DocumentTypeCode } from "../types";

const FORM_CODE: Record<DocumentTypeCode, string> = {
  PLAN: "F702-1",
  INPUT: "F702-2",
  OUTPUT: "F702-3",
  REVIEW: "F702-4",
  VV_PLAN: "F702-5",
  VV_REPORT: "F702-6",
  CHANGE_REQUEST: "F702-7",
  TRANSFER: "F702-8",
};

/** 예: F702-1-ABC001-003 (양식코드-프로젝트코드-일련번호) */
export function generateDocNo(docType: DocumentTypeCode, projectCode: string, seq: number): string {
  return `${FORM_CODE[docType]}-${projectCode}-${String(seq).padStart(3, "0")}`;
}

const COLLECTION_NAME: Record<DocumentTypeCode, string> = {
  PLAN: "documents_plan",
  INPUT: "documents_input",
  OUTPUT: "documents_output",
  REVIEW: "documents_review",
  VV_PLAN: "documents_vv_plan",
  VV_REPORT: "documents_vv_report",
  CHANGE_REQUEST: "documents_change_request",
  TRANSFER: "documents_transfer",
};

export function collectionNameFor(docType: DocumentTypeCode): string {
  return COLLECTION_NAME[docType];
}
