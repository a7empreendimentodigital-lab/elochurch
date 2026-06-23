export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCentralCultoState } from "@/services/central-culto.service";
import { formatDateBR } from "@/lib/dates";
import { AdminPage } from "@/components/admin/admin-page";
import { CentralCultoNav } from "@/components/central-culto/central-culto-nav";
import { CentralStatusBadge } from "@/components/central-culto/central-status-badge";
import { CentralRoomControls } from "@/components/central-culto/central-room-controls";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ cultoId: string }>;
}

export default async function CentralCultoRoomLayout({ children, params }: LayoutProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId).catch(() => null);
  if (!state) notFound();

  return (
    <AdminPage maxWidth="7xl">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/central-culto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Central do Culto
        </Link>
      </Button>

      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {state.culto.titulo}
            </h1>
            <CentralStatusBadge status={state.culto.centralStatus} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {state.culto.igrejaNome} · {formatDateBR(new Date(state.culto.data))}
            {state.culto.horario ? ` · ${state.culto.horario}` : ""}
          </p>
        </div>
        <CentralRoomControls cultoId={cultoId} status={state.culto.centralStatus} />
      </div>

      <CentralCultoNav cultoId={cultoId} />
      {children}
    </AdminPage>
  );
}
