import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils";
import { getEvent, getEvents } from "@/resources/event-queries";
import {
  BookMarkedIcon,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const events = await getEvents();
  return events.map((event) => ({
    id: event.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${id}`,
      type: "website",
      images: [
        {
          url: event.eventImageUrl,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [event.eventImageUrl, event.pamphletUrl],
    },
    category: "events",
  };
}

export default async function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const event = await getEvent(id);

  const { date, time } = formatDateTime(
    event.eventStart,
    event.eventEnd! && event.eventEnd,
  );

  if (!event || event.publishedAt === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Event Not Found</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This event is not found.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (date < new Date().toLocaleDateString()) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Event Ended</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This event has already ended.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/events">Browse Upcoming Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-20 md:py-0">
      <div className="container mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 overflow-hidden rounded-xl shadow-md">
              <div className="aspect-video w-full">
                <Image
                  src={event.eventImageUrl}
                  alt={event.title}
                  width={1200}
                  height={630}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="mb-4 block lg:hidden">
              <Card className="overflow-hidden border-0 shadow-none">
                <CardContent className="px-2">
                  <div className="space-y-4">
                    <h1 className="text-xl font-bold text-gray-900">
                      {event.title}
                    </h1>

                    <div className="grid gap-3">
                      <div className="flex items-start">
                        <BookMarkedIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/80" />
                        <span className="ml-2 text-sm font-medium capitalize text-gray-600">
                          {event.category}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/80" />
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          {date} <span className="mx-1">|</span> {time}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/80" />
                        <span className="ml-2 line-clamp-2 text-sm font-medium text-gray-600">
                          {event.venue}, {event.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">About the Event</h2>
              <div className="prose max-w-none text-muted-foreground">
                {event.description || "No description provided."}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">Venue Details</h2>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">{event.venue}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.address}, {event.city}, {event.state}{" "}
                        {event.zipCode}, {event.country}
                      </p>
                    </div>
                    <Button
                      className="bg-black capitalize text-white hover:bg-black/90 hover:text-white/90"
                      asChild
                    >
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          `${event.venue}, ${event.address}, ${event.city}, ${event.state} ${event.zipCode}, ${event.country}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Directions
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="hidden lg:block">
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h1 className="text-xl font-bold text-gray-900">
                    {event.title}
                  </h1>

                  <div className="grid gap-3">
                    <div className="flex items-start">
                      <BookMarkedIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/80" />
                      <span className="ml-2 text-sm font-medium capitalize text-gray-600">
                        {event.category}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/80" />
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {date} <span className="mx-1">|</span> {time}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/80" />
                      <span className="ml-2 line-clamp-2 text-sm font-medium text-gray-600">
                        {event.venue}, {event.city}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <Separator className="bg-gray-200" />

              <CardFooter className="bg-white p-4">
                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Starts from
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {event.ticketTypes[0]?.price !== undefined ? (
                        `₹${event.ticketTypes[0].price}`
                      ) : (
                        <span className="text-gray-400">Free</span>
                      )}
                    </p>
                  </div>

                  <Button
                    className="bg-black text-white hover:bg-black/90 hover:text-white/90"
                    asChild
                  >
                    <Link href={`/events/booking/${event.id}`}>
                      <span className="font-medium">Book Now</span>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 block bg-white p-4 shadow-lg lg:hidden">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Starts from
            </p>
            <p className="text-lg font-bold">
              {event.ticketTypes[0]?.price !== undefined
                ? `₹${event.ticketTypes[0].price}`
                : "Free"}
            </p>
          </div>
          <Button
            className="bg-black text-white hover:bg-black/90 hover:text-white/90"
            asChild
          >
            <Link href={`/events/booking/${event.id}`}>
              <span className="font-medium">Book Now</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
