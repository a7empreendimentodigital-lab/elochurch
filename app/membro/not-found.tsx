import Image from "next/image";
import Link from "next/link";

export default function MembroNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <Image
        src="/brand/logomarca-horizontal.webp"
        alt="EloChurch"
        width={240}
        height={60}
        className="mb-8 h-10 w-auto object-contain opacity-90"
      />
      <h1 className="text-xl font-bold text-white">Membro não encontrado</h1>
      <p className="mt-3 max-w-sm text-sm text-white/55">
        O código ou link do QR não corresponde a um membro cadastrado. Verifique
        se a carteirinha está atualizada ou fale com a secretaria da igreja.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-[#D4A537]/40 bg-[#D4A537]/10 px-5 py-2.5 text-sm font-medium text-[#D4A537] transition-colors hover:bg-[#D4A537]/20"
      >
        Ir para o início
      </Link>
    </main>
  );
}
