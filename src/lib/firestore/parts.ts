import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Part } from "@/lib/types";

const COLLECTION = "parts";

export async function listParts(): Promise<Part[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("partNo", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Part, "id">) }));
}

export async function createPart(input: Omit<Part, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), input);
  return ref.id;
}

export async function deletePart(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
