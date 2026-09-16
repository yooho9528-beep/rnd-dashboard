"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/schemas/review";

interface Props {
  defaultValues?: Partial<ReviewFormValues>;
  readOnly?: boolean;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
}

const emptyValues: ReviewFormValues = {
  reviewStage: "",
  reviewCriteria: "",
  reviewedDocuments: "",
  attendees: [{ name: "", dept: "" }],
  meetingDate: "",
  requirementsSatisfiedEvidence: "",
  decision: "PROCEED",
  revisions: [],
  unresolvedIssues: "",
};

export function ReviewForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  const attendees = useFieldArray({ control, name: "attendees" });
  const revisions = useFieldArray({ control, name: "revisions" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">검토 대상 단계</label>
          <input {...register("reviewStage")} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.reviewStage && <p className="text-xs text-red-600">{errors.reviewStage.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">검토 기준</label>
          <textarea {...register("reviewCriteria")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.reviewCriteria && <p className="text-xs text-red-600">{errors.reviewCriteria.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">검토한 문서 목록</label>
          <textarea
            {...register("reviewedDocuments")}
            rows={2}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.reviewedDocuments && <p className="text-xs text-red-600">{errors.reviewedDocuments.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">회의 일시</label>
          <input type="date" {...register("meetingDate")} className="rounded border px-2 py-1 text-sm" />
          {errors.meetingDate && <p className="text-xs text-red-600">{errors.meetingDate.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">참석자</label>
          <div className="space-y-2">
            {attendees.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`attendees.${idx}.name`)}
                  placeholder="이름"
                  className="w-1/3 rounded border px-2 py-1 text-sm"
                />
                <input
                  {...register(`attendees.${idx}.dept`)}
                  placeholder="부서"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                {!readOnly && (
                  <button type="button" onClick={() => attendees.remove(idx)} className="text-xs text-red-500">
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => attendees.append({ name: "", dept: "" })}
              className="mt-1 text-xs text-slate-500 underline"
            >
              + 참석자 추가
            </button>
          )}
          {errors.attendees && <p className="text-xs text-red-600">{errors.attendees.message as string}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">요구사항 충족 증거</label>
          <textarea
            {...register("requirementsSatisfiedEvidence")}
            rows={3}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.requirementsSatisfiedEvidence && (
            <p className="text-xs text-red-600">{errors.requirementsSatisfiedEvidence.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">진행 여부 결정</label>
          <select {...register("decision")} className="rounded border px-2 py-1 text-sm">
            <option value="PROCEED">다음 단계 진행</option>
            <option value="HOLD">보류</option>
            <option value="REJECTED">반려</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">수정 사항</label>
          <div className="space-y-2">
            {revisions.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`revisions.${idx}.content`)}
                  placeholder="수정 내용"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <input
                  {...register(`revisions.${idx}.reason`)}
                  placeholder="수정 사유"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                {!readOnly && (
                  <button type="button" onClick={() => revisions.remove(idx)} className="text-xs text-red-500">
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => revisions.append({ content: "", reason: "" })}
              className="mt-1 text-xs text-slate-500 underline"
            >
              + 수정사항 추가
            </button>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">미해결 쟁점 (선택)</label>
          <textarea
            {...register("unresolvedIssues")}
            rows={2}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      {!readOnly && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      )}
    </form>
  );
}
