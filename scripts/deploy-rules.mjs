// 서비스 계정 자격 증명으로 Firebase Rules API를 직접 호출해
// firestore.rules / storage.rules 를 배포한다 (firebase CLI 로그인 불필요).
import { config } from "dotenv";
import { readFileSync } from "node:fs";

config({ path: new URL("../.env.local", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1") });
import { GoogleAuth } from "google-auth-library";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

const auth = new GoogleAuth({
  credentials: { client_email: clientEmail, private_key: privateKey },
  scopes: ["https://www.googleapis.com/auth/firebase", "https://www.googleapis.com/auth/cloud-platform"],
});

const client = await auth.getClient();

async function api(path, options = {}) {
  const url = `https://firebaserules.googleapis.com/v1/${path}`;
  const res = await client.request({ url, ...options });
  return res.data;
}

async function createRuleset(fileName, content) {
  const ruleset = await api(`projects/${projectId}/rulesets`, {
    method: "POST",
    data: {
      source: {
        files: [{ name: fileName, content }],
      },
    },
  });
  console.log(`Ruleset 생성됨: ${ruleset.name}`);
  return ruleset.name; // projects/{project}/rulesets/{id}
}

async function release(releaseName, rulesetName) {
  const name = `projects/${projectId}/releases/${releaseName}`;
  try {
    await api(`projects/${projectId}/releases/${releaseName}`, {
      method: "PATCH",
      data: { release: { name, rulesetName } },
    });
    console.log(`릴리스 갱신됨: ${releaseName} -> ${rulesetName}`);
  } catch {
    await api(`projects/${projectId}/releases`, {
      method: "POST",
      data: { name, rulesetName },
    });
    console.log(`릴리스 생성됨: ${releaseName} -> ${rulesetName}`);
  }
}

const firestoreRules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");

const firestoreRulesetName = await createRuleset("firestore.rules", firestoreRules);
await release("cloud.firestore", firestoreRulesetName);

console.log("완료: Firestore 보안 규칙 배포됨");
console.log(
  "Storage 규칙은 서비스 계정 권한으로 API 배포가 불가하여, storage.rules 파일 내용을 Firebase 콘솔 > Storage > Rules 탭에 직접 붙여넣어야 합니다."
);
