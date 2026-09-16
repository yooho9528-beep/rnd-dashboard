import type { ReviewDecision, ReviewDocument } from "@/lib/types";
import { Section, Paragraph, SimpleTable, type ContentVariant } from "./shared";

interface Props {
  doc: ReviewDocument;
  variant: ContentVariant;
}

const DECISION_LABEL: Record<ReviewDecision, string> = {
  PROCEED: "다음 단계 진행",
  HOLD: "보류",
  REJECTED: "반려",
};

export function ReviewContent({ doc, variant }: Props) {
  return (
    <div>
      <Section title="1. 검토 대상 단계" variant={variant}>
        <Paragraph>{doc.reviewStage}</Paragraph>
      </Section>

      <Section title="2. 검토 기준" variant={variant}>
        <Paragraph>{doc.reviewCriteria}</Paragraph>
      </Section>

      <Section title="3. 검토한 문서 목록" variant={variant}>
        <Paragraph>{doc.reviewedDocuments}</Paragraph>
      </Section>

      <Section title="4. 회의 일시" variant={variant}>
        <Paragraph>{doc.meetingDate}</Paragraph>
      </Section>

      <Section title="5. 참석자" variant={variant}>
        <SimpleTable
          headers={["이름", "부서"]}
          rows={doc.attendees.map((a) => [a.name, a.dept])}
          variant={variant}
        />
      </Section>

      <Section title="6. 요구사항 충족 증거" variant={variant}>
        <Paragraph>{doc.requirementsSatisfiedEvidence}</Paragraph>
      </Section>

      <Section title="7. 진행 여부 결정" variant={variant}>
        <Paragraph>{DECISION_LABEL[doc.decision]}</Paragraph>
      </Section>

      <Section title="8. 수정 사항" variant={variant}>
        <SimpleTable
          headers={["수정 내용", "사유"]}
          rows={doc.revisions.map((r) => [r.content, r.reason])}
          variant={variant}
        />
      </Section>

      <Section title="9. 미해결 쟁점" variant={variant}>
        <Paragraph>{doc.unresolvedIssues || "-"}</Paragraph>
      </Section>
    </div>
  );
}
