import Link from "next/link";
import { Pencil, MapPin, Phone, Church, User, IdCard, FileStack } from "lucide-react";
import { formatCpf } from "@/lib/cpf";
import { formatDateBR } from "@/lib/dates";
import type { MembroComIgreja } from "@/types/membro";
import {
  ESTADO_CIVIL_LABEL,
  MEMBRO_STATUS_LABEL,
  SEXO_LABEL,
} from "@/types/membro";
import { EloCard } from "@/components/elo/elo-card";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { DeleteMembroButton } from "@/components/membros/delete-membro-button";
import { AtivarPortalForm } from "@/components/portal/ativar-portal-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MembroDetailProps {
  membro: MembroComIgreja;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value === null || value === undefined || value === "" || value === "—")
    return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gold">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function MembroDetail({ membro, onDelete }: MembroDetailProps) {
  const initials = membro.nomeCompleto
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <EloCard
        accent="gold"
        headerAction={
          <div className="flex flex-wrap gap-2">
            <Button variant="gold" size="sm" asChild>
              <Link href={`/membros/${membro.id}/carteirinha`}>
                <IdCard className="mr-2 h-4 w-4" />
                Carteirinha
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/membros/${membro.id}/editar`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/documentos">
                <FileStack className="mr-2 h-4 w-4" />
                Documentos
              </Link>
            </Button>
            <AtivarPortalForm
              membroId={membro.id}
              portalAtivo={membro.portalAtivo}
            />
            <DeleteMembroButton
              membroId={membro.id}
              membroNome={membro.nomeCompleto}
              onDelete={onDelete}
            />
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-24 w-24 border-2 border-gold/40">
              {membro.foto && (
                <AvatarImage src={membro.foto} alt={membro.nomeCompleto} />
              )}
              <AvatarFallback className="bg-gold/10 text-2xl text-gold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="font-mono text-sm text-gold">{membro.codigo}</p>
              <h2 className="text-2xl font-bold">{membro.nomeCompleto}</h2>
              <div className="flex flex-wrap gap-2">
                <MembroStatusBadge status={membro.status} />
                <span className="text-sm text-muted-foreground">
                  {SEXO_LABEL[membro.sexo]} · {ESTADO_CIVIL_LABEL[membro.estadoCivil]}
                </span>
              </div>
              <Link
                href={`/igrejas/${membro.igreja.id}`}
                className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
              >
                <Church className="h-4 w-4" />
                {membro.igreja.nome}
              </Link>
            </div>
          </div>

          <Separator />

          <Section title="Dados pessoais">
            <DetailItem label="CPF" value={formatCpf(membro.cpf)} />
            <DetailItem label="RG" value={membro.rg ?? "—"} />
            <DetailItem label="Nascimento" value={formatDateBR(membro.nascimento)} />
            <DetailItem
              label="Estado civil"
              value={ESTADO_CIVIL_LABEL[membro.estadoCivil]}
            />
            <DetailItem label="Nome do cônjuge" value={membro.nomeEsposa ?? "—"} />
            <DetailItem label="Profissão" value={membro.profissao ?? "—"} />
          </Section>

          <Separator />

          <Section title="Contato">
            <DetailItem
              label="Telefone"
              value={
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {membro.telefone}
                </span>
              }
            />
            <DetailItem label="WhatsApp" value={membro.whatsapp ?? "—"} />
            <DetailItem
              label="E-mail"
              value={
                membro.email ? (
                  <a href={`mailto:${membro.email}`} className="text-gold hover:underline">
                    {membro.email}
                  </a>
                ) : (
                  "—"
                )
              }
            />
          </Section>

          <Separator />

          <Section title="Endereço">
            <DetailItem
              label="Endereço completo"
              value={
                <span className="inline-flex gap-1">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/80" />
                  <span>
                    {membro.rua}, {membro.numero}
                    {membro.complemento ? ` — ${membro.complemento}` : ""}
                    <br />
                    {membro.bairro} — {membro.cidade}/{membro.estado}
                    <br />
                    CEP {membro.cep}
                  </span>
                </span>
              }
            />
          </Section>

          <Separator />

          <Section title="Filiação">
            <DetailItem label="Pai" value={membro.pai ?? "—"} />
            <DetailItem label="Mãe" value={membro.mae ?? "—"} />
          </Section>

          <Separator />

          <Section title="Dados eclesiásticos">
            <DetailItem label="Data conversão" value={formatDateBR(membro.dataConversao)} />
            <DetailItem label="Batismo nas águas" value={formatDateBR(membro.batismoAguas)} />
            <DetailItem label="Local batismo" value={membro.localBatismo ?? "—"} />
            <DetailItem
              label="Batismo Espírito Santo"
              value={formatDateBR(membro.batismoEspiritoSanto)}
            />
            <DetailItem label="Igreja anterior" value={membro.igrejaAnterior ?? "—"} />
            <DetailItem label="Data admissão" value={formatDateBR(membro.dataAdmissao)} />
            <DetailItem label="Ministério" value={membro.ministerio ?? "—"} />
            <DetailItem label="Cargo" value={membro.cargo ?? "—"} />
            <DetailItem label="Congregação" value={membro.congregacao ?? "—"} />
          </Section>

          <Separator />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            Status: {MEMBRO_STATUS_LABEL[membro.status]} · igreja_id: {membro.igrejaId}
          </div>
        </div>
      </EloCard>
    </div>
  );
}
