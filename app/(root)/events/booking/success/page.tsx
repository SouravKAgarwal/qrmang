import { tickets } from "@/drizzle/schema";
import { notFound, redirect } from "next/navigation";
import db from "@/drizzle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { getEvent } from "@/resources/event-queries";
import { getBooking, getTicket } from "@/resources/booking-queries";
import { type Metadata } from "next";
import { sendBookingConfirmAction } from "@/actions/booking-confirmation-action";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import TicketPass from "@/components/ticket-pass";

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

  if (!session_id) return notFound();

  const booking = await getBooking(session_id);
  if (!booking) return notFound();
  if (session?.user?.id !== booking.userId) redirect("/");

  let ticket = await getTicket(booking.id);
  const event = await getEvent(booking.eventId);
  const { date, time } = formatDateTime(event.eventStart);

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
    <div className="mx-auto max-w-4xl px-4">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-green-100 bg-green-50">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
          Your booking is confirmed!
        </h1>
        <Badge variant="outline" className="px-4 py-1.5 text-base">
          {booking.bookingReference}
        </Badge>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Your tickets have been sent to your email. You can also access them
          below.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TicketPass event={event} booking={booking} />

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {date} at {time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {event.venue}, {event.city}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticket Type</span>
                <span className="text-right font-medium">
                  {booking.ticketInfo.ticketType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">
                  {booking.ticketInfo.totalTickets}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="text-lg font-bold text-primary">
                  ₹{booking.ticketInfo.totalAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-blue-50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium">Save your tickets</p>
                  <p className="text-sm text-muted-foreground">
                    Download or screenshot your tickets for easy access
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium">Check your email</p>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation to your email.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium">Prepare for the event</p>
                  <p className="text-sm text-muted-foreground">
                    Arrive 30 minutes early for smooth check-in
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
