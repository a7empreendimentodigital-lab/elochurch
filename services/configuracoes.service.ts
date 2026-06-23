import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import type { ConfigBranding } from "@/lib/types/branding";
import { DEFAULT_BRANDING } from "@/lib/types/branding";
import {
  DEFAULT_CONFIG_SISTEMA,
  type ConfigSistemaDados,
  type ConfiguracoesIgrejaInitial,
} from "@/lib/types/configuracoes";
import type {
  ConfiguracoesAssinaturaInput,
  ConfiguracoesCarteirinhaInput,
  ConfiguracoesCoresInput,
  ConfiguracoesEbdInput,
  ConfiguracoesFinanceiroInput,
  ConfiguracoesIgrejaInput,
} from "@/lib/validations/configuracoes.schema";
import { getIgrejaById, listSedes } from "@/services/igrejas.service";

const CONFIG_ID = "default";

type ConfigSistemaPatch = {
  cores?: Partial<ConfigSistemaDados["cores"]>;
  assinatura?: Partial<ConfigSistemaDados["assinatura"]>;
  carteirinha?: Partial<ConfigSistemaDados["carteirinha"]>;
  ebd?: Partial<ConfigSistemaDados["ebd"]>;
  financeiro?: Partial<ConfigSistemaDados["financeiro"]>;
  documentos?: Partial<ConfigSistemaDados["documentos"]>;
  logoUrl?: string | null;
  branding?: Partial<ConfigBranding>;
};

async function readConfigSistemaFromDb(): Promise<ConfigSistemaDados> {
  const row = await prisma.configSistema.findUnique({
    where: { id: CONFIG_ID },
  });
  if (!row?.dados) {
    return { ...DEFAULT_CONFIG_SISTEMA };
  }
  try {
    const parsed = JSON.parse(row.dados) as Partial<ConfigSistemaDados>;
    return mergeConfig(DEFAULT_CONFIG_SISTEMA, parsed);
  } catch {
    return { ...DEFAULT_CONFIG_SISTEMA };
  }
}

function mergeConfig(
  current: ConfigSistemaDados,
  patch: ConfigSistemaPatch
): ConfigSistemaDados {
  return {
    cores: { ...current.cores, ...patch.cores },
    assinatura: { ...current.assinatura, ...patch.assinatura },
    carteirinha: { ...current.carteirinha, ...patch.carteirinha },
    ebd: { ...current.ebd, ...patch.ebd },
    financeiro: { ...current.financeiro, ...patch.financeiro },
    documentos: { ...current.documentos, ...patch.documentos },
    logoUrl: patch.logoUrl !== undefined ? patch.logoUrl : current.logoUrl,
    branding: {
      ...DEFAULT_BRANDING,
      ...current.branding,
      ...patch.branding,
    },
  };
}

export const getConfigSistema = cache(async (): Promise<ConfigSistemaDados> => {
  return readConfigSistemaFromDb();
});

async function persistConfig(patch: ConfigSistemaPatch): Promise<void> {
  const current = await readConfigSistemaFromDb();
  const merged = mergeConfig(current, patch);
  const dados = JSON.stringify(merged);
  await prisma.configSistema.upsert({
    where: { id: CONFIG_ID },
    create: { id: CONFIG_ID, dados },
    update: { dados },
  });
}

export async function resolveIgrejaParaConfiguracoes(): Promise<ConfiguracoesIgrejaInitial | null> {
  const ativaId = await resolveIgrejaAtivaId();
  if (ativaId) {
    const igreja = await getIgrejaById(ativaId);
    if (igreja) {
      return {
        id: igreja.id,
        nome: igreja.nome,
        responsavel: igreja.responsavel,
        telefone: igreja.telefone,
        cidade: igreja.cidade,
        estado: igreja.estado,
      };
    }
  }

  const sedes = await listSedes();
  const primeira = sedes[0];
  if (!primeira) return null;

  const igreja = await getIgrejaById(primeira.id);
  if (!igreja) return null;

  return {
    id: igreja.id,
    nome: igreja.nome,
    responsavel: igreja.responsavel,
    telefone: igreja.telefone,
    cidade: igreja.cidade,
    estado: igreja.estado,
  };
}

export async function updateConfiguracoesIgreja(
  input: ConfiguracoesIgrejaInput
): Promise<void> {
  const existing = await prisma.igreja.findUnique({
    where: { id: input.igrejaId },
  });
  if (!existing) {
    throw new Error("Igreja não encontrada");
  }

  await prisma.igreja.update({
    where: { id: input.igrejaId },
    data: {
      nome: input.nome.trim(),
      responsavel: input.responsavel.trim(),
      telefone: input.telefone.trim(),
      cidade: input.cidade.trim(),
      estado: input.estado.toUpperCase(),
    },
  });
}

export async function saveConfiguracoesCores(
  input: ConfiguracoesCoresInput
): Promise<void> {
  await persistConfig({ cores: input });
}

export async function saveConfiguracoesAssinatura(
  input: ConfiguracoesAssinaturaInput
): Promise<void> {
  await persistConfig({ assinatura: input });
}

export async function saveConfiguracoesCarteirinha(
  input: ConfiguracoesCarteirinhaInput
): Promise<void> {
  await persistConfig({ carteirinha: input });
}

export async function saveConfiguracoesEbd(
  input: ConfiguracoesEbdInput
): Promise<void> {
  await persistConfig({ ebd: input });
}

export async function saveConfiguracoesFinanceiro(
  input: ConfiguracoesFinanceiroInput
): Promise<void> {
  await persistConfig({
    financeiro: {
      moeda: "BRL",
      anoFiscal: input.anoFiscal ?? "",
    },
  });
}

export async function saveConfiguracoesLogoUrl(logoUrl: string): Promise<void> {
  await persistConfig({ logoUrl });
}

export async function saveConfiguracoesBrandingLinks(input: {
  suporteUrl: string;
  ajudaUrl: string;
}): Promise<void> {
  await persistConfig({
    branding: {
      suporteUrl: input.suporteUrl.trim(),
      ajudaUrl: input.ajudaUrl.trim(),
    },
  });
}

export async function saveConfiguracoesBrandingAsset(
  field: keyof ConfigBranding,
  url: string
): Promise<void> {
  await persistConfig({
    branding: { [field]: url },
  });
}
