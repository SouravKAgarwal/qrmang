"use server";

import db from "@/drizzle";
import { bookings, events, tickets } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type Res = {
  success: boolean;
  error?: string;
  data?: {
    booking: {
      id: string;
      bookingReference: string;
      eventId: string;
      paymentStatus: string;
      bookedAt: Date;
      attendees: {
        name: string;
        age: number;
        aadharNumber: string;
        gender: string;
      }[];
      ticketInfo: {
        totalTickets: number;
        ticketType: string;
        totalAmount: number;
      };
    };
    event: {
      title?: string;
      venue?: string;
      eventStart?: string;
      eventEnd?: string;
    };
    tickets: {
      id: string;
      status: string;
      ticketType: { name: string; price: number; quantity: number }[];
      attendees: {
        name: string;
        age: number;
        aadharNumber: string;
        gender: string;
      }[];
      verifiedAt: Date | null;
    };
  };
};

export async function verifyBookingAction(
  bookingReference: string,
): Promise<Res> {
  try {
    const bookingResult = await db
      .select({
        booking: bookings,
        event: events,
        tickets: tickets,
      })
      .from(bookings)
      .leftJoin(events, eq(bookings.eventId, events.id))
      .leftJoin(tickets, eq(bookings.id, tickets.bookingId))
      .where(eq(bookings.bookingReference, bookingReference))
      .limit(1);

    if (!bookingResult.length) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    const [result] = bookingResult;

    if (result.booking.paymentStatus !== "completed") {
      return {
        success: false,
        error: "Payment not completed",
      };
    }

    if (
      !!result.event?.eventStart &&
      new Date(result.event?.eventStart).toDateString() !==
        new Date().toDateString()
    ) {
      return {
        success: false,
        error: "Oops! Not the event day.",
      };
    }

    if (result.tickets && !result.tickets.verifiedAt) {
      await db
        .update(tickets)
        .set({
          verifiedAt: new Date(),
          status: "done",
        })
        .where(eq(tickets.bookingId, result.booking.id));
    }

    const latestTickets = await db
      .select()
      .from(tickets)
      .where(eq(tickets.bookingId, result.booking.id))
      .then((res) => res[0]);

    return {
      success: true,
      data: {
        booking: {
          id: result.booking.id,
          bookingReference: result.booking.bookingReference,
          eventId: result.booking.eventId,
          paymentStatus: result.booking.paymentStatus,
          bookedAt: result.booking.bookedAt,
          attendees: result.booking.attendees,
          ticketInfo: result.booking.ticketInfo,
        },
        event: {
          title: result.event?.title,
          venue: result.event?.venue,
          eventStart: result.event?.eventStart,
          eventEnd: result.event?.eventEnd ?? undefined,
        },
        tickets: {
          id: latestTickets.id,
          status: latestTickets.status,
          ticketType: latestTickets.ticketType,
          attendees: latestTickets.attendees,
          verifiedAt: latestTickets.verifiedAt,
        },
      },
    };
  } catch (error) {
    console.error("Error verifying booking:", error);
    return {
      success: false,
      error: "An error occurred while verifying the booking",
    };
  }
}
