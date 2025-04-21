import { events, bookings, tickets } from "@/drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import db from "@/drizzle";
import { formatDate } from "./utils";

type Event = typeof events.$inferSelect;
type Booking = typeof bookings.$inferSelect;

export type DashboardData = {
  stats: {
    totalEvents: number;
    totalBookings: number;
    totalTickets: number;
    totalRevenue: number;
  };
  recentEvents: Event[];
  recentBookings: (Booking & { eventTitle: string })[];
  ticketSalesData: { date: string; ticketsSold: number }[];
  categoryData: { name: string; value: number }[];
};

export async function fetchOrganiserDashboardData(
  userId: string,
): Promise<DashboardData> {
  try {
    const [eventsCount, bookingsCount, ticketsCount, revenue] =
      await Promise.all([
        db
          .select({ count: sql<number>`count(*)` })
          .from(events)
          .where(eq(events.userId, userId)),
        db
          .select({ count: sql<number>`count(*)` })
          .from(bookings)
          .innerJoin(events, eq(bookings.eventId, events.id))
          .where(eq(events.userId, userId)),
        db
          .select({ count: sql<number>`count(*)` })
          .from(tickets)
          .innerJoin(events, eq(tickets.eventId, events.id))
          .where(eq(events.userId, userId)),
        db
          .select({
            total: sql<number | null>`sum(${tickets.amount}::numeric)`,
          })
          .from(tickets)
          .innerJoin(events, eq(tickets.eventId, events.id))
          .where(and(eq(events.userId, userId))),
      ]);

    const recentEvents = await db
      .select()
      .from(events)
      .where(eq(events.userId, userId))
      .orderBy(desc(events.createdAt))
      .limit(5);

    const bookingsData = await db
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
        whatsappSent: bookings.whatsappSent,
        emailSent: bookings.emailSent,
      })
      .from(bookings)
      .innerJoin(events, eq(bookings.eventId, events.id))
      .where(eq(events.userId, userId))
      .orderBy(desc(bookings.bookedAt))
      .limit(5);

    const salesData = await db
      .select({
        date: sql<string>`date_trunc('day', ${tickets.issuedAt})`,
        ticketsSold: sql<number>`count(*)`,
      })
      .from(tickets)
      .innerJoin(events, eq(tickets.eventId, events.id))
      .where(eq(events.userId, userId))
      .groupBy(sql`date_trunc('day', ${tickets.issuedAt})`)
      .orderBy(sql`date_trunc('day', ${tickets.issuedAt})`);

    const categoryStats = await db
      .select({
        category: events.category,
        count: sql<number>`count(*)`,
      })
      .from(events)
      .where(eq(events.userId, userId))
      .groupBy(events.category);

    return {
      stats: {
        totalEvents: Number(eventsCount[0].count),
        totalBookings: Number(bookingsCount[0].count),
        totalTickets: Number(ticketsCount[0].count),
        totalRevenue: revenue[0].total !== null ? Number(revenue[0].total) : 0,
      },
      recentEvents,
      recentBookings: bookingsData,
      ticketSalesData: salesData.map((item) => ({
        date: formatDate(item.date),
        ticketsSold: Number(item.ticketsSold),
      })),
      categoryData: categoryStats.map((item) => ({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        value: Number(item.count),
      })),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Could not load dashboard data");
  }
}
