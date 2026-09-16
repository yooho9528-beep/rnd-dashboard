"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferFormSchema, type TransferFormValues, DEFAULT_TRANSFER_ITEMS } from "@/lib/schemas/transfer";

interface Props {
  defaultValues?: Partial<TransferFormValues>;
  readOnly?: boolean;
  onSubmit: (values: TransferFormValues) => Promise<void>;
}

const emptyValues: TransferFormValues = {
  transferMethod: "FINALIZE_PRE_TRANSFER",
  transferredItems: DEFAULT_TRANSFER_ITEMS,
  receivingDept: "",
  transferDate: "",
  trainingCompleted: false,
  postMarketInfoRef: "",
};

export function TransferForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  const transferredItems = useFieldArray({ control, name: "transferredItems" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">이관 방법</label>
          <select {...register("transferMethod")} className="w-full rounded border px-3 py-2 text-sm">
            <option value="FINALIZE_PRE_TRANSFER">설계검증 단계 가이관 문서 최종 승인</option>
            <option value="NEW_DOCUMENT">개발 문서 정보 바탕 신규 작성</option>
          </select>
          {errors.transferMethod && <p className="text-xs text-red-600">{errors.transferMethod.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">이관 대상 정보 체크리스트</label>
          <div className="space-y-1">
            {transferredItems.fields.map((field, idx) => (
              <label key={field.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register(`transferredItems.${idx}.included`)} />
                {field.item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">인수 부서</label>
          <input {...register("receivingDept")} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.receivingDept && <p className="text-xs text-red-600">{errors.receivingDept.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">이관일자</label>
          <input type="date" {...register("transferDate")} className="rounded border px-3 py-2 text-sm" />
          {errors.transferDate && <p className="text-xs text-red-600">{errors.transferDate.message}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register("trainingCompleted")} />
            작업내용/검사방법/기술문서 교육 완료
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">판매 후 정보 반영 참조 (선택)</label>
          <input {...register("postMarketInfoRef")} className="w-full rounded border px-3 py-2 text-sm" />
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
