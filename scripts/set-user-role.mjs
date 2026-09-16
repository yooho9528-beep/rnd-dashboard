// 사용자 역할(Custom Claims) 부여 스크립트.
// 사용법: node scripts/set-user-role.mjs user@example.com DEV_LEAD,QUALITY_HEAD
// .env.local 에 FIREBASE_ADMIN_* 값이 설정되어 있어야 합니다.
import "dotenv/config";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [email, rolesArg] = process.argv.slice(2);
if (!email || !rolesArg) {
  console.error("사용법: node scripts/set-user-role.mjs <email> <ROLE1,ROLE2,...>");
  process.exit(1);
}

const roles = rolesArg.split(",").map((r) => r.trim());

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(app);
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { roles });

console.log(`완료: ${email} -> roles=${JSON.stringify(roles)}`);
console.log("적용을 위해 사용자는 재로그인(또는 토큰 갱신)해야 합니다.");
process.exit(0);
