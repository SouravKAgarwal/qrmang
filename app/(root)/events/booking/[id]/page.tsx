import { TicketBookingForm } from "@/components/booking-form";
import { getEvent, getEvents } from "@/resources/event-queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@/auth";
import { type Metadata } from "next";

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
    title: "Booking - " + event.title,
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
  };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({
    id: event.id,
  }));
}

export default async function BookTicketsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
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
    !!event.eventEnd &&
    new Date(event.eventEnd).toDateString() > new Date().toDateString()
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
    <div className="container mx-auto max-w-6xl">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">{event?.title}</h1>

      <Card className="mb-12">
        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-muted p-3">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-muted p-3">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{time}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-muted p-3">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">
                {event.venue}, {event.city}
              </p>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardDescription className="px-6 py-4 text-center">
          Limited tickets available—book now to secure your spot
        </CardDescription>
      </Card>

      {session?.user?.id ? (
        <TicketBookingForm
          eventId={id}
          userId={session.user.id}
          ticketTypes={event.ticketTypes}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sign in to book tickets</CardTitle>
            <CardDescription>
              You need to be signed in to purchase tickets for this event
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
