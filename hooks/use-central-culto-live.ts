"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CentralCultoState } from "@/types/central-culto";

const POLL_MS = 2000;

export function useCentralCultoLive(
  cultoId: string,
  initialState: CentralCultoState,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;
  const [state, setState] = useState<CentralCultoState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const versaoRef = useRef(initialState.versao);

  const fetchState = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await fetch(`/api/central-culto/${cultoId}/state`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Falha ao atualizar");
      }
      const data = (await res.json()) as CentralCultoState;
      if (data.versao !== versaoRef.current) {
        versaoRef.current = data.versao;
        setState(data);
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro de conexão");
    } finally {
      setLoading(false);
    }
  }, [cultoId, enabled]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchState();
  }, [fetchState]);

  useEffect(() => {
    setState(initialState);
    versaoRef.current = initialState.versao;
  }, [initialState]);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      void fetchState();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [enabled, fetchState]);

  return { state, loading, error, refresh, setState };
}
