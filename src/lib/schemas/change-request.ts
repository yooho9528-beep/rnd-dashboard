import { z } from "zod";

/** F702-7 설계변경요청서 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const changeRequestFormSchema = z.object({
  changeReason: z.string().min(1, "변경 사유를 입력하세요"),
  changeDescription: z.string().min(1, "변경 내용을 입력하세요"),
  affectedDocuments: z.string().min(1, "영향받는 문서를 입력하세요"),
  significanceLevel: z.enum(["MAJOR", "MINOR"]),
  affectedStages: z.string().min(1, "요구되는 설계 및 개발 단계 범위를 입력하세요"),
  impactAssessment: z.string().min(1, "영향평가 내용을 입력하세요"),
});

export type ChangeRequestFormValues = z.infer<typeof changeRequestFormSchema>;
