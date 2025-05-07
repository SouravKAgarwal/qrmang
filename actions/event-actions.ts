"use server";

import db from "@/drizzle";
import { events } from "@/drizzle/schema";
import { eventSchema } from "@/validators/event-validator";
import { safeParse } from "valibot";
import { revalidatePath } from "next/cache";
import * as v from "valibot";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

type CreateRes =
  | {
      success: true;
      data: {
        id: (typeof events.$inferSelect)["id"];
        title: (typeof events.$inferSelect)["title"];
        eventStart: string;
        pamphletUrl: string;
      };
    }
  | { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
  | { success: false; error: string; statusCode: 500 | 401 };

type Res =
  | { success: true; data: { id: string } }
  | { success: false; error: string; statusCode: 401 | 404 | 500 };

export async function createEvent(formData: FormData): Promise<CreateRes> {
  const rawData = Object.fromEntries(formData.entries());
  const data = {
    ...rawData,
    ticketTypes: rawData.ticketTypes
      ? JSON.parse(rawData.ticketTypes as string)
      : [],
  };

  const result = safeParse(eventSchema, data);
  if (!result.success) {
    const flattenedErrors = v.flatten(result.issues);
    return { success: false, error: flattenedErrors, statusCode: 400 };
  }

  try {
    const [newEvent] = await db
      .insert(events)
      .values({
        id: result.output.id,
        userId: result.output.userId,
        title: result.output.title,
        description: result.output.description,
        venue: result.output.venue,
        address: result.output.address,
        city: result.output.city,
        state: result.output.state,
        country: result.output.country,
        zipCode: result.output.zipCode,
        category: result.output.category,
        eventType: result.output.eventType,
        ticketTypes: result.output.ticketTypes,
        eventImageUrl: result.output.eventImageUrl,
        eventStart: result.output.eventStart,
        eventEnd: result.output.eventEnd ? result.output.eventEnd : null,
        organizerName: result.output.organizerName,
        organizerEmail: result.output.organizerEmail,
        organizerPhone: result.output.organizerPhone,
        pamphletUrl: result.output.pamphletUrl,
        publishedAt: result.output.publishedAt
          ? new Date(result.output.publishedAt)
          : new Date(),
      })
      .returning({
        id: events.id,
        title: events.title,
        eventStart: events.eventStart,
        pamphletUrl: events.pamphletUrl,
      });

    if (!newEvent) {
      throw new Error("Failed to insert event into database");
    }

    revalidatePath("/events");

    return {
      success: true,
      data: {
        id: newEvent.id,
        title: newEvent.title,
        eventStart: newEvent.eventStart,
        pamphletUrl: newEvent.pamphletUrl,
      },
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function unpublishEvent(eventId: string): Promise<Res> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  try {
    const [existingEvent] = await db
      .select({ userId: events.userId })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!existingEvent || existingEvent.userId !== userId) {
      return {
        success: false,
        error: "Event not found or unauthorized",
        statusCode: 404,
      };
    }

    const [updatedEvent] = await db
      .update(events)
      .set({
        publishedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning({ id: events.id });

    if (!updatedEvent) {
      throw new Error("Failed to unpublish event");
    }

    revalidatePath("/user/events");
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      data: { id: updatedEvent.id },
    };
  } catch (error) {
    console.error("Error unpublishing event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function publishEvent(eventId: string): Promise<Res> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  try {
    const [existingEvent] = await db
      .select({ userId: events.userId })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!existingEvent || existingEvent.userId !== userId) {
      return {
        success: false,
        error: "Event not found or unauthorized",
        statusCode: 404,
      };
    }

    const [updatedEvent] = await db
      .update(events)
      .set({
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning({ id: events.id });

    if (!updatedEvent) {
      throw new Error("Failed to unpublish event");
    }

    revalidatePath("/user/events");
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      data: { id: updatedEvent.id },
    };
  } catch (error) {
    console.error("Error unpublishing event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function deleteEvent(eventId: string): Promise<Res> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  try {
    const [existingEvent] = await db
      .select({ userId: events.userId })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!existingEvent || existingEvent.userId !== userId) {
      return {
        success: false,
        error: "Event not found or unauthorized",
        statusCode: 404,
      };
    }

    const [deletedEvent] = await db
      .delete(events)
      .where(eq(events.id, eventId))
      .returning({ id: events.id });

    if (!deletedEvent) {
      throw new Error("Failed to delete event");
    }

    revalidatePath("/user/events");
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      data: { id: deletedEvent.id },
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function draftEvent(formData: FormData): Promise<CreateRes> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  const rawData = Object.fromEntries(formData.entries());
  const data = {
    ...rawData,
    userId,
    ticketTypes: rawData.ticketTypes
      ? JSON.parse(rawData.ticketTypes as string)
      : [],
    publishedAt: null,
  };

  const result = safeParse(eventSchema, data);
  if (!result.success) {
    const flattenedErrors = v.flatten(result.issues);
    return { success: false, error: flattenedErrors, statusCode: 400 };
  }

  try {
    const [newEvent] = await db
      .insert(events)
      .values({
        id: result.output.id,
        userId: result.output.userId,
        title: result.output.title,
        description: result.output.description,
        venue: result.output.venue,
        address: result.output.address,
        city: result.output.city,
        state: result.output.state,
        country: result.output.country,
        zipCode: result.output.zipCode,
        category: result.output.category,
        eventType: result.output.eventType,
        ticketTypes: result.output.ticketTypes,
        eventImageUrl: result.output.eventImageUrl,
        eventStart: result.output.eventStart,
        eventEnd: result.output.eventEnd ?? null,
        organizerName: result.output.organizerName,
        organizerEmail: result.output.organizerEmail,
        organizerPhone: result.output.organizerPhone,
        pamphletUrl: result.output.pamphletUrl,
        publishedAt: null,
      })
      .returning({
        id: events.id,
        title: events.title,
        eventStart: events.eventStart,
        pamphletUrl: events.pamphletUrl,
      });

    if (!newEvent) {
      throw new Error("Failed to create draft event");
    }

    revalidatePath("/user/events");

    return {
      success: true,
      data: {
        id: newEvent.id,
        title: newEvent.title,
        eventStart: newEvent.eventStart,
        pamphletUrl: newEvent.pamphletUrl,
      },
    };
  } catch (error) {
    console.error("Error creating draft event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function editEvent(
  eventId: string,
  formData: FormData,
): Promise<CreateRes> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  const existingEvent = await db
    .select({ userId: events.userId })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!existingEvent[0] || existingEvent[0].userId !== userId) {
    return {
      success: false,
      error: "Event not found or unauthorized",
      statusCode: 401,
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  const data = {
    ...rawData,
    userId,
    ticketTypes: rawData.ticketTypes
      ? JSON.parse(rawData.ticketTypes as string)
      : [],
  };

  const result = safeParse(eventSchema, data);
  if (!result.success) {
    const flattenedErrors = v.flatten(result.issues);
    return { success: false, error: flattenedErrors, statusCode: 400 };
  }

  try {
    const [updatedEvent] = await db
      .update(events)
      .set({
        title: result.output.title,
        description: result.output.description,
        venue: result.output.venue,
        address: result.output.address,
        city: result.output.city,
        state: result.output.state,
        country: result.output.country,
        zipCode: result.output.zipCode,
        category: result.output.category,
        eventType: result.output.eventType,
        ticketTypes: result.output.ticketTypes,
        eventImageUrl: result.output.eventImageUrl,
        eventStart: result.output.eventStart,
        eventEnd: result.output.eventEnd ? result.output.eventEnd : null,
        organizerName: result.output.organizerName,
        organizerEmail: result.output.organizerEmail,
        organizerPhone: result.output.organizerPhone,
        pamphletUrl: result.output.pamphletUrl,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning({
        id: events.id,
        title: events.title,
        eventStart: events.eventStart,
        pamphletUrl: events.pamphletUrl,
      });

    if (!updatedEvent) {
      throw new Error("Failed to update event");
    }

    revalidatePath("/user/events");
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      data: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        eventStart: updatedEvent.eventStart,
        pamphletUrl: updatedEvent.pamphletUrl,
      },
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    };
  }
}
