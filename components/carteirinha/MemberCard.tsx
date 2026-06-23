import Image from "next/image";
import { Church, Shield, ShieldCheck, User } from "lucide-react";
import type { MemberCardData } from "@/types/carteirinha";
import { MemberCardQrBlock } from "@/components/carteirinha/member-card-qr-block";
import { MemberCardMobileNav } from "@/components/carteirinha/member-card-mobile-nav";
import { cn } from "@/lib/utils";

const NAVY = "#0B2D5C";
const NAVY_DARK = "#071B38";
const GOLD = "#D4A537";
const LIGHT = "#F8F9FA";

/** Proporção padrão de carteirinha física (horizontal / landscape) */
const CARD_ASPECT = "1.586 / 1";

interface MemberCardProps {
  data: MemberCardData;
  className?: string;
  exportId?: string;
}

function memberInitials(nome: string): string {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function BackInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-white/8 py-1.5 last:border-0">
      <span className="shrink-0 text-[8px] font-medium uppercase tracking-wide text-white/45">
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-[10px] font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

function MemberCardShell({
  side,
  children,
  className,
}: {
  side: "front" | "back";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-card-side={side}
      className={cn(
        "w-[min(calc(100vw-1.5rem),520px)] shrink-0 snap-center md:w-full md:max-w-[520px]",
        className
      )}
    >
      <p className="mb-2 hidden text-sm font-medium text-muted-foreground md:block">
        {side === "front" ? "Frente" : "Verso"}
      </p>
      {children}
    </div>
  );
}

function MemberCardFront({ data }: { data: MemberCardData }) {
  const initials = memberInitials(data.nome);
  const cargoDisplay = data.cargo?.trim() || "—";

  return (
    <article
      className={cn(
        "group relative grid w-full overflow-hidden rounded-2xl shadow-[0_16px_40px_-10px_rgba(7,27,56,0.5)]",
        "grid-rows-[1fr_auto] transition-shadow duration-300",
        "md:rounded-3xl md:hover:shadow-[0_28px_60px_-12px_rgba(7,27,56,0.65)]"
      )}
      style={{ aspectRatio: CARD_ASPECT }}
    >
      <div
        className="relative min-h-0 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)` }}
      >
        <div className="relative flex h-full min-h-0 flex-col p-3 sm:p-4 md:p-5">
          <header className="mb-2 flex items-center justify-between gap-2 sm:mb-2.5">
            <Image
              src="/brand/logomarca-horizontal.webp"
              alt="EloChurch"
              width={320}
              height={80}
              className="h-8 w-auto max-w-[72%] object-contain object-left sm:h-10 md:h-11"
              priority
            />
            {data.cargo?.trim() ? (
              <div
                className="flex max-w-[42%] shrink-0 items-center gap-1 rounded-full px-2 py-1 shadow-sm sm:px-2.5 sm:py-1.5"
                style={{ backgroundColor: GOLD }}
              >
                <User className="h-3 w-3 shrink-0 text-[#071B38] sm:h-3.5 sm:w-3.5" />
                <span className="truncate text-[9px] font-bold uppercase tracking-wide text-[#071B38] sm:text-[10px]">
                  {data.cargo.trim()}
                </span>
              </div>
            ) : null}
          </header>

          <div className="flex min-h-0 flex-1 items-stretch gap-2 sm:gap-3">
            <div className="relative aspect-[3/4] w-[4.25rem] shrink-0 self-center overflow-hidden rounded-lg border border-gold/25 sm:w-[5.5rem] md:w-28 md:rounded-xl">
              {data.foto ? (
                <Image
                  src={data.foto}
                  alt={data.nome}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 72px, 144px"
                  unoptimized={data.foto.startsWith("/uploads/")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#D4A537] text-base font-bold text-[#071B38] sm:text-lg">
                  {initials}
                </div>
              )}
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-2 sm:gap-2.5">
              <h2 className="line-clamp-2 text-sm font-bold leading-tight text-white sm:text-base md:text-lg">
                {data.nome}
              </h2>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B2D5C] sm:h-8 sm:w-8">
                    <Church className="h-3.5 w-3.5 text-[#D4A537] sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-wider text-white/50 sm:text-[9px]">
                      Igreja
                    </p>
                    <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-white sm:text-xs">
                      {data.igreja}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B2D5C] sm:h-8 sm:w-8">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#D4A537] sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-wider text-white/50 sm:text-[9px]">
                      Cargo
                    </p>
                    <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-white sm:text-xs">
                      {cargoDisplay}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer
        className="relative z-10 shrink-0 border-t-2 bg-white px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3"
        style={{ borderColor: GOLD }}
      >
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <div className="min-w-0">
            <p
              className="text-[6px] font-semibold uppercase leading-none tracking-wide sm:text-[7px]"
              style={{ color: "#0B2D5C99" }}
            >
              Código
            </p>
            <p
              className="mt-0.5 break-all font-mono text-[9px] font-bold leading-tight sm:text-[10px]"
              style={{ color: NAVY_DARK }}
            >
              {data.codigo || "—"}
            </p>
          </div>
          <div className="min-w-0 text-center">
            <p
              className="text-[6px] font-semibold uppercase leading-none tracking-wide sm:text-[7px]"
              style={{ color: "#0B2D5C99" }}
            >
              Admissão
            </p>
            <p
              className="mt-0.5 text-[9px] font-bold leading-tight sm:text-[10px]"
              style={{ color: NAVY_DARK }}
            >
              {data.dataAdmissao ?? "—"}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p
              className="text-[6px] font-semibold uppercase leading-none tracking-wide sm:text-[7px]"
              style={{ color: "#0B2D5C99" }}
            >
              Pastor pres.
            </p>
            <p
              className="mt-0.5 line-clamp-2 text-[9px] font-semibold italic leading-tight sm:text-[10px]"
              style={{ color: NAVY_DARK }}
              title={data.pastorPresidente}
            >
              {data.pastorPresidente || "—"}
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}

async function MemberCardBack({ data }: { data: MemberCardData }) {
  const congregacao = data.congregacao?.trim() || "—";
  const ministerio = data.ministerio?.trim() || "—";

  return (
    <article
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl shadow-[0_16px_40px_-10px_rgba(7,27,56,0.5)]",
        "transition-shadow duration-300 md:rounded-3xl md:hover:shadow-[0_28px_60px_-12px_rgba(7,27,56,0.65)]"
      )}
      style={{ aspectRatio: CARD_ASPECT }}
    >
      <div className="relative flex h-full flex-col" style={{ backgroundColor: NAVY_DARK }}>
        <div className="flex min-h-0 flex-1 flex-row">
          <div
            className="flex min-w-0 flex-1 flex-col overflow-hidden px-2.5 py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-4"
            style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)` }}
          >
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/55 sm:text-[10px]">
              Dados do membro
            </p>
            <div className="flex min-h-0 flex-1 flex-col justify-center rounded-lg bg-black/10 px-1.5 py-0.5 sm:px-2 sm:py-1">
              <BackInfoRow label="Nascimento" value={data.nascimento} />
              <BackInfoRow label="Estado civil" value={data.estadoCivil} />
              {data.nomeEsposa ? (
                <BackInfoRow label="Nome do cônjuge" value={data.nomeEsposa} />
              ) : null}
              <BackInfoRow label="Ministério" value={ministerio} />
              <BackInfoRow label="Congregação" value={congregacao} />
              <BackInfoRow label="Contato" value={data.telefone} />
            </div>
          </div>

          <div
            className="flex w-[42%] max-w-[9.5rem] shrink-0 flex-col items-center justify-center gap-1 border-l border-[#D4A537]/25 px-1.5 py-2 sm:w-[44%] sm:max-w-none sm:gap-1.5 sm:px-2 sm:py-3 md:px-3"
            style={{ backgroundColor: LIGHT }}
          >
            <p className="text-center text-[7px] font-semibold uppercase tracking-wider text-[#0B2D5C]/65 sm:text-[8px]">
              Verificação
            </p>
            <MemberCardQrBlock url={data.qrUrl} size={92} className="sm:hidden" />
            <MemberCardQrBlock
              url={data.qrUrl}
              size={120}
              className="hidden sm:block md:hidden"
            />
            <MemberCardQrBlock
              url={data.qrUrl}
              size={132}
              className="hidden md:block"
            />
            <p className="max-w-[120px] text-center text-[7px] leading-snug text-[#0B2D5C]/60 sm:text-[8px]">
              Escaneie para validar
            </p>
            <p className="font-mono text-[8px] font-semibold text-[#0B2D5C]/80 sm:text-[9px]">
              {data.codigo}
            </p>
          </div>
        </div>

        <footer
          className="shrink-0 border-t border-[#D4A537]/30 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4"
          style={{ backgroundColor: NAVY_DARK }}
        >
          <div className="flex items-start gap-1 pb-1.5 sm:pb-2">
            <Shield className="mt-0.5 h-3 w-3 shrink-0 text-[#D4A537]" />
            <p className="text-[6px] leading-snug text-white/70 sm:text-[7px]">
              <span className="font-semibold uppercase text-white/85">
                Carteirinha pessoal e intransferível.
              </span>{" "}
              Em caso de perda, comunique a secretaria.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1.5 border-t border-white/10 pt-1.5 text-[6px] sm:gap-2 sm:pt-2 sm:text-[7px]">
            <div>
              <p className="uppercase tracking-wider text-white/40">Válida até</p>
              <p className="mt-0.5 font-semibold text-white">{data.validaAte}</p>
            </div>
            <div className="text-center">
              <p className="uppercase tracking-wider text-white/40">Emitida em</p>
              <p className="mt-0.5 font-semibold text-white">{data.emitidaEm}</p>
            </div>
            <div className="text-right">
              <p className="uppercase tracking-wider text-white/40">Código</p>
              <p className="mt-0.5 font-mono font-semibold text-[#D4A537]">{data.codigo}</p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}

export async function MemberCard({
  data,
  className,
  exportId = "member-card-export",
}: MemberCardProps) {
  return (
    <div id={exportId} className={cn("w-full", className)}>
      <MemberCardMobileNav>
        <MemberCardShell side="front">
          <MemberCardFront data={data} />
        </MemberCardShell>
        <MemberCardShell side="back">
          <MemberCardBack data={data} />
        </MemberCardShell>
      </MemberCardMobileNav>
    </div>
  );
}
