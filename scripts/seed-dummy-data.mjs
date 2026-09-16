// 데모/테스트용 더미 데이터 시딩 스크립트.
// 프로젝트 1건 + 공통 마스터(규격/부품) + 문서 3종(개발계획서/입력서/출력서) 각 1건을 생성한다.
// 사용법: node scripts/seed-dummy-data.mjs
import { config } from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

const FORM_CODE = { PLAN: "F702-1", INPUT: "F702-2", OUTPUT: "F702-3" };
const COLLECTION = { PLAN: "documents_plan", INPUT: "documents_input", OUTPUT: "documents_output" };

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
  // 1. 프로젝트
  const projectRef = db.collection("projects").doc();
  await projectRef.set({
    code: "BP-2026-001",
    name: "디지털 혈압계 BP-100",
    category: "NEW",
    status: "IN_DEVELOPMENT",
    ownerUid: AUTHOR_UID,
    createdAt: new Date().toISOString(),
    _serverCreatedAt: FieldValue.serverTimestamp(),
  });
  const projectId = projectRef.id;
  const projectCode = "BP-2026-001";
  console.log(`프로젝트 생성: ${projectId} (${projectCode})`);

  // 2. 공통 마스터 - 규격
  const standard1 = db.collection("standards").doc();
  await standard1.set({
    name: "IEC 60601-1",
    version: "3.1",
    category: "전기안전",
    description: "의료용 전기기기 기본 안전 및 필수 성능에 관한 일반 요구사항",
  });
  const standard2 = db.collection("standards").doc();
  await standard2.set({
    name: "ISO 81060-2",
    version: "2018",
    category: "성능시험",
    description: "비침습 혈압계 임상시험 요구사항",
  });
  console.log("규격 마스터 2건 생성");

  // 3. 공통 마스터 - 부품
  const part1 = db.collection("parts").doc();
  await part1.set({
    partNo: "PT-CUFF-001",
    name: "커프 (Cuff)",
    spec: "성인용 22~32cm",
    supplier: "㈜메디컴포넌츠",
    unit: "EA",
  });
  const part2 = db.collection("parts").doc();
  await part2.set({
    partNo: "PT-PUMP-002",
    name: "에어펌프",
    spec: "DC 6V, 최대 300mmHg",
    supplier: "대한펌프산업",
    unit: "EA",
  });
  console.log("부품 마스터 2건 생성");

  // 4. F702-1 개발계획서
  const planSeq = await nextSeq(projectId, "PLAN");
  const planRef = db.collection(COLLECTION.PLAN).doc();
  await planRef.set({
    header: makeHeader("PLAN", projectId, projectCode, planSeq, "SUBMITTED"),
    purposeScope: "가정용 디지털 혈압계 신규 개발. 상완식 자동 혈압 측정 방식으로 IEC 60601-1 및 ISO 81060-2 기준을 만족하는 것을 목표로 한다.",
    schedule: [
      { phase: "기획/타당성 검토", startDate: "2026-01-05", endDate: "2026-01-30" },
      { phase: "설계입력/출력", startDate: "2026-02-02", endDate: "2026-03-31" },
      { phase: "시제품 제작 및 검증", startDate: "2026-04-01", endDate: "2026-06-30" },
      { phase: "임상시험/유효성확인", startDate: "2026-07-01", endDate: "2026-09-30" },
      { phase: "양산 이관", startDate: "2026-10-01", endDate: "2026-10-31" },
    ],
    orgChart: "개발팀장(총괄) - 개발팀(회로/기구 설계) - 품질관리팀(검증/시험) - 생산팀(시제품/양산) - 영업부(고객 요구사항 창구)",
    resources: "개발 인력 4명(회로 2, 기구 1, SW 1), 시제품 제작비 3,000만원, 외부 임상시험 위탁 예산 5,000만원, 개발 기간 10개월",
    applicableStandardIds: [standard1.id, standard2.id],
    deliverables: [
      { phase: "기획/타당성 검토", deliverable: "개발계획서, 시장분석 보고서" },
      { phase: "설계입력/출력", deliverable: "설계입력서, 설계출력서, 회로도/기구도면" },
      { phase: "시제품 제작 및 검증", deliverable: "시제품, 검증계획서/보고서" },
      { phase: "임상시험/유효성확인", deliverable: "임상시험 결과보고서, 유효성확인보고서" },
    ],
    qualityPlanRef: "QP-2026-BP100",
    attachmentIds: [],
  });
  console.log(`개발계획서 생성: ${planRef.id}`);

  // 5. F702-2 개발입력서
  const inputSeq = await nextSeq(projectId, "INPUT");
  const inputRef = db.collection(COLLECTION.INPUT).doc();
  await inputRef.set({
    header: makeHeader("INPUT", projectId, projectCode, inputSeq, "DRAFT"),
    customerRequirements: "가정에서 손쉽게 사용 가능한 상완식 자동 혈압계. 측정값 ±3mmHg 이내 정확도, 블루투스로 스마트폰 앱 연동, 1회 충전 30회 이상 측정 가능.",
    intendedUse: "만 18세 이상 성인의 가정 내 비침습 혈압(수축기/이완기) 및 맥박 측정",
    functionPerformanceUsability: "자동 커프 가압/감압, 측정값 LCD 표시 및 앱 전송, 부정맥 검출 알림, 1인 사용자 조작만으로 측정 완료(사용적합성 IEC 62366-1 고려)",
    safetyRequirements: "과압 방지(최대 300mmHg 초과 시 자동 배기), 전기적 절연 등급 Type BF, 배터리 과충전/과방전 보호 회로 적용",
    applicableStandardIds: [standard1.id, standard2.id],
    regulatoryRequirements: "국내 의료기기법 2등급 인증, IEC 60601-1-2(EMC) 적합성 시험",
    priorDesignReference: "기존 손목형 혈압계 BP-050 설계 자료 중 배터리 관리 회로 재사용 검토",
    riskMgmtPlanRef: "OP-711 위험관리계획서 RM-2026-BP100",
    checklistItems: [
      { item: "측정 정확도 ±3mmHg 요구사항 반영", satisfied: true, evidence: "설계입력서 6.1항" },
      { item: "블루투스 연동 요구사항 반영", satisfied: true, evidence: "기능 명세서 3.2항" },
      { item: "과압 방지 안전장치 반영", satisfied: false, evidence: "회로설계 검토 중" },
    ],
    attachmentIds: [],
  });
  console.log(`개발입력서 생성: ${inputRef.id}`);

  // 6. F702-3 개발출력서
  const outputSeq = await nextSeq(projectId, "OUTPUT");
  const outputRef = db.collection(COLLECTION.OUTPUT).doc();
  await outputRef.set({
    header: makeHeader("OUTPUT", projectId, projectCode, outputSeq, "DRAFT"),
    partIds: [part1.id, part2.id],
    drawingAttachmentIds: [],
    processFlow: "커프 조립 -> 펌프/밸브 유닛 결합 -> 메인보드 실장 -> 하우징 조립 -> 기능검사 -> 포장",
    productSpecRef: "PS-2026-BP100 Rev.0",
    verificationPlanRef: "VP-2026-BP100",
    acceptanceCriteria: [
      { criterion: "혈압 측정 정확도 ±3mmHg 이내", method: "ISO 81060-2 임상 비교시험" },
      { criterion: "최대 가압 300mmHg 초과 시 3초 이내 자동 배기", method: "과압 안전시험(반복 10회)" },
      { criterion: "배터리 1회 충전 30회 이상 측정", method: "충방전 사이클 시험" },
    ],
    userManualAttachmentIds: [],
    attachmentIds: [],
  });
  console.log(`개발출력서 생성: ${outputRef.id}`);

  console.log("\n완료. 앱에서 확인:");
  console.log(`http://localhost:8001/projects/${projectId}`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
