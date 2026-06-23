"use client";

import { useEffect, useRef } from "react";
import { setIgrejaAtivaAction } from "@/app/actions/igreja-ativa";

interface IgrejaAtivaCookieSyncProps {
  /** Igreja resolvida para esta sessão */
  igrejaId: string | null;
  /** Cookie já contém a mesma igreja */
  persisted: boolean;
}

/** Persiste igreja ativa via Server Action (permitido pelo Next.js). */
export function IgrejaAtivaCookieSync({
  igrejaId,
  persisted,
}: IgrejaAtivaCookieSyncProps) {
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current || persisted || !igrejaId) return;
    synced.current = true;
    void setIgrejaAtivaAction(igrejaId);
  }, [igrejaId, persisted]);

  return null;
}
