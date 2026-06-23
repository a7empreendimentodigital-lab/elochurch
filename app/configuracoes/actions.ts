"use server";

import { revalidatePath } from "next/cache";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";
import {
  brandingConfigKeyForAsset,
  saveBrandingAssetFile,
} from "@/lib/config-branding-upload";
import { BRANDING_ASSET_KEYS } from "@/lib/branding-assets";
import { saveLogoFile } from "@/lib/config-logo-upload";
import type { BrandingAssetKey } from "@/lib/types/branding";
import {
  configuracoesAssinaturaSchema,
  configuracoesBrandingLinksSchema,
  configuracoesCarteirinhaSchema,
  configuracoesCoresSchema,
  configuracoesEbdSchema,
  configuracoesFinanceiroSchema,
  configuracoesIgrejaSchema,
} from "@/lib/validations/configuracoes.schema";
import {
  saveConfiguracoesAssinatura,
  saveConfiguracoesBrandingAsset,
  saveConfiguracoesBrandingLinks,
  saveConfiguracoesCarteirinha,
  saveConfiguracoesCores,
  saveConfiguracoesEbd,
  saveConfiguracoesFinanceiro,
  saveConfiguracoesLogoUrl,
  updateConfiguracoesIgreja,
} from "@/services/configuracoes.service";

function revalidateConfiguracoes() {
  revalidatePath("/configuracoes");
  revalidatePath("/documentos", "layout");
  revalidatePath("/");
  revalidatePath("/login");
  revalidatePath("/portal/login");
  revalidatePath("/dashboard");
}

export async function saveConfiguracoesIgrejaAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = configuracoesIgrejaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos. Verifique o formulário.",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await updateConfiguracoesIgreja(parsed.data);
    revalidateConfiguracoes();
    revalidatePath("/igrejas");
    revalidatePath(`/igrejas/${parsed.data.igrejaId}`);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar",
    };
  }
}

export async function saveConfiguracoesCoresAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = configuracoesCoresSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Cores inválidas",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await saveConfiguracoesCores(parsed.data);
    revalidateConfiguracoes();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar cores",
    };
  }
}

export async function saveConfiguracoesAssinaturaAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = configuracoesAssinaturaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await saveConfiguracoesAssinatura(parsed.data);
    revalidateConfiguracoes();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar",
    };
  }
}

export async function saveConfiguracoesCarteirinhaAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = configuracoesCarteirinhaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await saveConfiguracoesCarteirinha(parsed.data);
    revalidateConfiguracoes();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar",
    };
  }
}

export async function saveConfiguracoesEbdAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = configuracoesEbdSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await saveConfiguracoesEbd(parsed.data);
    revalidateConfiguracoes();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar",
    };
  }
}

export async function saveConfiguracoesFinanceiroAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = configuracoesFinanceiroSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data inválida",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await saveConfiguracoesFinanceiro(parsed.data);
    revalidateConfiguracoes();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar",
    };
  }
}

export async function saveConfiguracoesBrandingLinksAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = configuracoesBrandingLinksSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Links inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await saveConfiguracoesBrandingLinks(parsed.data);
    revalidateConfiguracoes();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar links",
    };
  }
}

export async function saveConfiguracoesBrandingAssetAction(
  formData: FormData
): Promise<ActionResult<{ assetKey: BrandingAssetKey; url: string }>> {
  const assetKey = formData.get("assetKey");
  const file = formData.get("file");
  if (
    typeof assetKey !== "string" ||
    !BRANDING_ASSET_KEYS.includes(assetKey as BrandingAssetKey)
  ) {
    return { success: false, error: "Tipo de arquivo inválido" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Selecione um arquivo de imagem" };
  }
  try {
    const url = await saveBrandingAssetFile(file, assetKey as BrandingAssetKey);
    const configKey = brandingConfigKeyForAsset(assetKey as BrandingAssetKey);
    await saveConfiguracoesBrandingAsset(configKey, url);
    revalidateConfiguracoes();
    return {
      success: true,
      data: { assetKey: assetKey as BrandingAssetKey, url },
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao enviar arquivo",
    };
  }
}

export async function saveConfiguracoesLogoAction(
  formData: FormData
): Promise<ActionResult<{ logoUrl: string }>> {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Selecione um arquivo de imagem" };
  }
  try {
    const logoUrl = await saveLogoFile(file);
    await saveConfiguracoesLogoUrl(logoUrl);
    revalidateConfiguracoes();
    return { success: true, data: { logoUrl } };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao enviar logo",
    };
  }
}
