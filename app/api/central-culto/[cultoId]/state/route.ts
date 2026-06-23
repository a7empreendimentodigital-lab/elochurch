export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCentralCultoState } from "@/services/central-culto.service";
import { requireAdminApiSession } from "@/lib/financeiro-api-auth";

interface RouteParams {
  params: Promise<{ cultoId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { cultoId } = await params;
  try {
    const state = await getCentralCultoState(cultoId);
    return NextResponse.json(state);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro" },
      { status: 400 }
    );
  }
}
