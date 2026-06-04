import * as XLSX from "xlsx";
import {
  PAT_BEM_STATUS_LABEL,
  PAT_CATEGORIA_LABEL,
  PAT_MANUTENCAO_TIPO_LABEL,
  type RelatorioPatrimonio,
} from "@/types/patrimonio";
import { formatDateBR } from "@/lib/dates";

export function generateRelatorioPatrimonioExcel(
  relatorio: RelatorioPatrimonio
): Buffer {
  const wb = XLSX.utils.book_new();

  const resumoSheet = XLSX.utils.aoa_to_sheet([
    ["Relatório Patrimonial — EloChurch"],
    ["Igreja", relatorio.igreja.nome],
    [],
    ["Total de bens", relatorio.resumo.totalBens],
    ["Valor patrimonial", relatorio.resumo.valorTotal],
    [],
    ["Categoria", "Quantidade", "Valor"],
    ...relatorio.resumo.porCategoria.map((c) => [
      PAT_CATEGORIA_LABEL[c.categoria],
      c.quantidade,
      c.valor,
    ]),
  ]);
  XLSX.utils.book_append_sheet(wb, resumoSheet, "Resumo");

  const bensSheet = XLSX.utils.json_to_sheet(
    relatorio.bens.map((b) => ({
      Código: b.codigo,
      Nome: b.nome,
      Categoria: PAT_CATEGORIA_LABEL[b.categoria],
      Localização: b.localizacao,
      Valor: b.valor,
      Status: PAT_BEM_STATUS_LABEL[b.status],
      Fornecedor: b.fornecedor ?? "",
    }))
  );
  XLSX.utils.book_append_sheet(wb, bensSheet, "Inventário");

  const manutSheet = XLSX.utils.json_to_sheet(
    relatorio.manutencoes.map((m) => ({
      Data: formatDateBR(m.data),
      Código: m.bemCodigo,
      Bem: m.bemNome,
      Tipo: PAT_MANUTENCAO_TIPO_LABEL[m.tipo],
      Descrição: m.descricao,
      Custo: m.custo ?? "",
      Concluída: m.concluida ? "Sim" : "Não",
    }))
  );
  XLSX.utils.book_append_sheet(wb, manutSheet, "Manutenções");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
