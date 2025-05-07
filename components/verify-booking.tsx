"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { verifyBookingAction } from "@/actions/verify-booking-action";
import { HiX } from "react-icons/hi";

type BookingData = Awaited<ReturnType<typeof verifyBookingAction>>["data"];

export function VerifyBooking({
  bookingReference,
}: {
  bookingReference?: string;
}) {
  const router = useRouter();
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    data?: BookingData;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!bookingReference) return;

    const verify = async () => {
      const result = await verifyBookingAction(bookingReference);
      setVerificationResult(result);
    };

    verify();
  }, [bookingReference]);

  const handleReset = () => {
    setVerificationResult(null);
    router.push("/dashboard");
  };

  const booking = verificationResult?.data?.booking;
  const event = verificationResult?.data?.event;
  const tickets = verificationResult?.data?.tickets;

  if (!bookingReference) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Booking Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex animate-pulse items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-lg font-semibold">
              Booking Reference unavailable
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!verificationResult) return null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Booking Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationResult.success && event && booking && tickets ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex animate-bounce items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-lg font-semibold">
                    Booking Verified
                  </span>
                </div>
                {/* <span className="text-sm font-medium">
                  Verified on:{"  "}
                  {new Date(tickets?.verifiedAt as Date).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                    },
                  )}
                  ,{" "}
                  {new Date(tickets?.verifiedAt as Date).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span> */}
              </div>

              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm">
                  Reference: {booking.bookingReference}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Tickets</h4>
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium">
                      {tickets.ticketType[0].name}
                    </span>
                    <Badge
                      variant={
                        tickets.status === "active" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {tickets.status}
                    </Badge>
                  </div>
                  <div className="grid space-y-3">
                    {booking.attendees.map((attendee, index) => (
                      <div key={index} className="rounded-md border p-3">
                        <p className="font-medium">
                          Attendee {index + 1}: {attendee.name}
                        </p>
                        <p className="text-sm font-medium">
                          {attendee.aadharNumber}
                        </p>
                        <p className="text-sm">
                          {attendee.gender}, {attendee.age} years
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div className="space-y-1 border-t pt-4 text-sm">
                <p>
                  Booked on:{"  "}
                  {new Date(booking.bookedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                  ,{" "}
                  {new Date(booking.bookedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>Total Tickets: {booking.ticketInfo.totalTickets}</p>
              </div> */}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex animate-pulse items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  {verificationResult.error}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleReset} variant="outline">
          <ArrowLeft />
          Reset
        </Button>
      </div>
    </div>
  );
}
