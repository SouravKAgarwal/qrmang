import * as v from "valibot";

const attendeeSchema = v.object({
  name: v.pipe(v.string("Name is required"), v.nonEmpty("Name is required")),
  age: v.pipe(
    v.number("Age is required"),
    v.minValue(0, "Age must be a positive number"),
    v.maxValue(120, "Age must be less than or equal to 120"),
  ),
  aadharNumber: v.pipe(
    v.string("Aadhar number is required"),
    v.nonEmpty("Aadhar number is required"),
    v.regex(/^\d{12}$/, "Aadhar number must be 12 digits long"),
  ),
  gender: v.pipe(v.string(), v.nonEmpty("Gender is required")),
});

export const BookingSchema = v.pipe(
  v.object({
    attendees: v.array(attendeeSchema),
    quantity: v.pipe(
      v.number("Quantity is required"),
      v.minValue(1, "Quantity must be at least 1"),
      v.maxValue(5, "Quantity must be less than or equal to 5"),
    ),
    bookingEmail: v.pipe(
      v.string("Email is required"),
      v.nonEmpty("Email is required"),
      v.email("Email must be a valid email"),
    ),
    bookingPhone: v.pipe(
      v.string("Phone number is required"),
      v.nonEmpty("Phone number is required"),
      v.regex(/^\d{10}$/, "Phone number must be 10 digits long"),
    ),
    ticketType: v.pipe(
      v.string("Ticket type is required"),
      v.nonEmpty("Ticket type is required"),
    ),
  }),
);

export type BookingInput = v.InferInput<typeof BookingSchema>;
