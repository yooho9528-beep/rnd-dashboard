/**
 * OP-702 설계관리절차서 4장(책임 및 권한) 기준 역할 모델.
 * 한 사용자가 여러 역할을 겸임할 수 있어 Firebase Custom Claims에 roles: RoleCode[] 로 저장한다.
 */
export const ROLE_CODES = [
  "CEO",
  "DEV_LEAD",
  "QUALITY_HEAD",
  "SALES",
  "DEV_TEAM",
  "PRODUCTION",
  "QC_TEAM",
] as const;

export type RoleCode = (typeof ROLE_CODES)[number];

export const ROLE_LABELS: Record<RoleCode, string> = {
  CEO: "대표이사",
  DEV_LEAD: "개발팀장",
  QUALITY_HEAD: "품질책임자",
  SALES: "영업부",
  DEV_TEAM: "개발팀",
  PRODUCTION: "생산팀",
  QC_TEAM: "품질관리팀",
};

export function hasRole(userRoles: RoleCode[] | undefined, required: RoleCode[]): boolean {
  if (!userRoles?.length) return false;
  return required.some((role) => userRoles.includes(role));
}
