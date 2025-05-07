import db from "@/drizzle";
import { events } from "@/drizzle/schema";
import { Event } from "@/types";
import { eq } from "drizzle-orm";

export const getEvent = async (eventId: string) => {
  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .then((res) => res[0]);

  return event;
};

export const getEvents = async () => {
  const evt = await db.select().from(events);

  return evt;
};

export async function getUserEvents(userId: string): Promise<Event[]> {
  const evt = await db.select().from(events).where(eq(events.userId, userId));

  return evt;
}
