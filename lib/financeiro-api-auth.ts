import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assertAdminCanAccessIgreja } from "@/lib/admin-igreja-scope.server";

export async function requireAdminApiSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" || !session.user.adminId) {
    return null;
  }
  return session;
}

/** Valida sessão admin e escopo da igreja (query/body). */
export async function requireAdminApiForIgreja(igrejaId: string) {
  const session = await requireAdminApiSession();
  if (!session) return null;
  try {
    await assertAdminCanAccessIgreja(igrejaId);
  } catch {
    return null;
  }
  return session;
}
