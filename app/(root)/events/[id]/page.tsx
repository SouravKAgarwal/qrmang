import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { getEvent, getEvents } from "@/resources/event-queries";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Tag,
  Ticket,
  User,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

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

  if (!event || event.publishedAt === null) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This event is not found.
        </p>
      </div>
    );
  }

  if (
    !!event.eventEnd
      ? new Date(event.eventEnd).toDateString() > new Date().toDateString()
      : event.eventStart &&
        new Date(event.eventStart).toDateString() < new Date().toDateString()
  ) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Event ended</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This event has already ended.
        </p>
      </div>
    );
  }

  const { date, time } = formatDateTime(
    event.eventStart,
    event.eventEnd! && event.eventEnd,
  );

  return (
    <div className="container grid grid-cols-1 gap-8 py-8 lg:grid-cols-3">
      <div className="flex flex-col lg:col-span-2">
        <div className="mb-8 aspect-video overflow-hidden rounded-lg">
          {event.eventImageUrl ? (
            <img
              src={event.eventImageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-muted-foreground">
              No thumbnail available
            </div>
          )}
        </div>

        <h1 className="mb-6 text-4xl font-bold">{event.title}</h1>

        <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{date}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">{time}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <Tag className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm capitalize text-muted-foreground">
                  {event.category}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Organizer</p>
                <p className="text-sm text-muted-foreground">
                  {event.organizerName}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 lg:hidden">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="font-medium text-muted-foreground">Starts from</p>
                <p className="mb-2 text-3xl font-bold">
                  {event.ticketTypes[0]?.price !== undefined
                    ? `₹${event.ticketTypes[0].price}`
                    : "Price not available"}
                </p>
              </div>
              <Button asChild className="mb-4 w-full">
                <Link href={`/events/booking/${event.id}`}>
                  <Ticket className="mr-2 h-4 w-4" aria-hidden="true" />
                  Book Tickets
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                // onClick={handleShare}
                aria-label="Share this event"
              >
                <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Share Event
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="w-full max-w-none">
          <h2 className="mb-4 text-2xl font-semibold">About this event</h2>
          <p className="text-muted-foreground">
            {event.description || "No description provided."}
          </p>
        </div>

        <div className="mt-8 max-w-none">
          <h2 className="mb-4 text-2xl font-semibold">Venue</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col items-start space-y-1.5">
                  <p className="text-lg font-semibold">{event.venue}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.address}, {event.city}, {event.state} {event.zipCode}
                    , {event.country}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="self-start font-semibold"
                >
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      event.venue +
                        ", " +
                        event.address +
                        ", " +
                        event.city +
                        ", " +
                        event.state +
                        " " +
                        event.zipCode +
                        ", " +
                        event.country,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to ${event.venue}`}
                  >
                    <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                    Get Directions
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block">
        <Card className="sticky top-16">
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="font-medium text-muted-foreground">Starts from</p>
              <p className="mb-2 text-3xl font-bold">
                {event.ticketTypes[0]?.price !== undefined
                  ? `₹${event.ticketTypes[0].price}`
                  : "Price not available"}
              </p>
            </div>
            <Button asChild className="mb-4 w-full">
              <Link href={`/events/booking/${event.id}`}>
                <Ticket className="mr-2 h-4 w-4" aria-hidden="true" />
                Book Tickets
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              // onClick={handleShare}
              aria-label="Share this event"
            >
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Share Event
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({
    id: event.id,
  }));
}
