"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputFormSchema, type InputFormValues } from "@/lib/schemas/input";
import { StandardMultiSelect } from "./StandardMultiSelect";

interface Props {
  defaultValues?: Partial<InputFormValues>;
  readOnly?: boolean;
  onSubmit: (values: InputFormValues) => Promise<void>;
}

const emptyValues: InputFormValues = {
  customerRequirements: "",
  intendedUse: "",
  functionPerformanceUsability: "",
  safetyRequirements: "",
  applicableStandardIds: [],
  regulatoryRequirements: "",
  priorDesignReference: "",
  riskMgmtPlanRef: "",
  checklistItems: [],
};

export function InputForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InputFormValues>({
    resolver: zodResolver(inputFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  const checklist = useFieldArray({ control, name: "checklistItems" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">고객 요구사항</label>
          <textarea {...register("customerRequirements")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.customerRequirements && <p className="text-xs text-red-600">{errors.customerRequirements.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">의도된 사용 목적</label>
          <textarea {...register("intendedUse")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.intendedUse && <p className="text-xs text-red-600">{errors.intendedUse.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">기능 / 성능 / 사용적합성</label>
          <textarea
            {...register("functionPerformanceUsability")}
            rows={3}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.functionPerformanceUsability && (
            <p className="text-xs text-red-600">{errors.functionPerformanceUsability.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">안전 요구사항</label>
          <textarea {...register("safetyRequirements")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.safetyRequirements && <p className="text-xs text-red-600">{errors.safetyRequirements.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">적용 규격 / 법적 요구사항</label>
          <StandardMultiSelect
            value={watch("applicableStandardIds")}
            onChange={(ids) => setValue("applicableStandardIds", ids)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">규제 요구사항 (선택)</label>
          <input {...register("regulatoryRequirements")} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">이전 유사 설계 참조 (선택)</label>
          <input {...register("priorDesignReference")} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">위험관리계획 참조 (OP-711, 선택)</label>
          <input {...register("riskMgmtPlanRef")} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">설계입력 체크리스트</label>
          <div className="space-y-2">
            {checklist.fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  {...register(`checklistItems.${idx}.item`)}
                  placeholder="항목"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" {...register(`checklistItems.${idx}.satisfied`)} />
                  충족
                </label>
                <input
                  {...register(`checklistItems.${idx}.evidence`)}
                  placeholder="근거"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                {!readOnly && (
                  <button type="button" onClick={() => checklist.remove(idx)} className="text-xs text-red-500">
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => checklist.append({ item: "", satisfied: false, evidence: "" })}
              className="mt-1 text-xs text-slate-500 underline"
            >
              + 체크리스트 추가
            </button>
          )}
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
