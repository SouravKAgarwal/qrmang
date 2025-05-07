import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Ticket,
  ArrowRight,
  AlertCircle,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getBookings } from "@/resources/booking-queries";
import { formatDateTime } from "@/lib/utils";
import { type Metadata } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const metadata: Metadata = {
  title: "Your Bookings",
};

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/");

  let userBookings = await getBookings(userId);

  const currentFilter = (await searchParams).filter || "all";
  if (currentFilter === "upcoming") {
    userBookings = userBookings.filter(
      (b) => new Date(b.eventData?.eventStart as string) > new Date(),
    );
  } else if (currentFilter === "past") {
    userBookings = userBookings.filter(
      (b) => new Date(b.eventData?.eventStart as string) <= new Date(),
    );
  } else if (currentFilter === "confirmed") {
    userBookings = userBookings.filter((b) => b.paymentStatus === "completed");
  } else if (currentFilter === "failed") {
    userBookings = userBookings.filter((b) => b.paymentStatus !== "completed");
  }

  const currentSort = (await searchParams).sort || "date-asc";
  userBookings.sort((a, b) => {
    const dateA = new Date(a.eventData?.eventStart as string);
    const dateB = new Date(b.eventData?.eventStart as string);

    switch (currentSort) {
      case "date-asc":
        return dateA.getTime() - dateB.getTime();
      case "date-desc":
        return dateB.getTime() - dateA.getTime();
      case "price-asc":
        return a.ticketInfo.totalAmount - b.ticketInfo.totalAmount;
      case "price-desc":
        return b.ticketInfo.totalAmount - a.ticketInfo.totalAmount;
      default:
        return 0;
    }
  });

  const filterOptions = [
    { value: "all", label: "All Bookings" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past Events" },
    { value: "confirmed", label: "Confirmed" },
    { value: "failed", label: "Payment Failed" },
  ];

  const sortOptions = [
    { value: "date-asc", label: "Date (Oldest first)" },
    { value: "date-desc", label: "Date (Newest first)" },
    { value: "price-asc", label: "Price (Low to high)" },
    { value: "price-desc", label: "Price (High to low)" },
  ];

  return (
    <div className="w-full max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          My Bookings
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your upcoming and past event bookings
        </p>
      </div>

      {userBookings.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 h-24 w-24 text-gray-400">
            <Ticket className="h-full w-full" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">No bookings yet</h3>
          <p className="mx-auto mt-2 max-w-md text-gray-600">
            You haven't booked any events yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {currentFilter === "all"
                  ? "All Bookings"
                  : filterOptions.find((f) => f.value === currentFilter)?.label}
              </h2>
              <p className="text-sm text-gray-500">
                {userBookings.length}{" "}
                {userBookings.length === 1 ? "booking" : "bookings"}
              </p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup value={currentFilter}>
                    {filterOptions.map((option) => (
                      <Link
                        key={option.value}
                        href={`?filter=${option.value}&sort=${currentSort}`}
                        className="block w-full"
                      >
                        <DropdownMenuRadioItem value={option.value}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      </Link>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup value={currentSort}>
                    {sortOptions.map((option) => (
                      <Link
                        key={option.value}
                        href={`?filter=${currentFilter}&sort=${option.value}`}
                        className="block w-full"
                      >
                        <DropdownMenuRadioItem value={option.value}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      </Link>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userBookings.map((booking) => {
              const isUpcoming =
                new Date(booking.eventData?.eventStart as string) > new Date();
              const isCompleted = booking.paymentStatus === "completed";

              return (
                <Card
                  key={booking.id}
                  className={`transition-shadow hover:shadow-md ${!isUpcoming ? "opacity-80" : ""}`}
                >
                  <Link
                    href={
                      isCompleted
                        ? `/events/booking/success?session_id=${booking.stripeSessionId}`
                        : `/events/booking/cancel?session_id=${booking.stripeSessionId}`
                    }
                    className="block"
                  >
                    <div className="relative h-48">
                      <Image
                        src={
                          booking.eventData?.eventImageUrl ||
                          "/placeholder-event.jpg"
                        }
                        alt={booking.eventData?.title || "Event image"}
                        className="h-full w-full rounded-t-lg object-cover"
                        width={400}
                        height={300}
                        priority
                      />
                      {!isUpcoming && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="rounded-full bg-black/50 px-3 py-1 font-medium text-white">
                            Event Passed
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="line-clamp-1 text-lg font-bold">
                            {booking.eventData?.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {booking.eventData?.venue},{" "}
                            {booking.eventData?.city}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={isCompleted ? "default" : "destructive"}
                          className="ml-2"
                        >
                          {isCompleted ? "Confirmed" : "Payment Failed"}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {
                              formatDateTime(
                                booking.eventData?.eventStart as string,
                              ).date
                            }
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {
                              formatDateTime(
                                booking.eventData?.eventStart as string,
                              ).time
                            }
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Ticket className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {booking.ticketInfo.totalTickets} ×{" "}
                            {booking.ticketInfo.ticketType}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-lg font-bold">
                          ₹{booking.ticketInfo.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>

          {userBookings.some((b) => b.paymentStatus !== "completed") && (
            <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Payment issues detected
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Some of your bookings have payment issues. Please complete
                      the payment to confirm your tickets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
