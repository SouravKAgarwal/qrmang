import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import db from "@/drizzle";
import { bookings, events } from "@/drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    const body = await req.arrayBuffer();
    const rawBody = Buffer.from(body);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Webhook signature verification failed", details: errorMessage },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as {
          eventId?: string;
          ticketType?: string;
          quantity?: string;
          bookingId?: string;
        };

        if (!metadata.eventId || !metadata.ticketType || !metadata.bookingId) {
          console.error("Missing required metadata:", {
            eventId: metadata.eventId,
            ticketType: metadata.ticketType,
            bookingId: metadata.bookingId,
          });
          return NextResponse.json(
            {
              error:
                "Missing required metadata (eventId, ticketType, or bookingId)",
            },
            { status: 400 },
          );
        }

        const quantity = parseInt(metadata.quantity || "0");
        if (isNaN(quantity) || quantity <= 0) {
          console.error("Invalid quantity:", metadata.quantity);
          return NextResponse.json(
            { error: "Invalid quantity in metadata" },
            { status: 400 },
          );
        }

        const [booking] = await db
          .update(bookings)
          .set({
            paymentStatus: "completed",
            updatedAt: new Date(),
          })
          .where(
            metadata.bookingId
              ? eq(bookings.id, metadata.bookingId)
              : eq(bookings.stripeSessionId, session.id),
          )
          .returning();

        if (!booking) {
          console.error("Booking not found for session:", session.id);
          return NextResponse.json(
            { error: "Booking not found" },
            { status: 404 },
          );
        }

        const [eventData] = await db
          .select()
          .from(events)
          .where(eq(events.id, metadata.eventId));

        if (!eventData) {
          console.error("Event not found for eventId:", metadata.eventId);
          return NextResponse.json(
            { error: "Event not found" },
            { status: 404 },
          );
        }

        const updatedTicketTypes = eventData.ticketTypes.map((ticketType) => {
          if (ticketType.name === metadata.ticketType) {
            return {
              ...ticketType,
              seatsRemaining: ticketType.seatsRemaining - quantity,
            };
          }
          return ticketType;
        });

        await db
          .update(events)
          .set({
            ticketTypes: updatedTicketTypes,
            updatedAt: new Date(),
          })
          .where(eq(events.id, metadata.eventId));

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as { bookingId?: string };

        const [booking] = await db
          .update(bookings)
          .set({
            paymentStatus: "expired",
            updatedAt: new Date(),
          })
          .where(
            metadata.bookingId
              ? eq(bookings.id, metadata.bookingId)
              : eq(bookings.stripeSessionId, session.id),
          )
          .returning();

        if (!booking) {
          console.warn("No booking found for expired session:", session.id);
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as {
          eventId?: string;
          ticketType?: string;
          quantity?: string;
          bookingId?: string;
        };

        if (!metadata.eventId || !metadata.ticketType || !metadata.bookingId) {
          console.error("Missing required metadata:", {
            eventId: metadata.eventId,
            ticketType: metadata.ticketType,
            bookingId: metadata.bookingId,
          });
          return NextResponse.json(
            {
              error:
                "Missing required metadata (eventId, ticketType, or bookingId)",
            },
            { status: 400 },
          );
        }

        const quantity = parseInt(metadata.quantity || "0");
        if (isNaN(quantity) || quantity <= 0) {
          console.error("Invalid quantity:", metadata.quantity);
          return NextResponse.json(
            { error: "Invalid quantity in metadata" },
            { status: 400 },
          );
        }

        const [booking] = await db
          .update(bookings)
          .set({
            paymentStatus: "completed",
            updatedAt: new Date(),
          })
          .where(
            metadata.bookingId
              ? eq(bookings.id, metadata.bookingId)
              : eq(bookings.stripeSessionId, session.id),
          )
          .returning();

        if (!booking) {
          console.error("Booking not found for session:", session.id);
          return NextResponse.json(
            { error: "Booking not found" },
            { status: 404 },
          );
        }

        const [eventData] = await db
          .select()
          .from(events)
          .where(eq(events.id, metadata.eventId));

        if (!eventData) {
          console.error("Event not found for eventId:", metadata.eventId);
          return NextResponse.json(
            { error: "Event not found" },
            { status: 404 },
          );
        }

        const updatedTicketTypes = eventData.ticketTypes.map((ticketType) => {
          if (ticketType.name === metadata.ticketType) {
            return {
              ...ticketType,
              seatsRemaining: ticketType.seatsRemaining - quantity,
            };
          }
          return ticketType;
        });

        await db
          .update(events)
          .set({
            ticketTypes: updatedTicketTypes,
            updatedAt: new Date(),
          })
          .where(eq(events.id, metadata.eventId));

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as { bookingId?: string };

        const [booking] = await db
          .update(bookings)
          .set({
            paymentStatus: "failed",
            updatedAt: new Date(),
          })
          .where(
            metadata.bookingId
              ? eq(bookings.id, metadata.bookingId)
              : eq(bookings.stripeSessionId, session.id),
          )
          .returning();

        if (!booking) {
          console.warn(
            "No booking found for failed payment session:",
            session.id,
          );
        }

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Webhook processing failed", details: errorMessage },
      { status: 500 },
    );
  }
}
