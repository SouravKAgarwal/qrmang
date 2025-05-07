"use client";

import QRCodeStyling from "qr-code-styling";
import { useEffect, useState } from "react";

const PamphletQr = ({ eventId }: { eventId: string }) => {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 300,
      height: 300,
      margin: 8,
      data: "",
      qrOptions: {
        errorCorrectionLevel: "H",
      },
      dotsOptions: {
        type: "dots",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
      cornersDotOptions: {
        type: "dot",
      },
      imageOptions: { crossOrigin: "anonymous", margin: 10 },
    });

    setQrCode(qr);
  }, []);

  useEffect(() => {
    if (qrCode) {
      qrCode.update({
        data: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`,
      });
    }
  }, [qrCode]);

  useEffect(() => {
    if (qrCode) {
      qrCode.getRawData("svg").then((data: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setQrCodeUrl(base64String);
        };
        reader.readAsDataURL(data);
      });
    }
  }, [qrCode]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative" onContextMenu={(e) => e.preventDefault()}>
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-white p-1.5 shadow-lg"
            draggable="false"
          />
        )}
      </div>
    </div>
  );
};

export default PamphletQr;
