"use client";

/**
 * Hook para leitura do contexto de igreja ativa no cliente.
 * O valor oficial vem do cookie `elochurch_igreja_id` (servidor).
 * Integração completa com seletor de igreja será feita nos próximos módulos.
 */
export function useIgrejaAtiva() {
  return {
    igrejaId: null as string | null,
    isLoading: false,
  };
}
