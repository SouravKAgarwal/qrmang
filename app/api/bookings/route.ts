import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import db from "@/drizzle";
import { events, bookings } from "@/drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const {
      ticketType,
      quantity,
      bookingEmail,
      bookingPhone,
      attendees,
      userId,
      eventId,
    } = await req.json();

    if (
      !ticketType ||
      !quantity ||
      !bookingEmail ||
      !bookingPhone ||
      !attendees ||
      !eventId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1)
      .then((res) => res[0]);

    if (!event) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const ticketTypeInfo = event.ticketTypes.find(
      (type) => type.name === ticketType,
    );

    if (!ticketTypeInfo) {
      return NextResponse.json(
        { error: "Invalid ticket type" },
        { status: 400 },
      );
    }

    if (ticketTypeInfo.seatsRemaining < quantity) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 },
      );
    }

    const { price } = ticketTypeInfo;
    const totalAmountInPaisa = Number(price) * quantity * 100;

    const bookingReference = `BR-${randomUUID().slice(0, 8).toUpperCase()}`;
    const bookingId = randomUUID();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${event.title} Ticket (${ticketTypeInfo.name})`,
              description: `Quantity: ${quantity}\nEvent:${eventId}`,
            },
            unit_amount: Number(price) * 100,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/events/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/events/booking/cancel?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: bookingEmail,
      metadata: {
        eventId,
        ticketType,
        quantity: quantity.toString(),
        bookingPhone,
        bookingEmail,
        bookingId,
      },
    });

    await db.insert(bookings).values({
      id: bookingId,
      eventId: eventId,
      userId,
      attendees,
      ticketInfo: {
        ticketType: ticketType,
        totalTickets: quantity,
        totalAmount: totalAmountInPaisa / 100,
      },
      bookingEmail,
      bookingPhone,
      paymentStatus: "pending",
      stripeSessionId: session.id,
      bookingReference,
    });

    return NextResponse.json({
      sessionId: session.id,
      bookingId,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
