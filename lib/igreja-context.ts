import { cookies } from "next/headers";

export const IGREJA_ATIVA_COOKIE = "elochurch_igreja_id";

/** ID da igreja ativa no contexto multi-tenant (cookie). */
export async function getIgrejaAtivaId(): Promise<string | null> {
  const store = await cookies();
  return store.get(IGREJA_ATIVA_COOKIE)?.value ?? null;
}

export async function setIgrejaAtivaId(igrejaId: string): Promise<void> {
  const store = await cookies();
  store.set(IGREJA_ATIVA_COOKIE, igrejaId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
