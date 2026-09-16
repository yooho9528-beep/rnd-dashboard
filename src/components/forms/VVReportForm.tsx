"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vvReportFormSchema, type VVReportFormValues } from "@/lib/schemas/vv-report";

interface Props {
  defaultValues?: Partial<VVReportFormValues>;
  readOnly?: boolean;
  onSubmit: (values: VVReportFormValues) => Promise<void>;
}

const emptyValues: VVReportFormValues = {
  vvPlanRef: "",
  resultsSummary: "",
  testResults: [{ item: "", criterion: "", result: "", judgement: "PASS" }],
  nonConformities: "",
  conclusion: "PASS",
  dhfRecorded: false,
};

export function VVReportForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VVReportFormValues>({
    resolver: zodResolver(vvReportFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  const testResults = useFieldArray({ control, name: "testResults" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">검증계획서 참조</label>
          <input {...register("vvPlanRef")} className="w-full rounded border px-3 py-2 text-sm" placeholder="예: F702-5-BP-2026-001-001" />
          {errors.vvPlanRef && <p className="text-xs text-red-600">{errors.vvPlanRef.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">결과 요약</label>
          <textarea {...register("resultsSummary")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.resultsSummary && <p className="text-xs text-red-600">{errors.resultsSummary.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">시험 결과</label>
          <div className="space-y-2">
            {testResults.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`testResults.${idx}.item`)}
                  placeholder="항목"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <input
                  {...register(`testResults.${idx}.criterion`)}
                  placeholder="기준"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <input
                  {...register(`testResults.${idx}.result`)}
                  placeholder="결과"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <select {...register(`testResults.${idx}.judgement`)} className="rounded border px-2 py-1 text-sm">
                  <option value="PASS">적합</option>
                  <option value="FAIL">부적합</option>
                </select>
                {!readOnly && (
                  <button type="button" onClick={() => testResults.remove(idx)} className="text-xs text-red-500">
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => testResults.append({ item: "", criterion: "", result: "", judgement: "PASS" })}
              className="mt-1 text-xs text-slate-500 underline"
            >
              + 시험결과 추가
            </button>
          )}
          {errors.testResults && <p className="text-xs text-red-600">{errors.testResults.message as string}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">부적합 사항 (선택)</label>
          <textarea {...register("nonConformities")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">결론</label>
          <select {...register("conclusion")} className="rounded border px-2 py-1 text-sm">
            <option value="PASS">적합</option>
            <option value="FAIL">부적합</option>
            <option value="CONDITIONAL">조건부 적합</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register("dhfRecorded")} />
            설계이력파일에 기록됨
          </label>
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
