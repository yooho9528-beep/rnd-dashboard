import { z } from "zod";

export const scheduleItemSchema = z.object({
  phase: z.string().min(1, "단계명을 입력하세요"),
  startDate: z.string().min(1, "시작일을 입력하세요"),
  endDate: z.string().min(1, "종료일을 입력하세요"),
});

export const deliverableItemSchema = z.object({
  phase: z.string().min(1, "단계명을 입력하세요"),
  deliverable: z.string().min(1, "산출물을 입력하세요"),
});

/** F702-1 개발계획서 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const planFormSchema = z.object({
  purposeScope: z.string().min(1, "목적/사양 요약을 입력하세요"),
  schedule: z.array(scheduleItemSchema).min(1, "일정 프로그램을 1개 이상 입력하세요"),
  orgChart: z.string().min(1, "업무분장/책임을 입력하세요"),
  resources: z.string().min(1, "재원/인력/시설을 입력하세요"),
  applicableStandardIds: z.array(z.string()),
  deliverables: z.array(deliverableItemSchema),
  qualityPlanRef: z.string().optional(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
