import { CarteirinhaQr } from "@/components/carteirinha/carteirinha-qr";
import { cn } from "@/lib/utils";

interface MemberCardQrBlockProps {
  url: string;
  size?: number;
  className?: string;
}

/** QR de verificação (verso da carteirinha) */
export async function MemberCardQrBlock({
  url,
  size = 168,
  className,
}: MemberCardQrBlockProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-md",
        className
      )}
    >
      <CarteirinhaQr url={url} size={size} className="rounded-md" />
    </div>
  );
}
