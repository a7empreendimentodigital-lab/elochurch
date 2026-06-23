"use server";

import { savePatrimonioFotoFile } from "@/lib/patrimonio-upload";

export async function uploadPatrimonioFotoAction(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Selecione uma imagem." };
    }
    const url = await savePatrimonioFotoFile(file);
    return { success: true, url };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Falha no upload",
    };
  }
}
