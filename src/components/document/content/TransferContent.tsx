import type { TransferDocument } from "@/lib/types";
import { Section, Paragraph, SimpleTable, type ContentVariant } from "./shared";

interface Props {
  doc: TransferDocument;
  variant: ContentVariant;
}

const TRANSFER_METHOD_LABEL: Record<TransferDocument["transferMethod"], string> = {
  FINALIZE_PRE_TRANSFER: "설계검증 단계 가이관 문서 최종 승인",
  NEW_DOCUMENT: "개발 문서 정보 바탕 신규 작성",
};

export function TransferContent({ doc, variant }: Props) {
  return (
    <div>
      <Section title="1. 이관 방법" variant={variant}>
        <Paragraph>{TRANSFER_METHOD_LABEL[doc.transferMethod]}</Paragraph>
      </Section>

      <Section title="2. 이관 대상 정보" variant={variant}>
        <SimpleTable
          headers={["이관 대상", "포함 여부"]}
          rows={doc.transferredItems.map((t) => [t.item, t.included ? "포함" : "미포함"])}
          variant={variant}
        />
      </Section>

      <Section title="3. 인수 부서" variant={variant}>
        <Paragraph>{doc.receivingDept}</Paragraph>
      </Section>

      <Section title="4. 이관일자" variant={variant}>
        <Paragraph>{doc.transferDate}</Paragraph>
      </Section>

      <Section title="5. 교육 완료 여부" variant={variant}>
        <Paragraph>{doc.trainingCompleted ? "완료" : "미완료"}</Paragraph>
      </Section>

      <Section title="6. 판매 후 정보 반영 참조" variant={variant}>
        <Paragraph>{doc.postMarketInfoRef || "-"}</Paragraph>
      </Section>
    </div>
  );
}
