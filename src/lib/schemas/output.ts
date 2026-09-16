import { z } from "zod";

export const acceptanceCriterionSchema = z.object({
  criterion: z.string().min(1, "판정 기준을 입력하세요"),
  method: z.string().optional(),
});

/** F702-3 개발출력서 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const outputFormSchema = z.object({
  partIds: z.array(z.string()),
  drawingAttachmentIds: z.array(z.string()),
  processFlow: z.string().min(1, "제조 공정을 입력하세요"),
  productSpecRef: z.string().optional(),
  verificationPlanRef: z.string().optional(),
  acceptanceCriteria: z.array(acceptanceCriterionSchema).min(1, "판정 기준을 1개 이상 입력하세요"),
  userManualAttachmentIds: z.array(z.string()),
});

export type OutputFormValues = z.infer<typeof outputFormSchema>;
