import { z } from "zod";

export const documentStatusSchema = z.enum(["DRAFT", "SUBMITTED", "IN_REVIEW", "APPROVED", "REJECTED"]);

export const documentHeaderSchema = z.object({
  docNo: z.string().min(1),
  revNo: z.number().int().min(0),
  dcoNo: z.string().optional(),
  projectId: z.string().min(1),
  status: documentStatusSchema,
  authorUid: z.string().min(1),
  createdAt: z.string().min(1),
  reviewerUid: z.string().optional(),
  reviewedAt: z.string().optional(),
  approverUid: z.string().optional(),
  approvedAt: z.string().optional(),
  changeReason: z.string().optional(),
});
