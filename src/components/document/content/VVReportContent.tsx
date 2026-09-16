import type { VVReportDocument, VVConclusion } from "@/lib/types";
import { Section, Paragraph, SimpleTable, type ContentVariant } from "./shared";

interface Props {
  doc: VVReportDocument;
  variant: ContentVariant;
}

const CONCLUSION_LABEL: Record<VVConclusion, string> = {
  PASS: "적합",
  FAIL: "부적합",
  CONDITIONAL: "조건부 적합",
};

export function VVReportContent({ doc, variant }: Props) {
  return (
    <div>
      <Section title="1. 검증계획서 참조" variant={variant}>
        <Paragraph>{doc.vvPlanRef}</Paragraph>
      </Section>

      <Section title="2. 결과 요약" variant={variant}>
        <Paragraph>{doc.resultsSummary}</Paragraph>
      </Section>

      <Section title="3. 시험 결과" variant={variant}>
        <SimpleTable
          headers={["항목", "기준", "결과", "판정"]}
          rows={doc.testResults.map((t) => [t.item, t.criterion, t.result, t.judgement === "PASS" ? "적합" : "부적합"])}
          variant={variant}
        />
      </Section>

      <Section title="4. 부적합 사항" variant={variant}>
        <Paragraph>{doc.nonConformities || "-"}</Paragraph>
      </Section>

      <Section title="5. 결론" variant={variant}>
        <Paragraph>{CONCLUSION_LABEL[doc.conclusion]}</Paragraph>
      </Section>

      <Section title="6. 설계이력파일(DHF) 기록 여부" variant={variant}>
        <Paragraph>{doc.dhfRecorded ? "기록됨" : "기록 안됨"}</Paragraph>
      </Section>
    </div>
  );
}
