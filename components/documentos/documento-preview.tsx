import type { DocumentoContext, DocumentoRenderizado } from "@/types/documentos";

interface DocumentoPreviewProps {
  ctx: DocumentoContext;
  rendered: DocumentoRenderizado;
}

export function DocumentoPreview({ ctx, rendered }: DocumentoPreviewProps) {
  return (
    <div
      id="documento-preview"
      className="mx-auto max-w-[210mm] rounded-lg border border-border bg-white p-8 text-[#1e1e1e] shadow-sm print:shadow-none"
    >
      <header className="border-b-2 border-[#0B2D5C] pb-4 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[#D4A537]">
          {ctx.igreja.nome}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {ctx.igreja.cidade}/{ctx.igreja.estado}
          {ctx.igreja.telefone ? ` · ${ctx.igreja.telefone}` : ""}
        </p>
      </header>

      <h1 className="mt-8 text-center text-lg font-bold uppercase tracking-wide text-[#0B2D5C]">
        {rendered.titulo}
      </h1>
      {rendered.subtitulo && (
        <p className="mt-2 text-center text-sm text-muted-foreground">{rendered.subtitulo}</p>
      )}

      <div className="mt-8 space-y-4 text-justify text-sm leading-relaxed">
        {rendered.paragrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        <p className="text-sm">{rendered.localData}</p>
        <div className="text-center">
          <div className="mx-auto mb-2 w-56 border-t border-[#1e1e1e]" />
          <p className="font-semibold">{rendered.assinaturaNome}</p>
          <p className="text-sm text-muted-foreground">{rendered.assinaturaCargo}</p>
        </div>
      </div>

      <footer className="mt-10 border-t border-border pt-3 text-center text-[10px] text-muted-foreground">
        {ctx.membro.nomeCompleto} · {ctx.membro.codigo}
      </footer>
    </div>
  );
}
