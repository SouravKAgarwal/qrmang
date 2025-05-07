"use client";

import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Download, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { TicketType } from "@/types";
import PamphletQr from "./pamphlet-qr";
import { generateBase64Image } from "@/lib/utils";
import { uploadImageUrl } from "@/lib";
import { toast } from "@/hooks/use-toast";

interface EventPamphletProps {
  formData: any;
  onBack: () => void;
  onPublish: (e: React.FormEvent) => void;
  onDraft: (e: React.FormEvent) => void;
  setPamphletUrl: (url: string) => void;
}

export default function EventPamphlet({
  formData,
  onBack,
  onPublish,
  onDraft,
  setPamphletUrl,
}: EventPamphletProps) {
  const pamphletRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const url = await generateBase64Image(pamphletRef);
      const res = await uploadImageUrl(url);
      if (res) {
        setPamphletUrl(res);
        const link = document.createElement("a");
        link.download = `${formData.title}.png`;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
        toast({
          title: "Success",
          description: "Pamphlet downloaded successfully!",
        });
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error downloading pamphlet:", error);
      toast({
        title: "Error",
        description: "Failed to download pamphlet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div
        ref={pamphletRef}
        className="relative mx-auto w-full overflow-hidden rounded-lg p-6"
        style={{
          maxWidth: "600px",
          aspectRatio: "1/1.414",
          backgroundImage: formData.eventImageUrl
            ? `url(${formData.eventImageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 space-y-6">
          <div className="space-y-3 text-center">
            <h1 className="text-2xl font-extrabold capitalize text-white drop-shadow-md sm:text-3xl md:text-4xl">
              {formData.title}
            </h1>
            <p className="text-sm text-gray-300 sm:text-base">
              {formData.category} • {formData.eventType}
            </p>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-lg">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Ticket Details
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {formData.ticketTypes?.map(
                (ticket: TicketType, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm text-gray-300 sm:text-base"
                  >
                    <span className="font-medium">{ticket.name}</span>
                    <span className="font-semibold">₹{ticket.price}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-lg">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Contact Us
            </h2>
            <ul className="flex flex-col justify-center py-2 text-sm text-gray-300 sm:text-base">
              <li className="mb-2 flex items-center gap-2">
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="-mt-3">{formData.organizerName}</span>
              </li>
              <li className="my-2 flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="-mt-3">{formData.organizerPhone}</span>
              </li>
              <li className="my-2 flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="-mt-3">{formData.organizerEmail}</span>
              </li>
              <li className="my-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="-mt-3">
                  {formData.venue}, {formData.city}, {formData.state},{" "}
                  {formData.country}, {formData.zipCode}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2">
            <PamphletQr eventId={formData.id} />
            <span className="text-sm text-gray-300">Scan to Book Tickets</span>
          </div>

          {/* Footer */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Get Your Tickets Now!
            </h2>
            <p className="mt-2 text-sm text-gray-300 sm:text-base">
              Don’t miss out on this unforgettable event!
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            size="icon"
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
          </Button>
          <Button type="submit" onClick={onDraft}>
            Save as Draft
          </Button>
          <Button type="submit" onClick={onPublish}>
            Publish
          </Button>
        </div>
      </div>
    </>
  );
}
