// 2단계 문서(F702-4~8) 더미 데이터 시딩 스크립트.
// 기존 seed-dummy-data.mjs로 만든 프로젝트에 문서 5건을 추가한다.
// 사용법: node scripts/seed-dummy-data-phase2.mjs <projectId>
import { config } from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

config({ path: new URL("../.env.local", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1") });

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

const AUTHOR_UID = "vENuxMMVSyfBc6EiwPkIBmUHWNS2"; // yooho9528@gmail.com 테스트 계정

const FORM_CODE = {
  REVIEW: "F702-4",
  VV_PLAN: "F702-5",
  VV_REPORT: "F702-6",
  CHANGE_REQUEST: "F702-7",
  TRANSFER: "F702-8",
};
const COLLECTION = {
  REVIEW: "documents_review",
  VV_PLAN: "documents_vv_plan",
  VV_REPORT: "documents_vv_report",
  CHANGE_REQUEST: "documents_change_request",
  TRANSFER: "documents_transfer",
};

function docNo(type, projectCode, seq) {
  return `${FORM_CODE[type]}-${projectCode}-${String(seq).padStart(3, "0")}`;
}

function makeHeader(type, projectId, projectCode, seq, status = "DRAFT") {
  return {
    docNo: docNo(type, projectCode, seq),
    revNo: 0,
    projectId,
    status,
    authorUid: AUTHOR_UID,
    createdAt: new Date().toISOString(),
  };
}

async function nextSeq(projectId, type) {
  const ref = db.doc(`doc_counters/${projectId}_${type}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const seq = (snap.exists ? snap.data().seq : 0) + 1;
    tx.set(ref, { seq }, { merge: true });
    return seq;
  });
}

async function main() {
  const projectId = process.argv[2];
  if (!projectId) {
    console.error("사용법: node scripts/seed-dummy-data-phase2.mjs <projectId>");
    process.exit(1);
  }
  const projectSnap = await db.doc(`projects/${projectId}`).get();
  if (!projectSnap.exists) {
    console.error(`프로젝트를 찾을 수 없습니다: ${projectId}`);
    process.exit(1);
  }
  const projectCode = projectSnap.data().code;

  // F702-4 설계검토회의록
  const reviewSeq = await nextSeq(projectId, "REVIEW");
  const reviewRef = db.collection(COLLECTION.REVIEW).doc();
  await reviewRef.set({
    header: makeHeader("REVIEW", projectId, projectCode, reviewSeq, "SUBMITTED"),
    reviewStage: "설계입력/출력 단계",
    reviewCriteria: "설계입력서(F702-2) 및 설계출력서(F702-3) 요구사항 충족 여부",
    reviewedDocuments: "설계입력서 rev.0, 설계출력서 rev.0, 위험관리계획서 RM-2026-BP100",
    attendees: [
      { name: "김개발", dept: "개발팀" },
      { name: "이품질", dept: "품질관리팀" },
      { name: "박영업", dept: "영업부" },
    ],
    meetingDate: "2026-03-20",
    requirementsSatisfiedEvidence: "설계출력서의 판정 기준이 설계입력서의 정확도/안전 요구사항을 모두 충족함을 확인함",
    decision: "PROCEED",
    revisions: [{ content: "과압 방지 회로 사양 명확화", reason: "설계입력 체크리스트 미충족 항목 보완" }],
    unresolvedIssues: "",
    attachmentIds: [],
  });
  console.log(`설계검토회의록 생성: ${reviewRef.id}`);

  // F702-5 검증/유효성 확인계획서
  const vvPlanSeq = await nextSeq(projectId, "VV_PLAN");
  const vvPlanRef = db.collection(COLLECTION.VV_PLAN).doc();
  await vvPlanRef.set({
    header: makeHeader("VV_PLAN", projectId, projectCode, vvPlanSeq, "DRAFT"),
    targetDescription: "혈압 측정 정확도 및 과압 방지 안전장치 검증, 사용적합성 유효성 확인",
    protocolPurpose: "ISO 81060-2 기준 임상 비교시험을 통한 측정 정확도 검증",
    procedureSpec: "성인 피험자 85명 대상 청진법 대비 비교 측정, 3회 반복",
    applicableStandardIds: [],
    modelSelectionRationale: "양산 예정 최종 시제품(EVT2) 5대 무작위 추출",
    facilitiesEquipment: "임상시험기관 시험실, 표준 수은주 혈압계, 청진기",
    performedBy: "외부 임상시험기관(㈜메디클리니컬) + 자사 품질관리팀 입회",
    sampleSizeRationale: "ISO 81060-2 부속서 통계 기준에 따른 최소 85명 산정",
    verificationMethods: ["LAB_TEST", "REPRESENTATIVE_SAMPLE"],
    validationActivities: ["PERFORMANCE_DATA", "CLINICAL_TEST"],
    attachmentIds: [],
  });
  console.log(`검증/유효성 확인계획서 생성: ${vvPlanRef.id}`);

  // F702-6 검증/유효성 확인보고서
  const vvReportSeq = await nextSeq(projectId, "VV_REPORT");
  const vvReportRef = db.collection(COLLECTION.VV_REPORT).doc();
  await vvReportRef.set({
    header: makeHeader("VV_REPORT", projectId, projectCode, vvReportSeq, "DRAFT"),
    vvPlanRef: docNo("VV_PLAN", projectCode, vvPlanSeq),
    resultsSummary: "85명 임상 비교시험 결과 평균 오차 ±2.1mmHg로 요구사항(±3mmHg) 충족",
    testResults: [
      { item: "수축기 혈압 정확도", criterion: "±3mmHg 이내", result: "평균 오차 2.1mmHg", judgement: "PASS" },
      { item: "이완기 혈압 정확도", criterion: "±3mmHg 이내", result: "평균 오차 1.8mmHg", judgement: "PASS" },
      { item: "과압 방지 안전시험", criterion: "3초 이내 자동 배기", result: "평균 1.4초", judgement: "PASS" },
    ],
    nonConformities: "",
    conclusion: "PASS",
    dhfRecorded: true,
    attachmentIds: [],
  });
  console.log(`검증/유효성 확인보고서 생성: ${vvReportRef.id}`);

  // F702-7 설계변경요청서
  const changeSeq = await nextSeq(projectId, "CHANGE_REQUEST");
  const changeRef = db.collection(COLLECTION.CHANGE_REQUEST).doc();
  await changeRef.set({
    header: makeHeader("CHANGE_REQUEST", projectId, projectCode, changeSeq, "DRAFT"),
    changeReason: "임상시험 중 일부 피험자에서 커프 고정력 부족으로 측정값 편차 발생",
    changeDescription: "커프 벨크로 폭을 30mm에서 40mm로 변경, 고정력 시험 기준 추가",
    affectedDocuments: "설계출력서(부품목록), 커프 도면 DWG-CUFF-001",
    significanceLevel: "MINOR",
    affectedStages: "설계출력 단계 재검토, 검증계획서 커프 고정력 시험 항목 추가",
    impactAssessment: "생산 중인 제품 없음(시제품 단계), 위험관리 문서에 고정력 부족 위험 추가 필요, 제품실현 프로세스 영향 없음",
    attachmentIds: [],
  });
  console.log(`설계변경요청서 생성: ${changeRef.id}`);

  // F702-8 설계이관보고서
  const transferSeq = await nextSeq(projectId, "TRANSFER");
  const transferRef = db.collection(COLLECTION.TRANSFER).doc();
  await transferRef.set({
    header: makeHeader("TRANSFER", projectId, projectCode, transferSeq, "DRAFT"),
    transferMethod: "FINALIZE_PRE_TRANSFER",
    transferredItems: [
      { item: "제품표준서", included: true },
      { item: "제조공정도/작업표준서", included: true },
      { item: "수입/공정/제품/출하검사기준서", included: true },
      { item: "공정밸리데이션 (IQ/OQ/PQ)", included: false },
      { item: "설계 도면, BOM", included: true },
      { item: "라벨, 사용설명서, Box 등", included: true },
      { item: "제조장치와 보조물", included: false },
    ],
    receivingDept: "생산팀",
    transferDate: "2026-10-15",
    trainingCompleted: false,
    postMarketInfoRef: "",
    attachmentIds: [],
  });
  console.log(`설계이관보고서 생성: ${transferRef.id}`);

  console.log(`\n완료. http://localhost:8001/projects/${projectId}`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
