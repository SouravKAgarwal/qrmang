import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, Clock, User, Ticket } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { getBookings } from "@/resources/booking-queries";
import { formatDateTime } from "@/lib/utils";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Bookings",
};

export default async function BookingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/");

  const userBookings = await getBookings(userId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Your Bookings</h3>
        <p className="text-sm text-muted-foreground">
          This is where you can see all your bookings.
        </p>
      </div>

      <Separator />

      {userBookings.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-light text-gray-600">
            No bookings found. Start your journey by booking an event!
          </p>
          <Button className="mt-4" variant="outline">
            Explore Events
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userBookings.map((booking) => (
            <Link
              key={booking.id}
              href={
                booking.paymentStatus === "completed"
                  ? `/events/booking/success?session_id=${booking.stripeSessionId}`
                  : `/events/booking/cancel?session_id=${booking.stripeSessionId}`
              }
            >
              <Card className="hover:bg-muted/40">
                <div className="relative h-48">
                  <Image
                    src={booking.eventData?.eventImageUrl || ""}
                    alt={booking.eventData?.title || ""}
                    className="h-full w-full rounded-t-md object-cover"
                    width={1000}
                    height={1000}
                  />
                </div>

                <div className="">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">
                      {booking.eventData?.title}
                    </CardTitle>
                    <CardDescription>
                      {booking.eventData?.venue}, {booking.eventData?.city}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {
                            formatDateTime(
                              booking.eventData?.eventStart as string,
                            ).date
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {
                            formatDateTime(
                              booking.eventData?.eventStart as string,
                            ).time
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        <span>
                          {booking.ticketInfo.totalTickets} ×{" "}
                          {booking.ticketInfo.ticketType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{booking.bookingEmail}</span>
                      </div>
                    </div>
                  </CardContent>

                  <Separator />

                  <CardFooter className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold">Total Amount</span>
                    <span className="text-sm font-bold">
                      Rs.{booking.ticketInfo.totalAmount.toFixed(2)}
                    </span>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
