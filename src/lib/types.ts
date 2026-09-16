import type { RoleCode } from "./roles";

export type DocumentStatus = "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export type DocumentTypeCode = "PLAN" | "INPUT" | "OUTPUT";

/** F702-1~8 모든 기록양식이 공통으로 갖는 헤더 필드 (5.2/6.3/7~8절 근거) */
export interface DocumentHeader {
  docNo: string; // 예: F702-1-{projectCode}-{seq}
  revNo: number; // 개정번호
  dcoNo?: string; // 개정관리번호(DCO No.)
  projectId: string;
  status: DocumentStatus;
  authorUid: string;
  createdAt: string; // ISO
  reviewerUid?: string;
  reviewedAt?: string;
  approverUid?: string;
  approvedAt?: string;
  changeReason?: string;
}

export type ProjectCategory =
  | "NEW" // 신규 개발
  | "MAJOR_CHANGE" // 중대한 변경
  | "MINOR_CHANGE" // 사소한 변경
  | "MODEL_ADD" // 모델 추가
  | "TECH_CHANGE"; // 기술적 변경

export type ProjectStatus = "PLANNING" | "IN_DEVELOPMENT" | "VERIFICATION" | "TRANSFERRED";

export interface Project {
  id: string;
  code: string;
  name: string; // 제품명
  category: ProjectCategory;
  status: ProjectStatus;
  ownerUid: string;
  createdAt: string;
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  roles: RoleCode[];
  dept?: string;
}

export interface Standard {
  id: string;
  name: string; // 예: ISO 14155-1
  version?: string;
  category?: string;
  description?: string;
}

export interface Part {
  id: string;
  partNo: string;
  name: string;
  spec?: string;
  supplier?: string;
  unit?: string;
}

export interface Attachment {
  id: string;
  documentId: string;
  documentType: DocumentTypeCode;
  fileName: string;
  storagePath: string;
  category: "DRAWING" | "LABEL" | "MANUAL" | "OTHER";
  uploadedBy: string;
  uploadedAt: string;
}

export type ApprovalAction = "SUBMIT" | "REVIEW" | "APPROVE" | "REJECT" | "REVISE";

export interface ApprovalHistoryEntry {
  id: string;
  documentId: string;
  documentType: DocumentTypeCode;
  action: ApprovalAction;
  actorUid: string;
  comment?: string;
  createdAt: string;
}

export interface ScheduleItem {
  phase: string;
  startDate: string;
  endDate: string;
}

export interface DeliverableItem {
  phase: string;
  deliverable: string;
}

/** F702-1 개발계획서 */
export interface PlanDocument {
  header: DocumentHeader;
  purposeScope: string;
  schedule: ScheduleItem[];
  orgChart: string;
  resources: string;
  applicableStandardIds: string[];
  deliverables: DeliverableItem[];
  qualityPlanRef?: string;
  attachmentIds: string[];
}

export interface ChecklistItem {
  item: string;
  satisfied: boolean;
  evidence?: string;
}

/** F702-2 개발입력서 */
export interface InputDocument {
  header: DocumentHeader;
  customerRequirements: string;
  intendedUse: string;
  functionPerformanceUsability: string;
  safetyRequirements: string;
  applicableStandardIds: string[];
  regulatoryRequirements?: string;
  priorDesignReference?: string;
  riskMgmtPlanRef?: string;
  checklistItems: ChecklistItem[];
  attachmentIds: string[];
}

export interface AcceptanceCriterionItem {
  criterion: string;
  method?: string;
}

/** F702-3 개발출력서 */
export interface OutputDocument {
  header: DocumentHeader;
  partIds: string[];
  drawingAttachmentIds: string[];
  processFlow: string;
  productSpecRef?: string;
  verificationPlanRef?: string;
  acceptanceCriteria: AcceptanceCriterionItem[];
  userManualAttachmentIds: string[];
  attachmentIds: string[];
}
