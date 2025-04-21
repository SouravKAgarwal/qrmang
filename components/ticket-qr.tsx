"use client";

import QRCodeStyling from "qr-code-styling";
import { useEffect, useState } from "react";

const obfuscate = (data: string): string => {
  return btoa(data.split("").reverse().join(""));
};

const encryptData = async (data: string): Promise<string> => {
  const secretKey = process.env.NEXT_PUBLIC_QR_SECRET_KEY;
  if (!secretKey) throw new Error("Missing encryption key");

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    keyMaterial,
    new TextEncoder().encode(data),
  );

  return `${Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}:${btoa(String.fromCharCode(...new Uint8Array(encrypted)))}`;
};

const TicketQr = ({ bookingReference }: { bookingReference: string }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const generateQr = async () => {
      try {
        const payload = `verify:${bookingReference}`;

        const encrypted = await encryptData(payload);

        const obfuscated = obfuscate(encrypted);

        const qr = new QRCodeStyling({
          width: 300,
          height: 300,
          data: obfuscated,
          margin: 8,
          qrOptions: { errorCorrectionLevel: "H" },
          dotsOptions: { type: "dots" },
          cornersSquareOptions: { type: "extra-rounded" },
          cornersDotOptions: { type: "dot" },
          imageOptions: { crossOrigin: "anonymous" },
        });

        await qr.getRawData("svg").then((data: any) => {
          const reader = new FileReader();
          reader.onload = () => setQrCodeUrl(reader.result as string);
          reader.readAsDataURL(data);
        });
      } catch (error) {
        console.error("QR generation failed:", error);
      }
    };

    generateQr();
  }, [bookingReference]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative" onContextMenu={(e) => e.preventDefault()} >
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-white shadow-lg"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        )}
      </div>
    </div>
  );
};

export default TicketQr;
