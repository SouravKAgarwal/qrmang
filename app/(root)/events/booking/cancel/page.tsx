import { sendBookingConfirmAction } from "@/actions/booking-confirmation-action";
import { auth } from "@/auth";
import TicketPass from "@/components/ticket-pass";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBooking } from "@/resources/booking-queries";
import { getEvent } from "@/resources/event-queries";
import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HiX, HiArrowLeft, HiOutlineSupport } from "react-icons/hi";

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
    <div className="mx-auto max-w-4xl px-4">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" className="mr-4">
          <HiArrowLeft className="mr-2" />
          Back to Events
        </Button>
      </div>

      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <HiX className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
          Payment Failed
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          We couldn't process your payment for the booking. Please try again or
          contact support if the issue persists.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Reference: {booking.bookingReference}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-red-100 bg-red-50">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">
              What to do next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5 h-6 w-6 flex-shrink-0 text-red-600">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Retry Payment</h3>
                <p className="mt-1 text-gray-600">
                  You can attempt the payment again by clicking the button
                  below.
                </p>
                <Button className="mt-3">Retry Payment</Button>
              </div>
            </div>

            <Separator className="bg-red-200" />

            <div className="flex items-start">
              <div className="mr-3 mt-0.5 h-6 w-6 flex-shrink-0 text-red-600">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Contact Support</h3>
                <p className="mt-1 text-gray-600">
                  If you're facing persistent issues, our support team is
                  available 24/7.
                </p>
                <Button variant="outline" className="mt-3">
                  <HiOutlineSupport className="mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {event?.title}
                    <div className="mt-1 text-sm text-gray-500">
                      {new Date(event?.eventStart).toLocaleDateString()} •{" "}
                      {event?.venue}
                    </div>
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Type</span>
                  <span className="font-medium">
                    {booking.ticketInfo.ticketType}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">
                    {booking.ticketInfo.totalTickets}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-bold text-primary">
                    ₹{booking.ticketInfo.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
