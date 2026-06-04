import Image from "next/image";
import { CarteirinhaQr } from "@/components/carteirinha/carteirinha-qr";
import { cn } from "@/lib/utils";

interface MemberCardQrBlockProps {
  url: string;
  size?: number;
  className?: string;
}

/** QR grande com logo central (verso da carteirinha) */
export async function MemberCardQrBlock({
  url,
  size = 168,
  className,
}: MemberCardQrBlockProps) {
  const logoSize = Math.round(size * 0.22);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-md",
        className
      )}
    >
      <CarteirinhaQr url={url} size={size} className="rounded-md" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-md bg-white p-1 shadow-sm">
          <Image
            src="/brand/icone.png"
            alt=""
            width={logoSize}
            height={logoSize}
            className="object-contain"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
