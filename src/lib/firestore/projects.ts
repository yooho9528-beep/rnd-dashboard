import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Project, ProjectCategory } from "@/lib/types";

const COLLECTION = "projects";

export async function listProjects(): Promise<Project[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }));
}

export async function getProject(projectId: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, COLLECTION, projectId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Project, "id">) };
}

export async function createProject(input: {
  code: string;
  name: string;
  category: ProjectCategory;
  ownerUid: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    code: input.code,
    name: input.name,
    category: input.category,
    status: "PLANNING",
    ownerUid: input.ownerUid,
    createdAt: new Date().toISOString(),
    _serverCreatedAt: serverTimestamp(),
  });
  return ref.id;
}
