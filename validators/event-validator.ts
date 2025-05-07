import * as v from "valibot";

const ticketTypeSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Ticket name is required")),
  price: v.pipe(v.number(), v.minValue(0, "Price cannot be negative")),
  seatsAvailable: v.pipe(
    v.number(),
    v.minValue(1, "Must have at least 1 seat"),
  ),
  seatsRemaining: v.pipe(
    v.number(),
    v.minValue(0, "Cannot have negative remaining seats"),
  ),
});

export const eventSchema = v.pipe(
  v.object({
    id: v.pipe(v.string(), v.nonEmpty("ID is required")),
    userId: v.pipe(v.string(), v.nonEmpty("User ID is required")),
    title: v.pipe(v.string(), v.nonEmpty("Title is required")),
    description: v.optional(v.string()),
    venue: v.pipe(v.string(), v.nonEmpty("Venue is required")),
    address: v.pipe(v.string(), v.nonEmpty("Address is required")),
    city: v.pipe(v.string(), v.nonEmpty("City is required")),
    state: v.pipe(v.string(), v.nonEmpty("State is required")),
    country: v.pipe(v.string(), v.nonEmpty("Country is required")),
    zipCode: v.pipe(v.string(), v.nonEmpty("Zip code is required")),
    category: v.pipe(v.string(), v.nonEmpty("Category is required")),
    eventType: v.pipe(v.string(), v.nonEmpty("Event type is required")),
    ticketTypes: v.pipe(
      v.array(ticketTypeSchema),
      v.nonEmpty("At least one ticket type is required"),
    ),
    eventImageUrl: v.pipe(
      v.string(),
      v.nonEmpty("Event image URL is required"),
    ),
    eventStart: v.pipe(
      v.string(),
      v.check(
        (value) => new Date(value) > new Date(),
        "Start date/time must be in the future",
      ),
    ),
    eventEnd: v.optional(v.string()),
    organizerName: v.pipe(v.string(), v.nonEmpty("Organizer name is required")),
    organizerEmail: v.pipe(
      v.string(),
      v.nonEmpty("Organizer email is required"),
      v.email("Invalid email format"),
    ),
    organizerPhone: v.pipe(
      v.string(),
      v.nonEmpty("Organizer phone is required"),
      v.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    ),
    publishedAt: v.optional(v.pipe(v.date())),
    pamphletUrl: v.pipe(v.string()),
  }),
  v.forward(
    v.partialCheck(
      [["eventStart"], ["eventEnd"]],
      (input) =>
        !input.eventEnd ||
        (!!input.eventEnd &&
          new Date(input.eventStart) < new Date(input.eventEnd)),
      "End date/time must be after start date/time",
    ),
    ["eventEnd"],
  ),
);
