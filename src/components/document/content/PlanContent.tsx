import type { PlanDocument } from "@/lib/types";
import { Section, Paragraph, SimpleTable, type ContentVariant } from "./shared";

interface Props {
  doc: PlanDocument;
  standardNames: string[];
  variant: ContentVariant;
}

export function PlanContent({ doc, standardNames, variant }: Props) {
  return (
    <div>
      <Section title="1. 목적 / 사양 요약" variant={variant}>
        <Paragraph>{doc.purposeScope}</Paragraph>
      </Section>

      <Section title="2. 일정 프로그램" variant={variant}>
        <SimpleTable
          headers={["단계", "시작일", "종료일"]}
          rows={doc.schedule.map((s) => [s.phase, s.startDate, s.endDate])}
          variant={variant}
        />
      </Section>

      <Section title="3. 업무분장 / 책임과 권한" variant={variant}>
        <Paragraph>{doc.orgChart}</Paragraph>
      </Section>

      <Section title="4. 재원 / 인력 / 시설" variant={variant}>
        <Paragraph>{doc.resources}</Paragraph>
      </Section>

      <Section title="5. 적용 규격" variant={variant}>
        <Paragraph>{standardNames.length ? standardNames.join(", ") : "-"}</Paragraph>
      </Section>

      <Section title="6. 단계별 산출물" variant={variant}>
        <SimpleTable
          headers={["단계", "산출물"]}
          rows={doc.deliverables.map((d) => [d.phase, d.deliverable])}
          variant={variant}
        />
      </Section>

      <Section title="7. 품질계획 참조" variant={variant}>
        <Paragraph>{doc.qualityPlanRef || "-"}</Paragraph>
      </Section>
    </div>
  );
}
