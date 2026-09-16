// 최초 테스트 계정 생성 + 전체 역할 부여 (로컬 1회성 스크립트)
import { config } from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

config({ path: new URL("../.env.local", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1") });

const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) {
  console.error("사용법: node scripts/create-test-user.mjs <email> <password>");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(app);

let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password });
  console.log(`기존 사용자 비밀번호 갱신: ${email}`);
} catch {
  user = await auth.createUser({ email, password, emailVerified: true });
  console.log(`신규 사용자 생성: ${email}`);
}

const roles = ["CEO", "DEV_LEAD", "QUALITY_HEAD", "SALES", "DEV_TEAM", "PRODUCTION", "QC_TEAM"];
await auth.setCustomUserClaims(user.uid, { roles });
console.log(`역할 부여 완료 (테스트 목적 전체 권한): ${roles.join(", ")}`);
console.log(`uid: ${user.uid}`);
process.exit(0);
