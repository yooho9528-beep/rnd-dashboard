"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeRequestFormSchema, type ChangeRequestFormValues } from "@/lib/schemas/change-request";

interface Props {
  defaultValues?: Partial<ChangeRequestFormValues>;
  readOnly?: boolean;
  onSubmit: (values: ChangeRequestFormValues) => Promise<void>;
}

const emptyValues: ChangeRequestFormValues = {
  changeReason: "",
  changeDescription: "",
  affectedDocuments: "",
  significanceLevel: "MINOR",
  affectedStages: "",
  impactAssessment: "",
};

export function ChangeRequestForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangeRequestFormValues>({
    resolver: zodResolver(changeRequestFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">변경 사유</label>
          <textarea {...register("changeReason")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.changeReason && <p className="text-xs text-red-600">{errors.changeReason.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">변경 내용</label>
          <textarea {...register("changeDescription")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.changeDescription && <p className="text-xs text-red-600">{errors.changeDescription.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">영향받는 문서 / 도면</label>
          <textarea {...register("affectedDocuments")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.affectedDocuments && <p className="text-xs text-red-600">{errors.affectedDocuments.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">변경 중요도</label>
          <select {...register("significanceLevel")} className="w-full rounded border px-3 py-2 text-sm">
            <option value="MAJOR">중대한 변경</option>
            <option value="MINOR">사소한 변경</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">요구되는 설계 및 개발 단계 범위</label>
          <textarea {...register("affectedStages")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.affectedStages && <p className="text-xs text-red-600">{errors.affectedStages.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            영향평가 (구성품 / 생산중 제품 / 위험관리 / 제품실현 프로세스)
          </label>
          <textarea {...register("impactAssessment")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.impactAssessment && <p className="text-xs text-red-600">{errors.impactAssessment.message}</p>}
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
