import { z } from "zod";

export const verificationMethodSchema = z.enum([
  "DOCUMENT_REVIEW",
  "LAB_TEST",
  "ALTERNATE_CALCULATION",
  "SIMILARITY_ANALYSIS",
  "REPRESENTATIVE_SAMPLE",
  "PROTOTYPE",
]);

export const validationActivitySchema = z.enum([
  "PERFORMANCE_DATA",
  "RELIABILITY",
  "MAINTAINABILITY",
  "QUALIFICATION_TEST",
  "ANIMAL_TEST",
  "CLINICAL_TEST",
  "OTHER",
]);

/** F702-5 개발검증 및 유효성 확인계획서 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const vvPlanFormSchema = z.object({
  targetDescription: z.string().min(1, "검증/유효성 확인 대상을 입력하세요"),
  protocolPurpose: z.string().min(1, "프로토콜 목적을 입력하세요"),
  procedureSpec: z.string().min(1, "수행 절차와 명세를 입력하세요"),
  applicableStandardIds: z.array(z.string()),
  modelSelectionRationale: z.string().optional(),
  facilitiesEquipment: z.string().optional(),
  performedBy: z.string().optional(),
  sampleSizeRationale: z.string().optional(),
  verificationMethods: z.array(verificationMethodSchema),
  validationActivities: z.array(validationActivitySchema),
});

export type VVPlanFormValues = z.infer<typeof vvPlanFormSchema>;
