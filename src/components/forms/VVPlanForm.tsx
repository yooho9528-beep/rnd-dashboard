"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vvPlanFormSchema,
  type VVPlanFormValues,
} from "@/lib/schemas/vv-plan";
import type { ValidationActivity, VerificationMethod } from "@/lib/types";
import { StandardMultiSelect } from "./StandardMultiSelect";

interface Props {
  defaultValues?: Partial<VVPlanFormValues>;
  readOnly?: boolean;
  onSubmit: (values: VVPlanFormValues) => Promise<void>;
}

const emptyValues: VVPlanFormValues = {
  targetDescription: "",
  protocolPurpose: "",
  procedureSpec: "",
  applicableStandardIds: [],
  modelSelectionRationale: "",
  facilitiesEquipment: "",
  performedBy: "",
  sampleSizeRationale: "",
  verificationMethods: [],
  validationActivities: [],
};

const VERIFICATION_METHOD_LABELS: Record<VerificationMethod, string> = {
  DOCUMENT_REVIEW: "문서검토",
  LAB_TEST: "실험실 테스트",
  ALTERNATE_CALCULATION: "대체계산",
  SIMILARITY_ANALYSIS: "유사분석 또는 테스트",
  REPRESENTATIVE_SAMPLE: "대표샘플의 증명",
  PROTOTYPE: "원형(Prototype)",
};

const VALIDATION_ACTIVITY_LABELS: Record<ValidationActivity, string> = {
  PERFORMANCE_DATA: "작동성능 데이터 및 기능 파악",
  RELIABILITY: "신뢰성 파악",
  MAINTAINABILITY: "유지가능성 파악",
  QUALIFICATION_TEST: "승인시험",
  ANIMAL_TEST: "동물 성능 시험",
  CLINICAL_TEST: "전임상 및 임상시험",
  OTHER: "기타",
};

function ChipToggleGroup<T extends string>({
  options,
  labels,
  value,
  onChange,
}: {
  options: readonly T[];
  labels: Record<T, string>;
  value: T[];
  onChange: (next: T[]) => void;
}) {
  function toggle(option: T) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option}
          className={`cursor-pointer rounded border px-2 py-1 text-xs ${
            value.includes(option) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600"
          }`}
        >
          <input type="checkbox" className="hidden" checked={value.includes(option)} onChange={() => toggle(option)} />
          {labels[option]}
        </label>
      ))}
    </div>
  );
}

export function VVPlanForm({ defaultValues, readOnly, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VVPlanFormValues>({
    resolver: zodResolver(vvPlanFormSchema),
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-70">
        <div>
          <label className="mb-1 block text-sm font-medium">검증/유효성 확인 대상</label>
          <textarea {...register("targetDescription")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.targetDescription && <p className="text-xs text-red-600">{errors.targetDescription.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">프로토콜 목적</label>
          <textarea {...register("protocolPurpose")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.protocolPurpose && <p className="text-xs text-red-600">{errors.protocolPurpose.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">수행 절차와 명세</label>
          <textarea {...register("procedureSpec")} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.procedureSpec && <p className="text-xs text-red-600">{errors.procedureSpec.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">적용 규격</label>
          <StandardMultiSelect
            value={watch("applicableStandardIds")}
            onChange={(ids) => setValue("applicableStandardIds", ids)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">사용 모델 선정 근거 (선택)</label>
          <input {...register("modelSelectionRationale")} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">시설 / 장비 / 시험장비 (선택)</label>
          <textarea {...register("facilitiesEquipment")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">검증 활동 수행자 (선택)</label>
          <input {...register("performedBy")} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">샘플크기 등 통계적 근거 (선택)</label>
          <textarea {...register("sampleSizeRationale")} rows={2} className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">검증 방법</label>
          <ChipToggleGroup
            options={Object.keys(VERIFICATION_METHOD_LABELS) as VerificationMethod[]}
            labels={VERIFICATION_METHOD_LABELS}
            value={watch("verificationMethods")}
            onChange={(next) => setValue("verificationMethods", next)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">유효성 확인 활동</label>
          <ChipToggleGroup
            options={Object.keys(VALIDATION_ACTIVITY_LABELS) as ValidationActivity[]}
            labels={VALIDATION_ACTIVITY_LABELS}
            value={watch("validationActivities")}
            onChange={(next) => setValue("validationActivities", next)}
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
