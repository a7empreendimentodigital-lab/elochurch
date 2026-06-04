import QRCode from "qrcode";

export async function generateQrDataUrl(
  url: string,
  size = 200
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#071B38",
      light: "#FFFFFF",
    },
  });
}
