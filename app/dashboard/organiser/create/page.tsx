import { auth } from "@/auth";
import EventForm from "@/components/event-form";
import { nanoid } from "nanoid";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
};

export default async function CreateEventPage({
  searchParams,
}: {
  searchParams?: Promise<{ eventId?: string }>;
}) {
  const session = await auth();
  const eventId = (await searchParams)?.eventId;

  const id: string = eventId ? eventId : nanoid(12);

  return !!session?.user && <EventForm eventId={id} user={session.user} />;
}
