import type { RoleCode } from "../roles";
import { hasRole } from "../roles";
import type { ApprovalAction, DocumentStatus, DocumentTypeCode } from "../types";

/**
 * 공통 상태 머신: DRAFT -> SUBMITTED -> IN_REVIEW -> (APPROVED | REJECTED -> DRAFT)
 */
export const STATUS_TRANSITIONS: Record<DocumentStatus, Partial<Record<ApprovalAction, DocumentStatus>>> = {
  DRAFT: { SUBMIT: "SUBMITTED" },
  SUBMITTED: { REVIEW: "IN_REVIEW", REVISE: "DRAFT" },
  IN_REVIEW: { APPROVE: "APPROVED", REJECT: "REJECTED" },
  APPROVED: {},
  REJECTED: { REVISE: "DRAFT" },
};

/** 문서 타입별로 초안 작성이 가능한 역할 (문서 4장 기준) */
export const AUTHOR_ROLES: Record<DocumentTypeCode, RoleCode[]> = {
  PLAN: ["DEV_LEAD", "DEV_TEAM"],
  INPUT: ["DEV_TEAM", "DEV_LEAD"],
  OUTPUT: ["DEV_TEAM", "DEV_LEAD"],
};

/** 문서 타입별로 검토(REVIEW) 수행 가능한 역할 */
export const REVIEWER_ROLES: Record<DocumentTypeCode, RoleCode[]> = {
  PLAN: ["DEV_LEAD", "QUALITY_HEAD"],
  INPUT: ["DEV_LEAD"],
  OUTPUT: ["DEV_LEAD", "QC_TEAM"],
};

/** 문서 타입별로 최종 승인(APPROVE) 가능한 역할 (4.1, 4.3, 6.1, 6.3절 근거) */
export const APPROVER_ROLES: Record<DocumentTypeCode, RoleCode[]> = {
  PLAN: ["CEO"],
  INPUT: ["QUALITY_HEAD"],
  OUTPUT: ["QUALITY_HEAD"],
};

export function canPerformAction(
  docType: DocumentTypeCode,
  action: ApprovalAction,
  userRoles: RoleCode[] | undefined
): boolean {
  switch (action) {
    case "SUBMIT":
    case "REVISE":
      return hasRole(userRoles, AUTHOR_ROLES[docType]);
    case "REVIEW":
      return hasRole(userRoles, REVIEWER_ROLES[docType]);
    case "APPROVE":
    case "REJECT":
      return hasRole(userRoles, APPROVER_ROLES[docType]);
    default:
      return false;
  }
}

export function nextStatus(
  currentStatus: DocumentStatus,
  action: ApprovalAction
): DocumentStatus | undefined {
  return STATUS_TRANSITIONS[currentStatus]?.[action];
}

export function isTransitionAllowed(
  docType: DocumentTypeCode,
  currentStatus: DocumentStatus,
  action: ApprovalAction,
  userRoles: RoleCode[] | undefined
): boolean {
  return Boolean(nextStatus(currentStatus, action)) && canPerformAction(docType, action, userRoles);
}
