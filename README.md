# 설계관리 PMS

`OP-702 설계관리절차서`(ISO 13485 기반) 를 웹으로 옮긴 설계관리 시스템입니다. 1단계 범위는 개발계획서(F702-1) · 개발입력서(F702-2) · 개발출력서(F702-3) 3종 문서와 공통 마스터(프로젝트/규격/부품), 첨부파일, 역할 기반 결재 워크플로입니다.

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
4. 규칙/인덱스 배포:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add            # 위 Firebase 프로젝트 선택
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

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
    projects/[projectId]/{plan,input,output}/[docId]/
    masters/{standards,parts}/
    approvals/
  components/
    document/              # HeaderPanel, ApprovalTimeline, ApprovalActions, AttachmentUploader
    forms/                  # PlanForm, InputForm, OutputForm + 공통 마스터 선택 컴포넌트
    providers/AuthProvider.tsx
  lib/
    firebase/{client,admin}.ts
    firestore/              # Firestore 데이터 접근 계층
    schemas/                # Zod 폼 스키마
    documents/               # 상태머신(workflow), 문서번호 채번(doc-no)
    roles.ts, types.ts
firestore.rules / firestore.indexes.json / storage.rules
scripts/set-user-role.mjs   # Custom Claims 부여 스크립트
```

## 데이터 모델 요약

- 공통 마스터: `users`(Firebase Auth + Custom Claims), `projects`, `standards`, `parts`
- 문서: 타입별 컬렉션(`documents_plan`, `documents_input`, `documents_output`), 모두 공통 `header`(문서번호/개정번호/상태/작성·검토·승인자) 구조 공유
- `attachments`, `approval_history`: 모든 문서 타입이 공통으로 참조하는 컬렉션

## 다음 단계 (2단계 이후)

- F702-4~8: 설계검토회의록, 검증/유효성 계획·보고서, 설계변경요청서, 설계이관보고서
- Design History File(설계이력파일) 통합 조회 화면
- 위험관리(OP-711) 절차와의 연계
