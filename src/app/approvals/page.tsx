"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { canPerformAction } from "@/lib/documents/workflow";
import { collectionNameFor } from "@/lib/documents/doc-no";
import type { DocumentHeader, DocumentTypeCode } from "@/lib/types";

const DOC_TYPES: { type: DocumentTypeCode; label: string; path: string }[] = [
  { type: "PLAN", label: "개발계획서", path: "plan" },
  { type: "INPUT", label: "개발입력서", path: "input" },
  { type: "OUTPUT", label: "개발출력서", path: "output" },
  { type: "REVIEW", label: "설계검토회의록", path: "review" },
  { type: "VV_PLAN", label: "검증/유효성 확인계획서", path: "vv-plan" },
  { type: "VV_REPORT", label: "검증/유효성 확인보고서", path: "vv-report" },
  { type: "CHANGE_REQUEST", label: "설계변경요청서", path: "change-request" },
  { type: "TRANSFER", label: "설계 및 개발 이관보고서", path: "transfer" },
];

interface Row {
  id: string;
  type: DocumentTypeCode;
  label: string;
  path: string;
  header: DocumentHeader;
  action: "REVIEW" | "APPROVE";
}

export default function ApprovalsInboxPage() {
  const { roles, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      setLoading(true);
      const results: Row[] = [];
      for (const { type, label, path } of DOC_TYPES) {
        const snap = await getDocs(
          query(
            collection(db, collectionNameFor(type)),
            where("header.status", "in", ["SUBMITTED", "IN_REVIEW"])
          )
        );
        snap.docs.forEach((d) => {
          const header = (d.data() as { header: DocumentHeader }).header;
          const action = header.status === "SUBMITTED" ? "REVIEW" : "APPROVE";
          if (canPerformAction(type, action, roles)) {
            results.push({ id: d.id, type, label, path, header, action });
          }
        });
      }
      setRows(results);
      setLoading(false);
    })();
  }, [roles, authLoading]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">결재함</h1>
        <p className="text-sm text-slate-500">내 역할로 검토/승인 대기 중인 문서 목록입니다.</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">불러오는 중...</p>
      ) : (
        <ul className="divide-y rounded-lg border bg-white">
          {rows.map((row) => (
            <li key={`${row.type}_${row.id}`} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <Link
                  href={`/projects/${row.header.projectId}/${row.path}/${row.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  [{row.label}] {row.header.docNo}
                </Link>
                <div className="text-xs text-slate-500">Rev.{row.header.revNo} · {row.header.status}</div>
              </div>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                {row.action === "REVIEW" ? "검토 대기" : "승인 대기"}
              </span>
            </li>
          ))}
          {!rows.length && <li className="px-4 py-3 text-sm text-slate-400">대기 중인 결재 건이 없습니다.</li>}
        </ul>
      )}
    </div>
  );
}
