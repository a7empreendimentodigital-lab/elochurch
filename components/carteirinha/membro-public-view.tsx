import Image from "next/image";
import {
  CheckCircle2,
  Church,
  Heart,
  Shield,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import type { MembroPublicoVerificacao } from "@/types/carteirinha";
import { MEMBRO_STATUS_LABEL } from "@/types/membro";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { DeveloperCredit } from "@/components/elo/developer-credit";
import { cn } from "@/lib/utils";

const NAVY = "#0B2D5C";
const NAVY_DARK = "#071B38";
const GOLD = "#D4A537";

interface MembroPublicViewProps {
  data: MembroPublicoVerificacao;
  className?: string;
}

const statusAtivo = new Set<MembroPublicoVerificacao["status"]>([
  "ATIVO",
  "CONGREGADO",
  "EXPERIENCIA",
]);

function memberInitials(nome: string): string {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border-b border-white/10 py-3 last:border-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A537]" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-white">{value}</p>
      </div>
    </div>
  );
}

export function MembroPublicView({ data, className }: MembroPublicViewProps) {
  const initials = memberInitials(data.nome);
  const cargoDisplay = data.cargo?.trim() || null;
  const isValid = statusAtivo.has(data.status);

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-lg overflow-hidden rounded-2xl shadow-[0_20px_50px_-12px_rgba(7,27,56,0.55)] sm:rounded-3xl",
        className
      )}
    >
      {/* Cabeçalho */}
      <div
        className="px-4 pb-4 pt-5 sm:px-6 sm:pt-6"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <Image
            src="/brand/logomarca-horizontal.webp"
            alt="EloChurch"
            width={400}
            height={100}
            className="h-11 w-auto max-w-[72%] object-contain object-left sm:h-14 md:h-16"
            priority
          />
          <div
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
              isValid
                ? "bg-[#D4A537] text-[#071B38]"
                : "bg-white/15 text-white/90"
            )}
          >
            {isValid ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verificado
              </>
            ) : (
              <>
                <Shield className="h-3.5 w-3.5" />
                Consulta
              </>
            )}
          </div>
        </div>

        <p className="mt-4 font-mono text-sm font-bold tracking-wide text-[#D4A537]">
          {data.codigo}
        </p>
      </div>

      {/* Identidade */}
      <div
        className="border-t border-white/10 px-4 py-5 sm:px-6"
        style={{
          background: `linear-gradient(180deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`,
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative mx-auto aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-xl border-2 border-[#D4A537]/40 sm:mx-0 sm:w-32">
            {data.foto ? (
              <Image
                src={data.foto}
                alt={data.nome}
                fill
                className="object-cover object-center"
                sizes="128px"
                unoptimized={data.foto.startsWith("/uploads/")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#D4A537] text-2xl font-bold text-[#071B38]">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl">
              {data.nome}
            </h1>
            {cargoDisplay ? (
              <div
                className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{ backgroundColor: GOLD }}
              >
                <User className="h-3.5 w-3.5 shrink-0 text-[#071B38]" />
                <span className="text-xs font-bold uppercase tracking-wide text-[#071B38]">
                  {cargoDisplay}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Dados */}
      <div
        className="px-4 py-2 sm:px-6"
        style={{ background: NAVY_DARK }}
      >
        <div className="rounded-xl border border-white/10 bg-white/5 px-4">
          <InfoRow icon={Church} label="Igreja" value={data.igreja} />
          {cargoDisplay ? (
            <InfoRow icon={ShieldCheck} label="Cargo" value={cargoDisplay} />
          ) : null}
          {data.congregacao ? (
            <InfoRow icon={Users} label="Congregação" value={data.congregacao} />
          ) : null}
          <InfoRow icon={Heart} label="Estado civil" value={data.estadoCivil} />
          {data.nomeEsposa ? (
            <InfoRow icon={User} label="Nome do cônjuge" value={data.nomeEsposa} />
          ) : null}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3 last:border-0">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                Status
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {MEMBRO_STATUS_LABEL[data.status]}
              </p>
            </div>
            <MembroStatusBadge status={data.status} />
          </div>
        </div>
      </div>

      {/* Rodapé emissão */}
      <footer
        className="border-t-2 bg-white px-4 py-4 sm:px-6 sm:py-5"
        style={{ borderColor: GOLD }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0B2D5C]/55">
              Emitida
            </p>
            <p className="mt-1 text-sm font-bold text-[#071B38]">{data.emitidaEm}</p>
          </div>
          <div className="sm:text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0B2D5C]/55">
              Válida até
            </p>
            <p className="mt-1 text-sm font-bold text-[#071B38]">{data.validaAte}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0B2D5C]/55">
              Pastor
            </p>
            <p className="mt-1 text-sm font-bold leading-snug text-[#071B38]">
              {data.pastorPresidente}
            </p>
          </div>
        </div>
      </footer>

      <footer className="space-y-2 bg-[#071B38] px-4 py-4 text-center">
        <p className="text-[11px] leading-relaxed text-white/60">
          Dados sensíveis não são exibidos nesta página (LGPD).
        </p>
        <DeveloperCredit className="text-[11px] text-white/50" />
      </footer>
    </article>
  );
}
