import type { DocumentoRecomendacaoModelo } from "@/types/documentos";

interface DocumentoRecomendacaoPreviewProps {
  modelo: DocumentoRecomendacaoModelo;
}

export function DocumentoRecomendacaoPreview({ modelo }: DocumentoRecomendacaoPreviewProps) {
  return (
    <div
      id="documento-preview"
      className="mx-auto box-border min-h-[297mm] w-[210mm] max-w-full bg-white p-[20mm_18mm] font-serif text-[11pt] leading-relaxed text-black shadow-sm print:shadow-none"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <h1 className="mb-10 text-center text-[14pt] font-bold tracking-wide">
        {modelo.titulo}
      </h1>

      <div className="space-y-2 text-[11pt]">
        <p>
          <span className="font-bold">CONGREGAÇÃO:</span> {modelo.congregacaoLinha}
        </p>
        <p>
          <span className="font-bold">APRESENTAMOS:</span> {modelo.apresentamos}
        </p>
        <p>
          <span className="font-bold">{modelo.irmaoRotulo}:</span> {modelo.nomeMembro}
        </p>
        <p>
          <span className="font-bold">Cargo(s):</span> {modelo.cargos}
        </p>
      </div>

      <p className="mt-8 text-justify">{modelo.corpo}</p>

      <p className="mt-6">{modelo.salmoLinha}</p>

      <p className="mt-8 font-bold tracking-wide">{modelo.validadeLinha}</p>

      <p className="mt-10">{modelo.localData}</p>

      <div className="mt-10">
        <p className="font-bold">OBSERVAÇÕES:</p>
        <div className="mt-2 min-h-[8mm] border-b border-black">
          {modelo.observacoes && <p className="pb-1">{modelo.observacoes}</p>}
        </div>
      </div>

      <div className="mt-16 space-y-14">
        <div>
          <div className="mb-1 w-[70mm] border-b border-black" />
          <p>{modelo.secretarioCargo}</p>
        </div>
        <div>
          <div className="mb-1 w-[70mm] border-b border-black" />
          <p>{modelo.pastorCargo}</p>
        </div>
      </div>
    </div>
  );
}
