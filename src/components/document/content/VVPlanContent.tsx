import type { ValidationActivity, VerificationMethod, VVPlanDocument } from "@/lib/types";
import { Section, Paragraph, type ContentVariant } from "./shared";

interface Props {
  doc: VVPlanDocument;
  standardNames: string[];
  variant: ContentVariant;
}

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

export function VVPlanContent({ doc, standardNames, variant }: Props) {
  return (
    <div>
      <Section title="1. 검증/유효성 확인 대상" variant={variant}>
        <Paragraph>{doc.targetDescription}</Paragraph>
      </Section>

      <Section title="2. 프로토콜 목적" variant={variant}>
        <Paragraph>{doc.protocolPurpose}</Paragraph>
      </Section>

      <Section title="3. 수행 절차와 명세" variant={variant}>
        <Paragraph>{doc.procedureSpec}</Paragraph>
      </Section>

      <Section title="4. 적용 규격" variant={variant}>
        <Paragraph>{standardNames.length ? standardNames.join(", ") : "-"}</Paragraph>
      </Section>

      <Section title="5. 사용 모델 선정 근거" variant={variant}>
        <Paragraph>{doc.modelSelectionRationale || "-"}</Paragraph>
      </Section>

      <Section title="6. 시설 / 장비 / 시험장비" variant={variant}>
        <Paragraph>{doc.facilitiesEquipment || "-"}</Paragraph>
      </Section>

      <Section title="7. 검증 활동 수행자" variant={variant}>
        <Paragraph>{doc.performedBy || "-"}</Paragraph>
      </Section>

      <Section title="8. 샘플크기 등 통계적 근거" variant={variant}>
        <Paragraph>{doc.sampleSizeRationale || "-"}</Paragraph>
      </Section>

      <Section title="9. 검증 방법 / 유효성 확인 활동" variant={variant}>
        <Paragraph>
          {doc.verificationMethods.length
            ? doc.verificationMethods.map((m) => VERIFICATION_METHOD_LABELS[m]).join(", ")
            : "-"}
        </Paragraph>
        <Paragraph>
          {doc.validationActivities.length
            ? doc.validationActivities.map((a) => VALIDATION_ACTIVITY_LABELS[a]).join(", ")
            : "-"}
        </Paragraph>
      </Section>
    </div>
  );
}
