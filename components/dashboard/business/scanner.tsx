"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiCopy, FiRefreshCw, FiExternalLink, FiCamera } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";

const deobfuscate = (data: string): string => {
  return atob(data).split("").reverse().join("");
};

const decryptData = async (encryptedData: string): Promise<string | null> => {
  try {
    const secretKey = process.env.NEXT_PUBLIC_QR_SECRET_KEY;
    if (!secretKey) throw new Error("Missing encryption key");

    const [ivHex, cipherText] = encryptedData.split(":");
    const iv = new Uint8Array(
      ivHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
    );

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secretKey),
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      keyMaterial,
      Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0)),
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanningTimeout, setScanningTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
  }, []);

  const handleScannedData = async (encryptedData: string) => {
    try {
      const deobfuscated = deobfuscate(encryptedData);

      const decrypted = await decryptData(deobfuscated);
      if (!decrypted) throw new Error("Invalid QR code");

      const [type, payload] = decrypted.split(":");

      if (type === "verify") {
        router.push(`/events/booking/verify?bookingReference=${payload}`);
      } else {
        throw new Error("Unknown QR type");
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "This QR code cannot be read by this scanner",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    let refreshTimeout: NodeJS.Timeout | null = null;

    const tick = () => {
      if (!isScanning || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleScannedData(code.data);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const initCamera = async () => {
      try {
        setIsScanning(true);
        setCameraError(null);

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              ?.play()
              .then(() => {
                animationFrameId = requestAnimationFrame(tick);
                refreshTimeout = setInterval(() => {
                  if (isScanning && videoRef.current && canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                    tick();
                  }
                }, 2000);
              })
              .catch((err) => {
                console.error("Video play failed:", err);
                setCameraError("Could not start camera stream");
              });
          };
        }
      } catch (error) {
        console.error("Camera error:", error);
        setCameraError("Could not access camera. Please check permissions.");
        setIsScanning(false);
      }
    };

    initCamera();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (refreshTimeout) {
        clearInterval(refreshTimeout);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanning]);

  const resumeScanning = () => {
    setIsScanning(true);
    if (scanningTimeout) {
      clearTimeout(scanningTimeout);
      setScanningTimeout(null);
    }
    setScanResult(null);
  };

  const copyToClipboard = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      toast({
        title: "Copied to clipboard!",
        description: scanResult,
      });
    }
  };

  return (
    <div className="mx-auto flex items-center justify-center min-h-[80svh] max-w-sm flex-col gap-4">
      <Card className="w-full">
        <CardContent className="p-0">
          {cameraError && (
            <Alert variant="destructive">
              <AlertTitle>Camera Error</AlertTitle>
              <AlertDescription>
                {cameraError}
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  <FiRefreshCw className="mr-2" /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="relative overflow-hidden rounded-lg border">
            <video
              ref={videoRef}
              className={`aspect-square h-full w-full object-cover ${isScanning ? "block" : "hidden"}`}
              onContextMenu={(e) => e.preventDefault()}
              muted
              playsInline
            />

            {!isScanning && scanResult && (
              <div className="bg-background p-4">
                <Label className="text-sm font-medium">Scan Result</Label>
                <Input
                  value={scanResult}
                  readOnly
                  className="font-mono mb-3 mt-1"
                />
                <div className="flex gap-2">
                  <Button onClick={resumeScanning} variant="outline">
                    <FiCamera className="mr-2" /> Scan Again
                  </Button>
                  {scanResult.startsWith("http") && (
                    <Button
                      onClick={() => window.open(scanResult, "_blank")}
                      variant="secondary"
                    >
                      <FiExternalLink className="mr-2" /> Open Link
                    </Button>
                  )}
                  <Button onClick={copyToClipboard} variant="ghost">
                    <FiCopy className="mr-2" /> Copy
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            {!isScanning && (
              <Button onClick={resumeScanning}>
                <FiRefreshCw className="mr-2" /> Resume Scanning
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
