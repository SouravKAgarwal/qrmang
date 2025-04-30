"use client";

import { Button } from "@/components/ui/button";
import { bookings } from "@/drizzle/schema";
import TicketQr from "./ticket-qr";
import { useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { formatDateTime, generateImage } from "@/lib/utils";
import type { Event } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TicketPassProps {
  event: Event;
  booking: typeof bookings.$inferSelect;
}

export default function TicketPass({ event, booking }: TicketPassProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    try {
      const blob = await generateImage(canvasRef);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `${booking.bookingReference}.png`;
      link.href = url;
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Failed to download ticket. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const blob = await generateImage(canvasRef);

      if (navigator.share) {
        await navigator.share({
          title: `Ticket for ${event.title}`,
          text: `Check out my ticket for ${event.title} at ${event.venue}`,
          files: [new File([blob], "ticket.png", { type: "image/png" })],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${booking.bookingReference}.png`;
        link.click();
        alert("Ticket downloaded. You can now share it from your gallery.");
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Sharing failed:", error);
        alert("Couldn't share ticket. You can download and share it manually.");
      }
    }
  };

  const { date, time } = formatDateTime(event.eventStart);

  return (
    <Card className="border-0 p-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 p-0">
        <CardTitle className="text-lg font-bold">Your Ticket</CardTitle>
        <div className="no-export flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-9 w-9 rounded-full p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-9 w-9 rounded-full p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div
          ref={canvasRef}
          className="w-full max-w-lg rounded-sm border  border-gray-200 bg-white text-gray-900"
        >
          <div className="flex flex-row items-start p-4">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[80px] w-[160px]">
                <img
                  src={event.eventImageUrl}
                  alt={event.title}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
              <div className="mt-1 space-y-1">
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  {event.venue}, {event.city}
                </p>
                <p className="text-sm text-gray-600">
                  {date} | {time}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="px-4 py-3">
            <span className="mb-3 inline-block rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs">
              {booking.ticketInfo.totalTickets} Ticket(s) -{" "}
              {booking.ticketInfo.ticketType}
            </span>

            <div className="space-y-3">
              {booking.attendees.map((attendee, index) => (
                <div
                  key={index}
                  className="rounded-md border border-gray-200 px-4 py-3"
                >
                  <p className="font-medium">
                    Attendee {index + 1}: {attendee.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {attendee.gender}, {attendee.age} years
                  </p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium">
                BOOKING ID: {booking.bookingReference}
              </p>
              <button className="h-auto p-0 text-sm text-blue-600 hover:underline">
                Show QR at entrance
              </button>
            </div>
            <TicketQr bookingReference={booking.bookingReference} />
          </div>
          <hr className="border-gray-200" />

          <div className="px-4 py-3">
            <p className="text-xs text-gray-600">
              A confirmation has been sent to {booking.bookingEmail} and{" "}
              {booking.bookingPhone}
            </p>
          </div>

          <div className="border border-dashed border-gray-300" />

          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold">Total Amount</span>
            <span className="text-sm font-bold">
              Rs.{booking.ticketInfo.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
