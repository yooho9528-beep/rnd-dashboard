import type { InputDocument } from "@/lib/types";
import { Section, Paragraph, SimpleTable, type ContentVariant } from "./shared";

interface Props {
  doc: InputDocument;
  standardNames: string[];
  variant: ContentVariant;
}

export function InputContent({ doc, standardNames, variant }: Props) {
  return (
    <div>
      <Section title="1. 고객 요구사항" variant={variant}>
        <Paragraph>{doc.customerRequirements}</Paragraph>
      </Section>

      <Section title="2. 의도된 사용 목적" variant={variant}>
        <Paragraph>{doc.intendedUse}</Paragraph>
      </Section>

      <Section title="3. 기능 / 성능 / 사용적합성" variant={variant}>
        <Paragraph>{doc.functionPerformanceUsability}</Paragraph>
      </Section>

      <Section title="4. 안전 요구사항" variant={variant}>
        <Paragraph>{doc.safetyRequirements}</Paragraph>
      </Section>

      <Section title="5. 적용 규격 / 법적 요구사항" variant={variant}>
        <Paragraph>{standardNames.length ? standardNames.join(", ") : "-"}</Paragraph>
      </Section>

      <Section title="6. 규제 요구사항" variant={variant}>
        <Paragraph>{doc.regulatoryRequirements || "-"}</Paragraph>
      </Section>

      <Section title="7. 이전 유사 설계 참조" variant={variant}>
        <Paragraph>{doc.priorDesignReference || "-"}</Paragraph>
      </Section>

      <Section title="8. 위험관리계획 참조 (OP-711)" variant={variant}>
        <Paragraph>{doc.riskMgmtPlanRef || "-"}</Paragraph>
      </Section>

      <Section title="9. 설계입력 체크리스트" variant={variant}>
        <SimpleTable
          headers={["항목", "충족여부", "근거"]}
          rows={doc.checklistItems.map((c) => [c.item, c.satisfied ? "충족" : "미충족", c.evidence || "-"])}
          variant={variant}
        />
      </Section>
    </div>
  );
}
