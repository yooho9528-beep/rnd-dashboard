import type { ChangeRequestDocument } from "@/lib/types";
import { Section, Paragraph, type ContentVariant } from "./shared";

interface Props {
  doc: ChangeRequestDocument;
  variant: ContentVariant;
}

const SIGNIFICANCE_LABEL: Record<ChangeRequestDocument["significanceLevel"], string> = {
  MAJOR: "중대한 변경",
  MINOR: "사소한 변경",
};

export function ChangeRequestContent({ doc, variant }: Props) {
  return (
    <div>
      <Section title="1. 변경 사유" variant={variant}>
        <Paragraph>{doc.changeReason}</Paragraph>
      </Section>

      <Section title="2. 변경 내용" variant={variant}>
        <Paragraph>{doc.changeDescription}</Paragraph>
      </Section>

      <Section title="3. 영향받는 문서 / 도면" variant={variant}>
        <Paragraph>{doc.affectedDocuments}</Paragraph>
      </Section>

      <Section title="4. 변경 중요도" variant={variant}>
        <Paragraph>{SIGNIFICANCE_LABEL[doc.significanceLevel]}</Paragraph>
      </Section>

      <Section title="5. 요구되는 설계 및 개발 단계 범위" variant={variant}>
        <Paragraph>{doc.affectedStages}</Paragraph>
      </Section>

      <Section title="6. 영향평가" variant={variant}>
        <Paragraph>{doc.impactAssessment}</Paragraph>
      </Section>
    </div>
  );
}
