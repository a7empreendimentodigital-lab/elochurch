import type { ComponentType } from "react";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Church,
  FileText,
  Phone,
  Shield,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import type { MemberCardData } from "@/types/carteirinha";
import {
  getCargoMinisterioDisplay,
  getStatusCarteirinhaTitulo,
} from "@/types/carteirinha";
import { MemberCardQrBlock } from "@/components/carteirinha/member-card-qr-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NAVY = "#0B2D5C";
const NAVY_DARK = "#071B38";
const GOLD = "#D4A537";
const LIGHT = "#F8F9FA";

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

function InfoField({
  icon: Icon,
  label,
  value,
  light,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  light?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
          light ? "border-gold/40 bg-gold/10" : "border-gold/30 bg-gold/15"
        )}
      >
        <Icon className="h-4 w-4 text-[#D4A537]" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[9px] font-medium uppercase tracking-wider",
            light ? "text-white/45" : "text-white/50"
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "truncate text-sm font-semibold",
            light ? "text-white" : "text-white"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function MemberCardFront({ data }: { data: MemberCardData }) {
  const initials = memberInitials(data.nome);
  const cargoDisplay = getCargoMinisterioDisplay(data.cargo, data.ministerio);

  return (
    <article
      className={cn(
        "group relative w-full max-w-[520px] overflow-hidden rounded-3xl shadow-[0_20px_50px_-12px_rgba(7,27,56,0.55)]",
        "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-12px_rgba(7,27,56,0.65)]",
        "backdrop-blur-[2px]"
      )}
      style={{ aspectRatio: "1.586 / 1" }}
    >
      <div
        className="relative flex h-full flex-col"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)` }}
      >
        {/* Marca d'água */}
        <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.07]">
          <Image
            src="/brand/icone.png"
            alt=""
            width={200}
            height={200}
            className="object-contain"
            aria-hidden
          />
        </div>

        <div className="relative flex flex-1 flex-col p-4 sm:p-5 md:p-6">
          {/* Cabeçalho */}
          <header className="mb-3 flex items-start justify-between gap-2 sm:mb-4">
            <div className="min-w-0">
              <Image
                src="/brand/logo.png"
                alt="EloChurch"
                width={140}
                height={36}
                className="h-7 w-auto object-contain object-left sm:h-8"
                priority
              />
              <p className="mt-1 max-w-[200px] text-[9px] leading-snug text-white/55 sm:text-[10px]">
                Conectando igrejas, fortalecendo comunhões.
              </p>
            </div>
            <div
              className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 shadow-sm backdrop-blur-sm sm:px-3 sm:py-1.5"
              style={{ backgroundColor: GOLD }}
            >
              <User className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
                Membro
              </span>
            </div>
          </header>

          {/* Corpo */}
          <div className="flex flex-1 gap-3 sm:gap-4">
            <Avatar className="h-[72px] w-[72px] shrink-0 rounded-xl border-2 border-[#D4A537]/50 shadow-lg sm:h-24 sm:w-24 md:h-28 md:w-28">
              {data.foto && (
                <AvatarImage
                  src={data.foto}
                  alt={data.nome}
                  className="rounded-xl object-cover"
                />
              )}
              <AvatarFallback className="rounded-xl bg-[#D4A537]/20 text-lg font-bold text-[#D4A537]">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h2 className="line-clamp-2 text-base font-bold leading-tight text-white sm:text-lg md:text-xl">
                {data.nome}
              </h2>
              <p
                className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest sm:text-xs"
                style={{ color: GOLD }}
              >
                {getStatusCarteirinhaTitulo(data.status)}
              </p>

              <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <Church className="h-3.5 w-3.5 text-[#D4A537]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-wider text-white/45">
                      Igreja
                    </p>
                    <p className="truncate text-xs font-medium text-white sm:text-sm">
                      {data.igreja}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#D4A537]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-wider text-white/45">
                      Cargo / Ministério
                    </p>
                    <p className="truncate text-xs font-medium text-white sm:text-sm">
                      {cargoDisplay}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé branco */}
        <footer
          className="relative border-t-2 bg-white px-3 py-2.5 sm:px-5 sm:py-3"
          style={{ borderColor: GOLD }}
        >
          <div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
            <div>
              <p className="text-[8px] font-medium uppercase tracking-wider text-[#0B2D5C]/50 sm:text-[9px]">
                Código do membro
              </p>
              <p className="font-mono text-xs font-bold text-[#071B38] sm:text-sm">
                {data.codigo}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-medium uppercase tracking-wider text-[#0B2D5C]/50 sm:text-[9px]">
                Data de admissão
              </p>
              <p className="text-xs font-bold text-[#071B38] sm:text-sm">
                {data.dataAdmissao ?? "—"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-end">
              <p
                className="max-w-full truncate font-serif text-base italic leading-none text-[#0B2D5C] sm:text-lg"
                title={data.pastorPresidente}
              >
                {data.pastorPresidente}
              </p>
              <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-[#0B2D5C]/50 sm:text-[9px]">
                Pastor presidente
              </p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}

async function MemberCardBack({ data }: { data: MemberCardData }) {
  const congregacao = data.congregacao?.trim() || "—";
  const ministerio = data.ministerio?.trim() || "—";

  return (
    <article
      className={cn(
        "group relative w-full max-w-[520px] overflow-hidden rounded-3xl shadow-[0_20px_50px_-12px_rgba(7,27,56,0.55)]",
        "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-12px_rgba(7,27,56,0.65)]"
      )}
      style={{ aspectRatio: "1.586 / 1" }}
    >
      <div className="relative flex h-full flex-col" style={{ backgroundColor: NAVY_DARK }}>
        <div className="relative flex min-h-0 flex-1">
          {/* Painel esquerdo */}
          <div
            className="relative z-10 flex w-[58%] flex-col p-4 sm:p-5"
            style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)` }}
          >
            <Image
              src="/brand/icone.png"
              alt="EloChurch"
              width={32}
              height={32}
              className="mb-3 h-7 w-7 object-contain sm:h-8 sm:w-8"
            />
            <div className="space-y-2.5 border-t border-white/10 pt-3 sm:space-y-3">
              <InfoField
                icon={Calendar}
                label="Data de nascimento"
                value={data.nascimento}
                light
              />
              <div className="border-t border-white/8" />
              <InfoField
                icon={User}
                label="Estado civil"
                value={data.estadoCivil}
                light
              />
              <div className="border-t border-white/8" />
              <InfoField icon={BookOpen} label="Ministério" value={ministerio} light />
              <div className="border-t border-white/8" />
              <InfoField icon={Users} label="Congregação" value={congregacao} light />
              <div className="border-t border-white/8" />
              <InfoField icon={Phone} label="Contato" value={data.telefone} light />
            </div>
          </div>

          {/* Divisor curvo */}
          <svg
            className="pointer-events-none absolute top-0 z-20 h-full"
            style={{ right: "38%", width: "12%" }}
            viewBox="0 0 48 200"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M48,0 C8,40 8,80 48,120 C8,160 8,200 48,200 L48,0 Z"
              fill={LIGHT}
              stroke={GOLD}
              strokeWidth="1.5"
            />
          </svg>

          {/* Painel direito — QR */}
          <div
            className="absolute inset-y-0 right-0 flex w-[46%] flex-col items-center justify-center px-3 sm:px-4"
            style={{ backgroundColor: LIGHT }}
          >
            <p className="mb-2 text-center text-[9px] font-semibold uppercase tracking-wider text-[#0B2D5C]/70">
              QR Code de verificação
            </p>
            <MemberCardQrBlock url={data.qrUrl} size={120} className="sm:hidden" />
            <MemberCardQrBlock
              url={data.qrUrl}
              size={148}
              className="hidden sm:block"
            />
            <p className="mt-2 max-w-[140px] text-center text-[8px] leading-snug text-[#0B2D5C]/55 sm:text-[9px]">
              Escaneie para verificar a autenticidade deste membro.
            </p>
          </div>
        </div>

        {/* Rodapé verso */}
        <footer
          className="flex flex-wrap items-center gap-2 border-t border-[#D4A537]/30 px-3 py-2 text-[8px] sm:px-4 sm:py-2.5 sm:text-[9px]"
          style={{ backgroundColor: NAVY_DARK }}
        >
          <div className="flex min-w-0 flex-1 items-start gap-1.5">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4A537]" />
            <p className="leading-snug text-white/75">
              <span className="font-semibold uppercase text-white/90">
                Esta carteirinha é pessoal e intransferível.
              </span>{" "}
              Em caso de perda, comunique a secretaria da sua igreja.
            </p>
          </div>
          <div className="flex shrink-0 gap-3 sm:gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-[#D4A537]" />
              <div>
                <p className="uppercase tracking-wider text-white/45">Válida até</p>
                <p className="font-semibold text-white">{data.validaAte}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3 text-[#D4A537]" />
              <div>
                <p className="uppercase tracking-wider text-white/45">Emitida em</p>
                <p className="font-semibold text-white">{data.emitidaEm}</p>
              </div>
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
    <div
      id={exportId}
      className={cn(
        "flex w-full flex-col items-center gap-6 sm:gap-8",
        "max-md:[&_article]:max-w-full max-md:[&_article]:rounded-2xl",
        className
      )}
    >
      <MemberCardFront data={data} />
      <MemberCardBack data={data} />
    </div>
  );
}
