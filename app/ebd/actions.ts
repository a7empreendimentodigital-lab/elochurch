"use server";

import { revalidatePath } from "next/cache";
import {
  ebdChamadaSchema,
  ebdClasseSchema,
  ebdProfessorSchema,
  ebdSuperintendenteSchema,
  type EbdChamadaInput,
  type EbdClasseInput,
  type EbdProfessorInput,
  type EbdSuperintendenteInput,
} from "@/lib/validations/ebd.schema";
import {
  createChamada,
  createClasse,
  createProfessor,
  createSuperintendente,
  updateClasse,
  addAluno,
  removeAluno,
} from "@/services/ebd.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";

export async function createProfessorAction(
  input: EbdProfessorInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = ebdProfessorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", fieldErrors: formatZodErrors(parsed.error) };
  }
  try {
    const p = await createProfessor(parsed.data);
    revalidatePath("/ebd");
    revalidatePath("/ebd/professores");
    return { success: true, data: { id: p.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createSuperintendenteAction(
  input: EbdSuperintendenteInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = ebdSuperintendenteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", fieldErrors: formatZodErrors(parsed.error) };
  }
  try {
    const s = await createSuperintendente(parsed.data);
    revalidatePath("/ebd");
    revalidatePath("/ebd/superintendentes");
    return { success: true, data: { id: s.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createClasseAction(
  input: EbdClasseInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = ebdClasseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", fieldErrors: formatZodErrors(parsed.error) };
  }
  try {
    const c = await createClasse(parsed.data);
    revalidatePath("/ebd");
    revalidatePath("/ebd/classes");
    return { success: true, data: { id: c.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateClasseAction(
  id: string,
  input: EbdClasseInput
): Promise<ActionResult> {
  const parsed = ebdClasseSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Dados inválidos" };
  try {
    await updateClasse(id, parsed.data);
    revalidatePath("/ebd/classes");
    revalidatePath(`/ebd/classes/${id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createChamadaAction(
  input: EbdChamadaInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = ebdChamadaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const chamadaId = await createChamada(parsed.data);
    revalidatePath("/ebd");
    revalidatePath("/ebd/chamadas");
    revalidatePath(`/ebd/classes/${parsed.data.classeId}`);
    return { success: true, data: { id: chamadaId } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function addAlunoAction(
  classeId: string,
  membroId: string
): Promise<ActionResult> {
  try {
    await addAluno(classeId, membroId);
    revalidatePath(`/ebd/classes/${classeId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function removeAlunoAction(
  alunoId: string,
  classeId: string
): Promise<ActionResult> {
  try {
    await removeAluno(alunoId);
    revalidatePath(`/ebd/classes/${classeId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
