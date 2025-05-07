"use server";

import { eq } from "drizzle-orm";
import db from "@/drizzle";
import { bookings, events } from "@/drizzle/schema";
import { Booking, Event } from "@/types";
import { formatDate } from "@/lib/dashboard/admin/utils";

interface WhatsappData {
  eventTitle: string;
  bookingDate: Date;
  eventStart: string;
  eventImage?: string;
}

interface WhatsappRequestBody {
  phone: string;
  userId: string;
  name: string;
  data: WhatsappData;
}

interface EmailRequestBody {
  email: string;
  userId: string;
  name: string;
  data: { event: Event; booking: Booking };
}

interface ConfirmationResponse {
  email: any;
  whatsapp: any;
}

export async function sendBookingConfirmAction(
  bookingId: string,
): Promise<ConfirmationResponse> {
  const booking = (await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1)
    .then((res) => res[0])) as Booking;

  if (!booking) {
    throw new Error("Booking not found");
  }

  const event = (await db
    .select()
    .from(events)
    .where(eq(events.id, booking.eventId))
    .limit(1)
    .then((res) => res[0])) as Event;

  if (!event) {
    throw new Error("Event not found");
  }

  const bookingRouteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-booking-confirmation`;
  const whatsappRouteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-whatsapp-confirmation`;

  try {
    const emailResponse = await fetch(bookingRouteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: booking.bookingEmail,
        userId: event.userId,
        name: booking.attendees[0].name,
        data: { event, booking },
      } as EmailRequestBody),
    });

    if (!emailResponse.ok) {
      throw new Error(
        `Email API error ${emailResponse.status}: ${await emailResponse.text()}`,
      );
    }

    const whatsappResponse = await fetch(whatsappRouteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: booking.bookingPhone,
        userId: event.userId,
        name: booking.attendees[0].name,
        data: {
          eventTitle: event.title,
          bookingDate: booking.bookedAt,
          sessionId: booking.stripeSessionId,
          eventStart: formatDate(event.eventStart),
          eventImage: event.eventImageUrl,
        },
      } as WhatsappRequestBody),
    });

    if (!whatsappResponse.ok) {
      throw new Error(
        `WhatsApp API error ${whatsappResponse.status}: ${await whatsappResponse.text()}`,
      );
    }

    await db
      .update(bookings)
      .set({
        emailSent: true,
        whatsappSent: true,
      })
      .where(eq(bookings.id, bookingId));

    return {
      email: await emailResponse.json(),
      whatsapp: await whatsappResponse.json(),
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to send confirmations: ${error}`);
  }
}
