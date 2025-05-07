import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { getUserEvents } from "@/resources/event-queries";
import { auth } from "@/auth";
import { formatDateTime } from "@/lib/utils";

export default async function YourEventsPage() {
  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) return null;

  const events = await getUserEvents(userId);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Events</h1>
        <Button asChild>
          <Link href="/events/create">Create New Event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            You haven't created any events yet.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/events/create">Create Your First Event</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl md:flex-row"
            >
              <div className="md:w-1/3">
                <img
                  src={event.eventImageUrl}
                  alt={event.title}
                  className="h-64 w-full object-cover md:h-full"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {event.category} • {event.eventType}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDateTime(event.eventStart).date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{`${event.venue}, ${event.city}, ${event.state}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDateTime(event.eventStart).time}
                      </span>
                    </div>
                    <Badge
                      variant={event.publishedAt ? "default" : "secondary"}
                      className="mt-2"
                    >
                      {event.publishedAt ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4">
                  <Button variant="outline" asChild>
                    <Link href={`/events/${event.id}`}>View</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/events/${event.id}/edit`}>Edit</Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
