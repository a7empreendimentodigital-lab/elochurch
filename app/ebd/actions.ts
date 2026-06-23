"use server";

import { revalidatePath } from "next/cache";
import { ebdIdSchema } from "@/lib/validations/ebd.schema";
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
  updateProfessor,
  updateSuperintendente,
  deleteProfessor,
  deleteSuperintendente,
  deleteClasse,
  deleteChamada,
  updateChamada,
  addAluno,
  removeAluno,
} from "@/services/ebd.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";
import { guardPanelDelete } from "@/lib/panel-delete-policy.server";

function revalidateEbd() {
  revalidatePath("/ebd");
}

function revalidateProfessores() {
  revalidateEbd();
  revalidatePath("/ebd/professores");
}

function revalidateSuperintendentes() {
  revalidateEbd();
  revalidatePath("/ebd/superintendentes");
}

function revalidateClasses() {
  revalidateEbd();
  revalidatePath("/ebd/classes");
}

function revalidateChamadas() {
  revalidateEbd();
  revalidatePath("/ebd/chamadas");
}

function revalidateAlunos() {
  revalidateEbd();
  revalidatePath("/ebd/alunos");
}

export async function createProfessorAction(
  input: EbdProfessorInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = ebdProfessorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", fieldErrors: formatZodErrors(parsed.error) };
  }
  try {
    const p = await createProfessor(parsed.data);
    revalidateProfessores();
    return { success: true, data: { id: p.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateProfessorAction(
  id: string,
  input: EbdProfessorInput
): Promise<ActionResult> {
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  const parsed = ebdProfessorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", fieldErrors: formatZodErrors(parsed.error) };
  }
  try {
    await updateProfessor(id, parsed.data);
    revalidateProfessores();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteProfessorAction(id: string): Promise<ActionResult> {
  const denied = await guardPanelDelete();
  if (denied) return denied;
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  try {
    await deleteProfessor(id);
    revalidateProfessores();
    revalidateClasses();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro ao excluir" };
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
    revalidateSuperintendentes();
    return { success: true, data: { id: s.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateSuperintendenteAction(
  id: string,
  input: EbdSuperintendenteInput
): Promise<ActionResult> {
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  const parsed = ebdSuperintendenteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", fieldErrors: formatZodErrors(parsed.error) };
  }
  try {
    await updateSuperintendente(id, parsed.data);
    revalidateSuperintendentes();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteSuperintendenteAction(id: string): Promise<ActionResult> {
  const denied = await guardPanelDelete();
  if (denied) return denied;
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  try {
    await deleteSuperintendente(id);
    revalidateSuperintendentes();
    revalidateClasses();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro ao excluir" };
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
    revalidateClasses();
    return { success: true, data: { id: c.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateClasseAction(
  id: string,
  input: EbdClasseInput
): Promise<ActionResult> {
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  const parsed = ebdClasseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", fieldErrors: formatZodErrors(parsed.error) };
  }
  try {
    await updateClasse(id, parsed.data);
    revalidateClasses();
    revalidatePath(`/ebd/classes/${id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteClasseAction(id: string): Promise<ActionResult> {
  const denied = await guardPanelDelete();
  if (denied) return denied;
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  try {
    await deleteClasse(id);
    revalidateClasses();
    revalidateChamadas();
    revalidateAlunos();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro ao excluir" };
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
    revalidateChamadas();
    revalidatePath(`/ebd/classes/${parsed.data.classeId}`);
    return { success: true, data: { id: chamadaId } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateChamadaAction(
  id: string,
  input: EbdChamadaInput
): Promise<ActionResult<{ id: string }>> {
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  const parsed = ebdChamadaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const newId = await updateChamada(id, parsed.data);
    revalidateChamadas();
    revalidatePath(`/ebd/relatorio/${newId}`);
    return { success: true, data: { id: newId } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteChamadaAction(id: string): Promise<ActionResult> {
  const denied = await guardPanelDelete();
  if (denied) return denied;
  if (!ebdIdSchema.safeParse(id).success) {
    return { success: false, error: "ID inválido" };
  }
  try {
    await deleteChamada(id);
    revalidateChamadas();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro ao excluir" };
  }
}

export async function addAlunoAction(
  classeId: string,
  membroId: string
): Promise<ActionResult> {
  try {
    await addAluno(classeId, membroId);
    revalidatePath(`/ebd/classes/${classeId}`);
    revalidateAlunos();
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
    revalidateAlunos();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
