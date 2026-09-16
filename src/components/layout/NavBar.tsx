"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROLE_LABELS } from "@/lib/roles";

export function NavBar() {
  const { user, roles, loading } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/projects" className="font-semibold text-slate-900">
          설계관리 PMS
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/projects">프로젝트</Link>
          <Link href="/approvals">결재함</Link>
          <Link href="/masters/standards">규격 마스터</Link>
          <Link href="/masters/parts">부품 마스터</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {loading ? null : user ? (
            <>
              <span className="text-slate-500">
                {user.email} ({roles.map((r) => ROLE_LABELS[r]).join(", ") || "역할 없음"})
              </span>
              <button
                onClick={() => signOut(auth)}
                className="rounded border px-2 py-1 text-slate-700 hover:bg-slate-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded border px-2 py-1">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
