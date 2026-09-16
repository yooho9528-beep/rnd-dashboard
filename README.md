# 설계관리 PMS

`OP-702 설계관리절차서`(ISO 13485 기반) 를 웹으로 옮긴 설계관리 시스템입니다. F702-1~8 기록양식 8종(개발계획서/입력서/출력서/설계검토회의록/검증·유효성 확인계획서·보고서/설계변경요청서/설계이관보고서)을 웹 폼으로 입력·결재하고, 여러 문서에서 공통으로 쓰는 항목(프로젝트/규격/부품)은 마스터로 분리해 참조합니다.

설계 문서 전체 내용은 `C:\Users\KOSA\.claude\plans\cosmic-spinning-glacier.md` 참고.

## 스택

- Next.js 16 (App Router, TypeScript, Tailwind CSS 4)
- Firebase Authentication / Firestore / Storage
- React Hook Form + Zod
- Vercel 배포, GitHub 저장소

## 로컬 개발

```bash
npm install
cp .env.local.example .env.local   # Firebase 프로젝트 값 채우기
npm run dev                        # http://localhost:8001
```

### Firebase 프로젝트 준비

1. Firebase 콘솔에서 프로젝트 생성 → Authentication(이메일/비밀번호) 활성화 → Firestore, Storage 활성화
2. 웹 앱 등록 후 발급되는 설정값을 `.env.local`의 `NEXT_PUBLIC_FIREBASE_*` 에 채운다
3. 프로젝트 설정 > 서비스 계정에서 새 비공개 키 생성 → `.env.local`의 `FIREBASE_ADMIN_*` 에 채운다 (`FIREBASE_ADMIN_PRIVATE_KEY`는 개행을 `\n` 문자열로 이스케이프)
4. Firestore 규칙 배포: `node scripts/deploy-rules.mjs` (서비스 계정 자격증명만으로 배포, `firebase login` 불필요). Storage 규칙은 서비스 계정 권한으로 API 배포가 막혀있어 `storage.rules` 내용을 Firebase 콘솔 > Storage > Rules 탭에 직접 붙여넣어야 한다. Firebase CLI가 있다면 `firebase deploy --only firestore:rules,firestore:indexes,storage`로 한 번에 배포 가능.

### 사용자 역할(Custom Claims) 부여

Firebase Auth에 이메일/비밀번호로 계정을 만든 후, 아래 스크립트로 역할을 부여합니다 (문서 4장 책임/권한 기준: `CEO`, `DEV_LEAD`, `QUALITY_HEAD`, `SALES`, `DEV_TEAM`, `PRODUCTION`, `QC_TEAM`).

```bash
node scripts/set-user-role.mjs someone@example.com DEV_LEAD,DEV_TEAM
```

역할 부여 후 해당 사용자는 재로그인해야 반영됩니다.

## 배포 (GitHub + Vercel)

1. 이 저장소를 GitHub에 push
2. Vercel에서 저장소 Import → 프로젝트 생성 시 `.env.local`과 동일한 환경변수를 Vercel 프로젝트 설정(Environment Variables)에 등록
3. main 브랜치 push 시 Vercel이 자동 빌드/배포 (Preview는 PR마다 자동 생성)

## 폴더 구조

```
src/
  app/                     # 라우트 (App Router)
    login/
    projects/[projectId]/{plan,input,output,review,vv-plan,vv-report,change-request,transfer}/[docId]/
    masters/{standards,parts}/
    approvals/
  components/
    document/              # HeaderPanel, ApprovalTimeline, ApprovalActions, AttachmentUploader, DocumentViewTabs
    document/content/       # 문서 타입별 읽기전용 콘텐츠(상세보기/문서형식보기 공용)
    document/print/         # CoverPage, PrintLayout — 문서형식보기(A4 인쇄) 레이아웃
    forms/                  # 문서 타입별 입력 폼 + 공통 마스터 선택 컴포넌트
    providers/AuthProvider.tsx
  lib/
    firebase/{client,admin}.ts
    firestore/              # Firestore 데이터 접근 계층
    schemas/                # Zod 폼 스키마 (문서 타입별)
    documents/               # 상태머신(workflow), 문서번호 채번(doc-no)
    roles.ts, types.ts
firestore.rules / firestore.indexes.json / storage.rules
scripts/
  set-user-role.mjs          # Custom Claims 부여 스크립트
  deploy-rules.mjs           # 서비스 계정으로 Firestore 규칙 배포 (CLI 로그인 불필요)
  create-test-user.mjs       # 테스트 계정 생성 + 전체 역할 부여
  seed-dummy-data*.mjs       # 데모용 더미 데이터 시딩
```

## 문서 화면 3뷰

각 문서 상세 화면 우측 상단에 3개 탭이 있습니다.
- **수정**: React Hook Form 기반 입력 폼 (초안 상태에서만 편집 가능)
- **상세보기**: 읽기 전용 요약 화면 (규격/부품 ID는 이름으로 표시)
- **문서형식보기**: 표지 자동 생성 + A4 인쇄 레이아웃, "PDF로 출력" 버튼으로 브라우저 인쇄 다이얼로그를 통해 바로 PDF 저장 가능

## 데이터 모델 요약

- 공통 마스터: `users`(Firebase Auth + Custom Claims), `projects`, `standards`, `parts`
- 문서: 타입별 컬렉션(`documents_plan`, `documents_input`, `documents_output`, `documents_review`, `documents_vv_plan`, `documents_vv_report`, `documents_change_request`, `documents_transfer`), 모두 공통 `header`(문서번호/개정번호/상태/작성·검토·승인자) 구조 공유
- `attachments`, `approval_history`: 모든 문서 타입이 공통으로 참조하는 컬렉션
- 문서 타입별 작성/검토/승인 역할 매핑은 `src/lib/documents/workflow.ts`의 `AUTHOR_ROLES`/`REVIEWER_ROLES`/`APPROVER_ROLES` 참고 (OP-702 4·6·8·11·12절 근거)

## 다음 단계

- Design History File(설계이력파일) 통합 조회 화면 — 프로젝트별 8종 문서 이력을 한 화면에 집계
- 위험관리(OP-711) 절차와의 연계
- 사용자 이름 표시(현재 승인자/작성자는 uid로 표시) — Firestore `users` 컬렉션과 Firebase Auth 프로필 연동 필요
