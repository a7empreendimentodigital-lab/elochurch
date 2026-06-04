import Image from "next/image";
import { generateQrDataUrl } from "@/lib/qr-code";

interface CarteirinhaQrProps {
  url: string;
  size?: number;
  alt?: string;
  className?: string;
}

/** QR Code gerado automaticamente no servidor */
export async function CarteirinhaQr({
  url,
  size = 160,
  alt = "QR Code da carteirinha",
  className,
}: CarteirinhaQrProps) {
  const dataUrl = await generateQrDataUrl(url, size);

  return (
    <Image
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
