import { auth } from "@/auth";
import EditEvent from "@/components/edit-event-form";
import { getEvent } from "@/resources/event-queries";
import { nanoid } from "nanoid";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Event",
};

export default async function CreateEventPage({
  searchParams,
}: {
  searchParams?: Promise<{ eventId?: string }>;
}) {
  const session = await auth();
  const eventId = (await searchParams)?.eventId;

  const id: string = eventId ? eventId : nanoid(12);

  const event = await getEvent(id);
  const user = session?.user;

  return !!user && <EditEvent event={event} user={user} eventId={id} />;
}
