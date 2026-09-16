import { z } from "zod";

export const attendeeItemSchema = z.object({
  name: z.string().min(1, "이름을 입력하세요"),
  dept: z.string().min(1, "부서를 입력하세요"),
});

export const revisionItemSchema = z.object({
  content: z.string().min(1, "수정 내용을 입력하세요"),
  reason: z.string().min(1, "수정 사유를 입력하세요"),
});

/** F702-4 설계검토회의록 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const reviewFormSchema = z.object({
  reviewStage: z.string().min(1, "검토 대상 단계를 입력하세요"),
  reviewCriteria: z.string().min(1, "검토 기준을 입력하세요"),
  reviewedDocuments: z.string().min(1, "검토한 문서 목록을 입력하세요"),
  attendees: z.array(attendeeItemSchema).min(1, "참석자를 1명 이상 입력하세요"),
  meetingDate: z.string().min(1, "회의 일시를 입력하세요"),
  requirementsSatisfiedEvidence: z.string().min(1, "요구사항 충족 증거를 입력하세요"),
  decision: z.enum(["PROCEED", "HOLD", "REJECTED"]),
  revisions: z.array(revisionItemSchema),
  unresolvedIssues: z.string().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
