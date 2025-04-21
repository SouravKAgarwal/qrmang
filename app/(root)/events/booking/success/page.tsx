import { tickets } from "@/drizzle/schema";
import { notFound, redirect } from "next/navigation";
import db from "@/drizzle";
import TicketPass from "@/components/ticket-pass";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { getEvent } from "@/resources/event-queries";
import { getBooking, getTicket } from "@/resources/booking-queries";
import { type Metadata } from "next";
import { sendBookingConfirmAction } from "@/actions/booking-confirmation-action";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Booking Success",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const session = await auth();

  const session_id = (await searchParams).session_id;
  if (!session_id) {
    return notFound();
  }

  const booking = await getBooking(session_id);

  if (!booking) {
    return notFound();
  }

  if (session?.user?.id !== booking.userId) redirect("/");

  let ticket = await getTicket(booking.id);
  const event = await getEvent(booking.eventId);

  if (!ticket) {
    const ticketPass = `TICKET-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    ticket = await db
      .insert(tickets)
      .values({
        id: crypto.randomUUID(),
        eventId: booking.eventId,
        bookingId: booking.id,
        ticketType: [
          {
            name: booking.ticketInfo.ticketType,
            price:
              booking.ticketInfo.totalAmount / booking.ticketInfo.totalTickets,
            quantity: booking.ticketInfo.totalTickets,
          },
        ],
        amount: booking.ticketInfo.totalAmount.toString(),
        ticketPass,
        status: "active",
        attendees: booking.attendees,
      })
      .returning()
      .then((res) => res[0]);
  }

  if (
    booking.paymentStatus === "completed" &&
    (!booking.emailSent || !booking.whatsappSent)
  ) {
    try {
      await sendBookingConfirmAction(booking.id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Booking Confirmed!
        </h1>
        <Badge variant="secondary" className="mt-3">
          {booking.bookingReference}
        </Badge>
        <p className="mt-2 text-lg">Your tickets are ready. Details below.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <TicketPass event={event} booking={booking} />

        <Card className="mt-0 h-fit lg:mt-12">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 py-3">
            <div className="flex justify-between">
              <span>Ticket Type</span>
              <span className="font-medium">
                {booking.ticketInfo.ticketType}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span className="font-medium">
                {booking.ticketInfo.totalTickets}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Total Paid</span>
              <span className="font-bold text-primary">
                ₹{booking.ticketInfo.totalAmount.toFixed(2)}
              </span>
            </div>
          </CardContent>
          <div className="mt-6 rounded-b-lg bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-700">
              Need help? Contact support at{" "}
              <a
                href="mailto:bloghubofficial@outlook.com"
                className="font-medium"
              >
                bloghubofficial@outlook.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
