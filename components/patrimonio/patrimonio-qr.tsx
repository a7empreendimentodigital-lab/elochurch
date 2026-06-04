import Image from "next/image";
import { generateQrDataUrl } from "@/lib/qr-code";

interface PatrimonioQrProps {
  url: string;
  size?: number;
  alt?: string;
  className?: string;
}

export async function PatrimonioQr({
  url,
  size = 180,
  alt = "QR Code do patrimônio",
  className,
}: PatrimonioQrProps) {
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
