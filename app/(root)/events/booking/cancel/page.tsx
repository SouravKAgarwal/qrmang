import { sendBookingConfirmAction } from "@/actions/booking-confirmation-action";
import { auth } from "@/auth";
import TicketPass from "@/components/ticket-pass";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBooking } from "@/resources/booking-queries";
import { getEvent } from "@/resources/event-queries";
import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HiX } from "react-icons/hi";

export const metadata: Metadata = {
  title: "Booking Failed",
};

export default async function Failed({
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

  const event = await getEvent(booking.eventId);

  if (booking.paymentStatus !== "completed" && !booking.emailSent) {
    try {
      await sendBookingConfirmAction(booking.id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-red-100">
          <HiX className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Booking Cancelled!
        </h1>
        <Badge variant="secondary" className="mt-3">
          {booking.bookingReference}
        </Badge>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <TicketPass event={event} booking={booking} />

        <Card className="mt-0 h-fit lg:mt-12">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <span>Total Amount</span>
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
