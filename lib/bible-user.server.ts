import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type BibleUserRef =
  | { kind: "admin"; adminId: string }
  | { kind: "membro"; membroId: string }
  | null;

export async function getBibleUserRef(): Promise<BibleUserRef> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  if (session.user.role === "admin" && session.user.adminId) {
    return { kind: "admin", adminId: session.user.adminId };
  }
  if (session.user.role === "membro" && session.user.membroId) {
    return { kind: "membro", membroId: session.user.membroId };
  }
  return null;
}

export function bibleUserWhere(ref: BibleUserRef) {
  if (!ref) return {};
  if (ref.kind === "admin") return { adminId: ref.adminId, membroId: null };
  return { adminId: null, membroId: ref.membroId };
}
