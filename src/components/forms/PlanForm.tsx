"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planFormSchema, type PlanFormValues } from "@/lib/schemas/plan";
import { StandardMultiSelect } from "./StandardMultiSelect";

interface Props {
  defaultValues?: Partial<PlanFormValues>;
  readOnly?: boolean;
  onSubmit: (values: PlanFormValues) => Promise<void>;
}

const emptyValues: PlanFormValues = {
  purposeScope: "",
  schedule: [{ phase: "", startDate: "", endDate: "" }],
  orgChart: "",
  resources: "",
  applicableStandardIds: [],
  deliverables: [],
  qualityPlanRef: "",
};

export function PlanForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  const schedule = useFieldArray({ control, name: "schedule" });
  const deliverables = useFieldArray({ control, name: "deliverables" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">목적 / 사양 요약</label>
          <textarea {...register("purposeScope")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.purposeScope && <p className="text-xs text-red-600">{errors.purposeScope.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">일정 프로그램 (단계 / 시작일 / 종료일)</label>
          <div className="space-y-2">
            {schedule.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`schedule.${idx}.phase`)}
                  placeholder="단계명"
                  className="w-1/3 rounded border px-2 py-1 text-sm"
                />
                <input
                  type="date"
                  {...register(`schedule.${idx}.startDate`)}
                  className="rounded border px-2 py-1 text-sm"
                />
                <input
                  type="date"
                  {...register(`schedule.${idx}.endDate`)}
                  className="rounded border px-2 py-1 text-sm"
                />
                {!readOnly && (
                  <button type="button" onClick={() => schedule.remove(idx)} className="text-xs text-red-500">
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => schedule.append({ phase: "", startDate: "", endDate: "" })}
              className="mt-1 text-xs text-slate-500 underline"
            >
              + 일정 추가
            </button>
          )}
          {errors.schedule && <p className="text-xs text-red-600">{errors.schedule.message as string}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">업무분장 / 책임과 권한</label>
          <textarea {...register("orgChart")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.orgChart && <p className="text-xs text-red-600">{errors.orgChart.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">재원 / 인력 / 시설</label>
          <textarea {...register("resources")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.resources && <p className="text-xs text-red-600">{errors.resources.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">적용 규격</label>
          <StandardMultiSelect
            value={watch("applicableStandardIds")}
            onChange={(ids) => setValue("applicableStandardIds", ids)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">단계별 산출물</label>
          <div className="space-y-2">
            {deliverables.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`deliverables.${idx}.phase`)}
                  placeholder="단계명"
                  className="w-1/3 rounded border px-2 py-1 text-sm"
                />
                <input
                  {...register(`deliverables.${idx}.deliverable`)}
                  placeholder="산출물"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                {!readOnly && (
                  <button type="button" onClick={() => deliverables.remove(idx)} className="text-xs text-red-500">
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => deliverables.append({ phase: "", deliverable: "" })}
              className="mt-1 text-xs text-slate-500 underline"
            >
              + 산출물 추가
            </button>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">품질계획 참조 (선택)</label>
          <input {...register("qualityPlanRef")} className="w-full rounded border px-3 py-2 text-sm" />
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
