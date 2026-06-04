import * as XLSX from "xlsx";
import { formatDateBR } from "@/lib/dates";
import {
  FIN_FORMA_PAGAMENTO_LABEL,
  FIN_OFERTA_TIPO_LABEL,
  type RelatorioFinanceiro,
} from "@/types/financeiro";

export function generateRelatorioFinanceiroExcel(
  relatorio: RelatorioFinanceiro
): Buffer {
  const wb = XLSX.utils.book_new();
  const { resumo } = relatorio;

  const resumoSheet = XLSX.utils.aoa_to_sheet([
    ["Relatório Financeiro — EloChurch"],
    ["Igreja", relatorio.igreja.nome],
    [
      "Período",
      `${formatDateBR(new Date(`${relatorio.periodo.de}T12:00:00.000Z`))} a ${formatDateBR(new Date(`${relatorio.periodo.ate}T12:00:00.000Z`))}`,
    ],
    [],
    ["Indicador", "Valor"],
    ["Dízimos", resumo.dizimos],
    ["Ofertas", resumo.ofertas],
    ["Receitas", resumo.receitas],
    ["Despesas", resumo.despesas],
    ["Total entradas", resumo.entradas],
    ["Saldo", resumo.saldo],
  ]);
  XLSX.utils.book_append_sheet(wb, resumoSheet, "Resumo");

  const dizimosSheet = XLSX.utils.json_to_sheet(
    relatorio.dizimos.map((d) => ({
      Data: formatDateBR(d.data),
      Código: d.codigo,
      Membro: d.membro,
      Valor: d.valor,
      "Forma pagamento": FIN_FORMA_PAGAMENTO_LABEL[d.formaPagamento],
    }))
  );
  XLSX.utils.book_append_sheet(wb, dizimosSheet, "Dízimos");

  const ofertasSheet = XLSX.utils.json_to_sheet(
    relatorio.ofertas.map((o) => ({
      Data: formatDateBR(o.data),
      Tipo: FIN_OFERTA_TIPO_LABEL[o.tipo],
      Descrição: o.descricao,
      Valor: o.valor,
      "Forma pagamento": FIN_FORMA_PAGAMENTO_LABEL[o.formaPagamento],
    }))
  );
  XLSX.utils.book_append_sheet(wb, ofertasSheet, "Ofertas");

  const receitasSheet = XLSX.utils.json_to_sheet(
    relatorio.receitas.map((r) => ({
      Data: formatDateBR(r.data),
      Descrição: r.descricao,
      Categoria: r.categoria ?? "",
      Valor: r.valor,
      "Forma pagamento": FIN_FORMA_PAGAMENTO_LABEL[r.formaPagamento],
    }))
  );
  XLSX.utils.book_append_sheet(wb, receitasSheet, "Receitas");

  const despesasSheet = XLSX.utils.json_to_sheet(
    relatorio.despesas.map((d) => ({
      Data: formatDateBR(d.data),
      Descrição: d.descricao,
      Categoria: d.categoria ?? "",
      Valor: d.valor,
      "Forma pagamento": FIN_FORMA_PAGAMENTO_LABEL[d.formaPagamento],
    }))
  );
  XLSX.utils.book_append_sheet(wb, despesasSheet, "Despesas");

  const fluxoRows = [
    ...relatorio.dizimos.map((d) => ({
      Data: formatDateBR(d.data),
      Tipo: "Entrada",
      Origem: "Dízimo",
      Descrição: d.membro,
      Valor: d.valor,
    })),
    ...relatorio.ofertas.map((o) => ({
      Data: formatDateBR(o.data),
      Tipo: "Entrada",
      Origem: `Oferta ${FIN_OFERTA_TIPO_LABEL[o.tipo]}`,
      Descrição: o.descricao,
      Valor: o.valor,
    })),
    ...relatorio.receitas.map((r) => ({
      Data: formatDateBR(r.data),
      Tipo: "Entrada",
      Origem: "Receita",
      Descrição: r.descricao,
      Valor: r.valor,
    })),
    ...relatorio.despesas.map((d) => ({
      Data: formatDateBR(d.data),
      Tipo: "Saída",
      Origem: "Despesa",
      Descrição: d.descricao,
      Valor: -d.valor,
    })),
  ];
  const fluxoSheet = XLSX.utils.json_to_sheet(fluxoRows);
  XLSX.utils.book_append_sheet(wb, fluxoSheet, "Fluxo de Caixa");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return buf;
}
