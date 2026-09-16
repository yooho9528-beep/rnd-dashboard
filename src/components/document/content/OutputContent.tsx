import type { OutputDocument } from "@/lib/types";
import { Section, Paragraph, SimpleTable, type ContentVariant } from "./shared";

interface Props {
  doc: OutputDocument;
  partLabels: string[];
  variant: ContentVariant;
}

export function OutputContent({ doc, partLabels, variant }: Props) {
  return (
    <div>
      <Section title="1. 부품 / 원자재 목록" variant={variant}>
        <Paragraph>{partLabels.length ? partLabels.join(", ") : "-"}</Paragraph>
      </Section>

      <Section title="2. 제조 공정 (공정 흐름 / 작업 표준)" variant={variant}>
        <Paragraph>{doc.processFlow}</Paragraph>
      </Section>

      <Section title="3. 제품 사양 참조" variant={variant}>
        <Paragraph>{doc.productSpecRef || "-"}</Paragraph>
      </Section>

      <Section title="4. 검증 계획 참조" variant={variant}>
        <Paragraph>{doc.verificationPlanRef || "-"}</Paragraph>
      </Section>

      <Section title="5. 판정 기준" variant={variant}>
        <SimpleTable
          headers={["판정 기준", "측정/시험 방법"]}
          rows={doc.acceptanceCriteria.map((c) => [c.criterion, c.method || "-"])}
          variant={variant}
        />
      </Section>
    </div>
  );
}
