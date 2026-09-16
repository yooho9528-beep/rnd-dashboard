import { z } from "zod";

export const testResultItemSchema = z.object({
  item: z.string().min(1, "항목을 입력하세요"),
  criterion: z.string().min(1, "기준을 입력하세요"),
  result: z.string().min(1, "결과를 입력하세요"),
  judgement: z.enum(["PASS", "FAIL"]),
});

/** F702-6 개발검증 및 유효성 확인보고서 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const vvReportFormSchema = z.object({
  vvPlanRef: z.string().min(1, "검증계획서 참조를 입력하세요"),
  resultsSummary: z.string().min(1, "결과 요약을 입력하세요"),
  testResults: z.array(testResultItemSchema).min(1, "시험 결과를 1개 이상 입력하세요"),
  nonConformities: z.string().optional(),
  conclusion: z.enum(["PASS", "FAIL", "CONDITIONAL"]),
  dhfRecorded: z.boolean(),
});

export type VVReportFormValues = z.infer<typeof vvReportFormSchema>;
