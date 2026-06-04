import { CheckCircle2, Church, Music2, Shield } from "lucide-react";
import type { MembroPublicoVerificacao } from "@/types/carteirinha";
import { getCargoMinisterioDisplay } from "@/types/carteirinha";
import { MEMBRO_STATUS_LABEL } from "@/types/membro";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MembroPublicViewProps {
  data: MembroPublicoVerificacao;
  className?: string;
}

const statusAtivo = new Set<MembroPublicoVerificacao["status"]>([
  "ATIVO",
  "CONGREGADO",
  "EXPERIENCIA",
]);

export function MembroPublicView({ data, className }: MembroPublicViewProps) {
  const initials = data.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const cargoLabel = getCargoMinisterioDisplay(data.cargo, data.ministerio);
  const ministerioLabel = data.ministerio?.trim() || "—";
  const isValid = statusAtivo.has(data.status);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#D4A537]/25 bg-gradient-to-b from-[#0B2D5C] to-[#071B38] shadow-2xl",
        className
      )}
    >
      <div className="border-b border-[#D4A537]/20 bg-[#D4A537]/10 px-6 py-4 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#D4A537]/15 px-3 py-1 text-xs font-medium text-[#D4A537]">
          {isValid ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Membro verificado
            </>
          ) : (
            <>
              <Shield className="h-3.5 w-3.5" />
              Consulta pública
            </>
          )}
        </div>
        <p className="text-sm text-white/60">EloChurch · Verificação de membro</p>
      </div>

      <div className="flex flex-col items-center px-6 py-8">
        <Avatar className="mb-4 h-28 w-28 border-4 border-[#D4A537]/30 shadow-xl">
          {data.foto && (
            <AvatarImage src={data.foto} alt={data.nome} className="object-cover" />
          )}
          <AvatarFallback className="bg-[#D4A537]/15 text-2xl text-[#D4A537]">
            {initials}
          </AvatarFallback>
        </Avatar>

        <p className="font-mono text-xs text-[#D4A537]">{data.codigo}</p>
        <h1 className="mt-2 text-center text-xl font-bold text-white">{data.nome}</h1>

        <div className="mt-4 w-full space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Church className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A537]" />
            <div>
              <p className="text-xs text-white/50">Igreja</p>
              <p className="text-sm font-medium text-white">{data.igreja}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A537]" />
            <div>
              <p className="text-xs text-white/50">Cargo</p>
              <p className="text-sm font-medium text-white">{cargoLabel}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Music2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A537]" />
            <div>
              <p className="text-xs text-white/50">Ministério</p>
              <p className="text-sm font-medium text-white">{ministerioLabel}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Status</p>
              <p className="text-sm text-white/80">
                {MEMBRO_STATUS_LABEL[data.status]}
              </p>
            </div>
            <MembroStatusBadge status={data.status} />
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/35">
          CPF, RG, endereço, telefone e dados financeiros não são exibidos nesta
          página.
        </p>
      </div>
    </div>
  );
}
