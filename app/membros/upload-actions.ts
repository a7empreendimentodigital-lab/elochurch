"use server";

import { saveMembroFotoFile } from "@/lib/membros-upload";

export async function uploadMembroFotoAction(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Selecione uma imagem." };
    }
    const url = await saveMembroFotoFile(file);
    return { success: true, url };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Falha no upload",
    };
  }
}
