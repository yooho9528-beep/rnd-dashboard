import { z } from "zod";

export const checklistItemSchema = z.object({
  item: z.string().min(1, "체크리스트 항목을 입력하세요"),
  satisfied: z.boolean(),
  evidence: z.string().optional(),
});

/** F702-2 개발입력서 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const inputFormSchema = z.object({
  customerRequirements: z.string().min(1, "고객 요구사항을 입력하세요"),
  intendedUse: z.string().min(1, "의도된 사용목적을 입력하세요"),
  functionPerformanceUsability: z.string().min(1, "기능/성능/사용적합성을 입력하세요"),
  safetyRequirements: z.string().min(1, "안전 요구사항을 입력하세요"),
  applicableStandardIds: z.array(z.string()),
  regulatoryRequirements: z.string().optional(),
  priorDesignReference: z.string().optional(),
  riskMgmtPlanRef: z.string().optional(),
  checklistItems: z.array(checklistItemSchema),
});

export type InputFormValues = z.infer<typeof inputFormSchema>;
