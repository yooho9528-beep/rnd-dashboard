import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Standard } from "@/lib/types";

const COLLECTION = "standards";

export async function listStandards(): Promise<Standard[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("name", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Standard, "id">) }));
}

export async function createStandard(input: Omit<Standard, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), input);
  return ref.id;
}

export async function deleteStandard(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
