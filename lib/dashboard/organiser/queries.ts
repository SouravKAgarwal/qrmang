import { eq, ilike, and, sql } from "drizzle-orm";
import { bookings, events } from "@/drizzle/schema";
import db from "@/drizzle";
import type { Booking, Event, PaginatedResult } from "../admin/queries";

export async function getBookings({
  page = 1,
  limit = 10,
  search = "",
  status = undefined,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "pending" | "completed" | "failed" | "expired";
}): Promise<PaginatedResult<Booking>> {
  const offset = (page - 1) * limit;
  let query: any = db
    .select({
      id: bookings.id,
      eventId: bookings.eventId,
      userId: bookings.userId,
      attendees: bookings.attendees,
      ticketInfo: bookings.ticketInfo,
      bookingEmail: bookings.bookingEmail,
      bookingPhone: bookings.bookingPhone,
      paymentStatus: bookings.paymentStatus,
      stripeSessionId: bookings.stripeSessionId,
      bookingReference: bookings.bookingReference,
      bookedAt: bookings.bookedAt,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      eventTitle: events.title,
    })
    .from(bookings)
    .leftJoin(events, eq(bookings.eventId, events.id));

  const conditions = [];
  if (search) {
    conditions.push(ilike(events.title, `%${search}%`));
  }
  if (status && status !== "all") {
    conditions.push(eq(bookings.paymentStatus, status));
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const [data, countResult] = await Promise.all([
    query.limit(limit).offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .leftJoin(events, eq(bookings.eventId, events.id))
      .where(and(...conditions)),
  ]);

  return {
    data,
    total: countResult[0].count,
  };
}

export async function getEvents({
  page = 1,
  limit = 10,
  search = "",
  category = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<PaginatedResult<Event>> {
  const offset = (page - 1) * limit;
  let query: any = db
    .select({
      id: events.id,
      userId: events.userId,
      title: events.title,
      description: events.description,
      venue: events.venue,
      address: events.address,
      city: events.city,
      state: events.state,
      country: events.country,
      zipCode: events.zipCode,
      category: events.category,
      eventType: events.eventType,
      ticketTypes: events.ticketTypes,
      eventImageUrl: events.eventImageUrl,
      eventStart: events.eventStart,
      eventEnd: events.eventEnd,
      organizerName: events.organizerName,
      organizerEmail: events.organizerEmail,
      organizerPhone: events.organizerPhone,
      pamphletUrl: events.pamphletUrl,
      publishedAt: events.publishedAt,
      createdAt: events.createdAt,
      updatedAt: events.updatedAt,
    })
    .from(events);

  const conditions = [];
  if (search) {
    conditions.push(ilike(events.title, `%${search}%`));
  }
  if (category && category !== "all") {
    conditions.push(eq(events.category, category));
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const [data, countResult] = await Promise.all([
    query.limit(limit).offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(and(...conditions)),
  ]);

  return {
    data,
    total: countResult[0].count,
  };
}
