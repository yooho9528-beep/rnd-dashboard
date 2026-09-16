"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { outputFormSchema, type OutputFormValues } from "@/lib/schemas/output";
import { PartMultiSelect } from "./PartMultiSelect";

interface Props {
  defaultValues?: Partial<OutputFormValues>;
  readOnly?: boolean;
  onSubmit: (values: OutputFormValues) => Promise<void>;
}

const emptyValues: OutputFormValues = {
  partIds: [],
  drawingAttachmentIds: [],
  processFlow: "",
  productSpecRef: "",
  verificationPlanRef: "",
  acceptanceCriteria: [{ criterion: "", method: "" }],
  userManualAttachmentIds: [],
};

export function OutputForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OutputFormValues>({
    resolver: zodResolver(outputFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  const criteria = useFieldArray({ control, name: "acceptanceCriteria" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">부품 / 원자재 목록</label>
          <PartMultiSelect value={watch("partIds")} onChange={(ids) => setValue("partIds", ids)} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">제조 공정 (공정 흐름 / 작업 표준)</label>
          <textarea {...register("processFlow")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.processFlow && <p className="text-xs text-red-600">{errors.processFlow.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">제품 사양 참조 (선택)</label>
          <input {...register("productSpecRef")} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">검증 계획 참조 (선택)</label>
          <input {...register("verificationPlanRef")} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">판정 기준 (측정 가능한 기준)</label>
          <div className="space-y-2">
            {criteria.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`acceptanceCriteria.${idx}.criterion`)}
                  placeholder="판정 기준"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <input
                  {...register(`acceptanceCriteria.${idx}.method`)}
                  placeholder="측정/시험 방법 (선택)"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                {!readOnly && (
                  <button type="button" onClick={() => criteria.remove(idx)} className="text-xs text-red-500">
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => criteria.append({ criterion: "", method: "" })}
              className="mt-1 text-xs text-slate-500 underline"
            >
              + 판정 기준 추가
            </button>
          )}
          {errors.acceptanceCriteria && (
            <p className="text-xs text-red-600">{errors.acceptanceCriteria.message as string}</p>
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
