import type { RoleCode } from "./roles";

export type DocumentStatus = "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export type DocumentTypeCode =
  | "PLAN"
  | "INPUT"
  | "OUTPUT"
  | "REVIEW"
  | "VV_PLAN"
  | "VV_REPORT"
  | "CHANGE_REQUEST"
  | "TRANSFER";

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

export interface AttendeeItem {
  name: string;
  dept: string;
}

export interface RevisionItem {
  content: string;
  reason: string;
}

export type ReviewDecision = "PROCEED" | "HOLD" | "REJECTED";

/** F702-4 설계검토회의록 (8절 근거) */
export interface ReviewDocument {
  header: DocumentHeader;
  reviewStage: string; // 검토 대상 설계/개발 단계
  reviewCriteria: string; // 검토 기준
  reviewedDocuments: string; // 검토한 문서 목록
  attendees: AttendeeItem[];
  meetingDate: string;
  requirementsSatisfiedEvidence: string; // 요구사항 충족 증거
  decision: ReviewDecision;
  revisions: RevisionItem[];
  unresolvedIssues?: string;
  attachmentIds: string[];
}

export type VerificationMethod =
  | "DOCUMENT_REVIEW"
  | "LAB_TEST"
  | "ALTERNATE_CALCULATION"
  | "SIMILARITY_ANALYSIS"
  | "REPRESENTATIVE_SAMPLE"
  | "PROTOTYPE";

export type ValidationActivity =
  | "PERFORMANCE_DATA"
  | "RELIABILITY"
  | "MAINTAINABILITY"
  | "QUALIFICATION_TEST"
  | "ANIMAL_TEST"
  | "CLINICAL_TEST"
  | "OTHER";

/** F702-5 개발검증 및 유효성 확인계획서 (9~10절 근거) */
export interface VVPlanDocument {
  header: DocumentHeader;
  targetDescription: string; // 검증/유효성 확인 대상(제품/측면)
  protocolPurpose: string;
  procedureSpec: string;
  applicableStandardIds: string[];
  modelSelectionRationale?: string;
  facilitiesEquipment?: string;
  performedBy?: string;
  sampleSizeRationale?: string;
  verificationMethods: VerificationMethod[];
  validationActivities: ValidationActivity[];
  attachmentIds: string[];
}

export interface TestResultItem {
  item: string;
  criterion: string;
  result: string;
  judgement: "PASS" | "FAIL";
}

export type VVConclusion = "PASS" | "FAIL" | "CONDITIONAL";

/** F702-6 개발검증 및 유효성 확인보고서 */
export interface VVReportDocument {
  header: DocumentHeader;
  vvPlanRef: string; // 연계된 F702-5 문서번호
  resultsSummary: string;
  testResults: TestResultItem[];
  nonConformities?: string;
  conclusion: VVConclusion;
  dhfRecorded: boolean;
  attachmentIds: string[];
}

export type ChangeSignificance = "MAJOR" | "MINOR";

/** F702-7 설계변경요청서 (12절 근거) */
export interface ChangeRequestDocument {
  header: DocumentHeader;
  changeReason: string;
  changeDescription: string;
  affectedDocuments: string;
  significanceLevel: ChangeSignificance;
  affectedStages: string; // 요구되는 설계 및 개발 단계 범위
  impactAssessment: string; // 구성품/생산중/인도된 제품/위험관리/제품실현 프로세스 영향평가
  attachmentIds: string[];
}

export type TransferMethod = "FINALIZE_PRE_TRANSFER" | "NEW_DOCUMENT";

export interface TransferItemEntry {
  item: string;
  included: boolean;
}

/** F702-8 설계 및 개발 이관보고서 (11절 근거) */
export interface TransferDocument {
  header: DocumentHeader;
  transferMethod: TransferMethod;
  transferredItems: TransferItemEntry[];
  receivingDept: string;
  transferDate: string;
  trainingCompleted: boolean;
  postMarketInfoRef?: string;
  attachmentIds: string[];
}
