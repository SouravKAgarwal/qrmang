import db from "@/drizzle";
import { bookings, events, tickets } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getBookings(userId: string) {
  const bookingData = await db
    .select({
      booking: bookings,
      event: events,
    })
    .from(bookings)
    .leftJoin(events, eq(bookings.eventId, events.id))
    .where(eq(bookings.userId, userId));

  return bookingData.map(({ booking, event }) => ({
    ...booking,
    eventData: event,
  }));
}

export async function getBooking(session_id: string) {
  const booking = await db
    .select()
    .from(bookings)
    .where(eq(bookings.stripeSessionId, session_id))
    .limit(1)
    .then((res) => res[0]);

  return booking;
}

export async function getTicket(ticketId: string) {
  const ticket = await db
    .select()
    .from(tickets)
    .where(eq(tickets.bookingId, ticketId))
    .limit(1)
    .then((res) => res[0]);

  return ticket;
}
