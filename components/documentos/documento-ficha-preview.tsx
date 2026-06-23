import type { DocumentoFichaModelo } from "@/types/documentos";
import { FICHA_PAGE_HEIGHT_MM, FICHA_PAGE_WIDTH_MM } from "@/types/documentos";

interface DocumentoFichaPreviewProps {
  modelo: DocumentoFichaModelo;
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="font-bold">{label}</span> {value}
    </span>
  );
}

function RowSeparator() {
  return <span className="text-black/40">|</span>;
}

export function DocumentoFichaPreview({ modelo }: DocumentoFichaPreviewProps) {
  return (
    <div
      id="documento-preview"
      className="mx-auto box-border overflow-hidden bg-white shadow-md print:shadow-none"
      style={{
        width: `${FICHA_PAGE_WIDTH_MM}mm`,
        height: `${FICHA_PAGE_HEIGHT_MM}mm`,
        maxWidth: "100%",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Cabeçalho institucional — somente logo e contatos */}
      <header className="flex items-start justify-between gap-3 px-4 pt-3">
        <div className="flex h-[18mm] min-w-[45mm] max-w-[70mm] flex-1 items-center">
          {modelo.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={modelo.logoUrl}
              alt="Logo institucional"
              className="max-h-full max-w-full object-contain object-left"
            />
          ) : (
            <div className="h-[18mm] w-[45mm] rounded border border-gray-200 bg-gray-50" />
          )}
        </div>

        <div className="w-[52mm] shrink-0 text-right text-[6.5pt] leading-snug text-black/85">
          <p>{modelo.headerEndereco}</p>
          <p>{modelo.headerLocal}</p>
          {modelo.headerCnpj && <p>CNPJ: {modelo.headerCnpj}</p>}
          {modelo.headerSite && <p>{modelo.headerSite}</p>}
          {modelo.headerRedeSocial && <p>{modelo.headerRedeSocial}</p>}
        </div>
      </header>

      {/* Título do documento */}
      <h1
        className="mt-1.5 text-center text-[17pt] font-normal tracking-wide text-black"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        {modelo.tipoLabel}
      </h1>

      {/* Card de dados pessoais */}
      <div className="relative mx-4 mt-2 rounded-lg border border-gray-300 bg-white">
        {/* Foto — canto superior direito do card */}
        <div className="absolute right-2 top-2 z-10 h-[34mm] w-[26mm] overflow-hidden rounded-md border border-gray-300 bg-gray-100">
          {modelo.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={modelo.fotoUrl}
              alt={modelo.nomeMembro}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[7pt] text-gray-400">
              Sem foto
            </div>
          )}
        </div>

        <div className="px-3 pb-1 pt-2 pr-[30mm]">
          <p className="text-[11pt] font-bold leading-tight text-black">{modelo.nomeMembro}</p>
        </div>

        <div className="mr-[28mm]">
          <div className="bg-black px-3 py-1">
            <p className="text-[8.5pt] font-bold uppercase tracking-wide text-white">
              DADOS PESSOAIS
            </p>
          </div>

          <div className="space-y-1 px-3 py-2 text-[8pt] leading-snug text-black">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <LabelValue label="R.G.:" value={modelo.rg} />
              <RowSeparator />
              <LabelValue label="C.P.F.:" value={modelo.cpf} />
              <RowSeparator />
              <LabelValue label="Nascimento:" value={modelo.nascimento} />
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <LabelValue label="Endereço:" value={modelo.endereco} />
              <RowSeparator />
              <LabelValue label="Nº:" value={modelo.numero} />
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <LabelValue label="Bairro:" value={modelo.bairro} />
              <RowSeparator />
              <LabelValue label="Cidade:" value={modelo.cidade} />
              <RowSeparator />
              <LabelValue label="UF:" value={modelo.uf} />
            </div>
            <p>
              <LabelValue label="Mãe:" value={modelo.mae} />
            </p>
            <p>
              <LabelValue label="Pai:" value={modelo.pai} />
            </p>
          </div>
        </div>
      </div>

      {/* Declaração */}
      <p className="mx-4 mt-2 text-[7.5pt] leading-snug text-black">{modelo.declaracao}</p>

      {/* Rodapé — cidade/data à esquerda, assinatura à direita */}
      <div className="mx-4 mt-3 flex items-end justify-between gap-6">
        <div className="text-[8pt] text-black">
          <p className="font-bold">{modelo.cidadeAssinatura}</p>
          <p className="mt-0.5">{modelo.dataAssinatura}</p>
        </div>
        <div className="w-[70mm] text-center text-[7.5pt]">
          <div className="border-b border-black" />
          <p className="mt-1 font-normal">{modelo.nomeAssinatura}</p>
        </div>
      </div>
    </div>
  );
}
