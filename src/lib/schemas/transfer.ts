import { z } from "zod";

export const transferItemEntrySchema = z.object({
  item: z.string(),
  included: z.boolean(),
});

/** F702-8 설계 및 개발 이관보고서 — 사용자가 폼에서 입력하는 필드 (헤더 제외) */
export const transferFormSchema = z.object({
  transferMethod: z.enum(["FINALIZE_PRE_TRANSFER", "NEW_DOCUMENT"]),
  transferredItems: z.array(transferItemEntrySchema),
  receivingDept: z.string().min(1, "인수 부서를 입력하세요"),
  transferDate: z.string().min(1, "이관일자를 입력하세요"),
  trainingCompleted: z.boolean(),
  postMarketInfoRef: z.string().optional(),
});

export type TransferFormValues = z.infer<typeof transferFormSchema>;

/** 11.1(2) 이관 대상 정보 고정 체크리스트 항목 */
export const DEFAULT_TRANSFER_ITEMS: { item: string; included: boolean }[] = [
  "제품표준서",
  "제조공정도/작업표준서",
  "수입/공정/제품/출하검사기준서",
  "공정밸리데이션 (IQ/OQ/PQ)",
  "설계 도면, BOM",
  "라벨, 사용설명서, Box 등",
  "제조장치와 보조물",
].map((item) => ({ item, included: false }));
