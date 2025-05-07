import db from "@/drizzle";
import { events, bookings, tickets } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export async function fetchEventDashboardData(eventId: string) {
  const eventDetails = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!eventDetails) {
    throw new Error("Event not found");
  }

  const ticketSales = await db.execute(sql`
  SELECT 
    COALESCE(SUM((ticket->>'quantity')::numeric), 0) as "totalTicketsSold",
    COALESCE(SUM(amount), 0) as "totalRevenue"
  FROM tickets,
  LATERAL json_array_elements(ticket_type) AS ticket
  WHERE event_id = ${eventId}
`);

  const bookingsData = await db
    .select({
      id: bookings.id,
      bookingEmail: bookings.bookingEmail,
      bookingPhone: bookings.bookingPhone,
      paymentStatus: bookings.paymentStatus,
      totalAmount: sql<number>`(${bookings.ticketInfo}->>'totalAmount')::numeric`,
      bookedAt: bookings.bookedAt,
      ticketCount: sql<number>`(${bookings.ticketInfo}->>'totalTickets')::numeric`,
    })
    .from(bookings)
    .where(eq(bookings.eventId, eventId))
    .orderBy(sql`${bookings.bookedAt} DESC`)
    .limit(5);

  const salesOverTime = await db
    .select({
      date: sql<string>`date_trunc('day', ${tickets.issuedAt})`,
      ticketsSold: sql<number>`count(*)`,
      revenue: sql<number>`sum(amount)`,
    })
    .from(tickets)
    .where(eq(tickets.eventId, eventId))
    .groupBy(sql`date_trunc('day', ${tickets.issuedAt})`)
    .orderBy(sql`date_trunc('day', ${tickets.issuedAt})`);

  const ticketStatus = await db
    .select({
      status: tickets.status,
      count: sql<number>`count(*)`,
    })
    .from(tickets)
    .where(eq(tickets.eventId, eventId))
    .groupBy(tickets.status);

  const genderQuery = await db.execute(sql`
    WITH attendee_data AS (
      SELECT 
        jsonb_array_elements_text(attendees::jsonb) as attendee
      FROM tickets
      WHERE event_id = ${eventId}
    )
    SELECT 
      (attendee::json->>'gender') as gender,
      COUNT(*) as count
    FROM attendee_data
    GROUP BY (attendee::json->>'gender')
  `);

  const ageQuery = await db.execute(sql`
    WITH attendee_data AS (
      SELECT 
        jsonb_array_elements_text(attendees::jsonb) as attendee
      FROM tickets
      WHERE event_id = ${eventId}
    )
    SELECT 
      CASE
        WHEN (attendee::json->>'age')::numeric < 18 THEN 'Under 18'
        WHEN (attendee::json->>'age')::numeric BETWEEN 18 AND 25 THEN '18-25'
        WHEN (attendee::json->>'age')::numeric BETWEEN 26 AND 35 THEN '26-35'
        WHEN (attendee::json->>'age')::numeric BETWEEN 36 AND 50 THEN '36-50'
        ELSE '50+'
      END as age_group,
      COUNT(*) as count
    FROM attendee_data
    GROUP BY age_group
  `);

  const ticketAvailability = eventDetails.ticketTypes.map((type) => ({
    name: type.name,
    price: type.price,
    sold: type.seatsAvailable - type.seatsRemaining,
    remaining: type.seatsRemaining,
    percentageSold: Math.round(
      ((type.seatsAvailable - type.seatsRemaining) / type.seatsAvailable) * 100,
    ),
  }));

  return {
    eventDetails: {
      id: eventDetails.id,
      title: eventDetails.title,
      venue: eventDetails.venue,
      city: eventDetails.city,
      eventStart: eventDetails.eventStart,
      eventEnd: eventDetails.eventEnd,
      organizerName: eventDetails.organizerName,
      eventImageUrl: eventDetails.eventImageUrl,
    },
    stats: {
      totalTicketsSold: Number(ticketSales.rows[0]?.totalTicketsSold || 0),
      totalRevenue: Number(ticketSales.rows[0]?.totalRevenue || 0),
      totalBookings: bookingsData.length,
      occupancyRate: Math.round(
        (Number(ticketSales.rows[0]?.totalTicketsSold || 0) /
          eventDetails.ticketTypes.reduce(
            (sum, type) => sum + type.seatsAvailable,
            0,
          )) *
          100,
      ),
    },
    ticketAvailability,
    recentBookings: bookingsData.map((booking) => ({
      id: booking.id,
      email: booking.bookingEmail,
      phone: booking.bookingPhone,
      status: booking.paymentStatus,
      amount: booking.totalAmount,
      date: booking.bookedAt.toISOString(),
      tickets: booking.ticketCount,
    })),
    salesOverTime: salesOverTime.map((item) => ({
      date: item.date,
      ticketsSold: Number(item.ticketsSold),
      revenue: Number(item.revenue),
    })),
    ticketStatus: ticketStatus.map((item) => ({
      status: item.status,
      count: Number(item.count),
    })),
    demographics: {
      gender: genderQuery.rows.map((row) => ({
        name: String(row.gender),
        value: Number(row.count),
      })),
      ageGroups: ageQuery.rows.map((row) => ({
        name: String(row.age_group),
        value: Number(row.count),
      })),
    },
  };
}
