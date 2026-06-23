export type CepAddress = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento: string | null;
};

export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "").slice(0, 8);
}

export function formatCep(cep: string): string {
  const digits = normalizeCep(cep);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress | null> {
  const digits = normalizeCep(cep);
  if (digits.length !== 8) return null;

  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!res.ok) {
    throw new Error("Falha ao consultar CEP");
  }

  const data = (await res.json()) as {
    erro?: boolean;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    complemento?: string;
  };

  if (data.erro) return null;

  return {
    logradouro: data.logradouro?.trim() ?? "",
    bairro: data.bairro?.trim() ?? "",
    localidade: data.localidade?.trim() ?? "",
    uf: data.uf?.trim() ?? "",
    complemento: data.complemento?.trim() ? data.complemento.trim() : null,
  };
}
