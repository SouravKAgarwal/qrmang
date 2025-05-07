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
import { ArrowLeft } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@/auth";
import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  const { date, time } = formatDateTime(
    event.eventStart,
    event.eventEnd! && event.eventEnd,
  );

  if (!event || event.publishedAt === null) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-rose-400">Event Not Found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This event is not found.
        </p>
      </div>
    );
  }

  if (date < new Date().toLocaleDateString()) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-rose-400">Event ended</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This event has already ended.
        </p>
      </div>
    );
  }

  if (session?.user?.role === "business") {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-rose-400">Business Account</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          You cannot book tickets with a business account.
        </p>
      </div>
    );
  }

  return (
    <div className="container -mt-10">
      <div className="sticky top-14 z-10 w-full border-b bg-background">
        <div className="flex w-full flex-col items-center justify-center gap-4 py-4 md:flex-row">
          <div>
            <h1 className="line-clamp-1 font-semibold tracking-tighter">
              {event.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span>
                  {date}, {time}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center">
                <span>{event.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid max-w-4xl grid-cols-1 gap-8 py-8 lg:grid-cols-2">
        <div className="lg:col-span-2">
          {session?.user?.id ? (
            <TicketBookingForm
              eventId={id}
              userId={session.user.id}
              ticketTypes={event.ticketTypes}
              maxTickets={5}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sign in to book tickets</CardTitle>
                <CardDescription>
                  You need to be signed in to purchase tickets for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
