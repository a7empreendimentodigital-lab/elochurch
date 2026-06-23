import { prisma } from "@/lib/prisma";
import { getConfigSistema } from "@/services/configuracoes.service";
import { getMembroById } from "@/services/membros.service";
import { buildDocumentoBranding } from "@/lib/documentos-ficha-header";
import type {
  DocumentoContext,
  DocumentoIgrejaContext,
  DocumentoMembroContext,
  DocumentoTipo,
} from "@/types/documentos";

function mapIgreja(igreja: {
  id: string;
  nome: string;
  tipo: "SEDE" | "FILIAL";
  responsavel: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string;
}): DocumentoIgrejaContext {
  return {
    id: igreja.id,
    nome: igreja.nome,
    tipo: igreja.tipo,
    responsavel: igreja.responsavel,
    endereco: igreja.endereco,
    cidade: igreja.cidade,
    estado: igreja.estado,
    telefone: igreja.telefone,
  };
}

function mapMembro(membro: NonNullable<Awaited<ReturnType<typeof getMembroById>>>): DocumentoMembroContext {
  return {
    id: membro.id,
    codigo: membro.codigo,
    nomeCompleto: membro.nomeCompleto,
    cpf: membro.cpf,
    rg: membro.rg,
    nascimento: membro.nascimento,
    sexo: membro.sexo,
    estadoCivil: membro.estadoCivil,
    nomeEsposa: membro.nomeEsposa,
    profissao: membro.profissao,
    telefone: membro.telefone,
    email: membro.email,
    cidade: membro.cidade,
    estado: membro.estado,
    dataConversao: membro.dataConversao,
    batismoAguas: membro.batismoAguas,
    localBatismo: membro.localBatismo,
    batismoEspiritoSanto: membro.batismoEspiritoSanto,
    igrejaAnterior: membro.igrejaAnterior,
    dataAdmissao: membro.dataAdmissao,
    ministerio: membro.ministerio,
    cargo: membro.cargo,
    congregacao: membro.congregacao,
    status: membro.status,
    igrejaId: membro.igrejaId,
    pai: membro.pai,
    mae: membro.mae,
    rua: membro.rua,
    numero: membro.numero,
    bairro: membro.bairro,
    foto: membro.foto,
  };
}

export async function getDocumentoContext(
  tipo: DocumentoTipo,
  membroId: string
): Promise<DocumentoContext | null> {
  const membro = await getMembroById(membroId).catch(() => null);
  if (!membro) return null;

  const igreja = await prisma.igreja.findUnique({
    where: { id: membro.igrejaId },
    select: {
      id: true,
      nome: true,
      tipo: true,
      responsavel: true,
      endereco: true,
      cidade: true,
      estado: true,
      telefone: true,
    },
  });
  if (!igreja) return null;

  const config = await getConfigSistema();

  return {
    tipo,
    membro: mapMembro(membro),
    igreja: mapIgreja(igreja),
    assinatura: {
      nome: config.assinatura.nome,
      texto: config.assinatura.texto,
    },
    branding: buildDocumentoBranding(mapIgreja(igreja), config),
  };
}
