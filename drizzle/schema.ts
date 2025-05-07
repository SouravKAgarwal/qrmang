import { relations, sql, SQL } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  type AnyPgColumn,
  uniqueIndex,
  varchar,
  json,
  date,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const roleEnum = pgEnum("role", ["admin", "user", "business"]);

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const users = pgTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
    role: roleEnum("role").notNull().default("user"),
  },
  (table) => [uniqueIndex("emailUniqueIndex").on(lower(table.email))],
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const businesses = pgTable("businesses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  venue: text("venue").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  zipCode: text("zip_code").notNull(),
  category: text("category").notNull(),
  eventType: text("event_type").notNull(),
  ticketTypes: jsonb("ticket_types").notNull().$type<
    {
      name: string;
      price: number;
      seatsAvailable: number;
      seatsRemaining: number;
    }[]
  >(),
  eventImageUrl: text("event_image_url").notNull(),
  eventStart: timestamp("event_start", { mode: "string" }).notNull(),
  eventEnd: timestamp("event_end", { mode: "string" }),
  organizerName: text("organizer_name").notNull(),
  organizerEmail: text("organizer_email").notNull(),
  organizerPhone: text("organizer_phone").notNull(),
  pamphletUrl: text("pamphlet_url").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  bookingId: text("booking_id")
    .references(() => bookings.id, { onDelete: "cascade" })
    .notNull(),
  ticketType: json("ticket_type").notNull().$type<
    {
      name: string;
      price: number;
      quantity: number;
    }[]
  >(),
  amount: numeric("amount").notNull(),
  ticketPass: text("ticket_pass").notNull(),
  status: text("status")
    .notNull()
    .default("active")
    .$type<"active" | "done" | "cancelled">(),
  attendees: json("attendees").notNull().$type<
    {
      name: string;
      age: number;
      aadharNumber: string;
      gender: "Male" | "Female" | "Other";
    }[]
  >(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").references(() => users.id),
  attendees: json("attendees").notNull().$type<
    {
      name: string;
      age: number;
      aadharNumber: string;
      gender: "Male" | "Female" | "Other";
    }[]
  >(),
  ticketInfo: json("ticket_info").notNull().$type<{
    totalTickets: number;
    ticketType: string;
    totalAmount: number;
  }>(),
  bookingEmail: text("booking_email").notNull(),
  bookingPhone: text("booking_phone").notNull(),
  paymentStatus: text("payment_status")
    .notNull()
    .default("pending")
    .$type<"pending" | "completed" | "failed" | "expired">(),
  stripeSessionId: text("stripe_session_id").unique(),
  bookingReference: text("booking_reference").notNull().unique(),
  emailSent: boolean().default(false).notNull(),
  whatsappSent: boolean().default(false).notNull(),
  bookedAt: timestamp("booked_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businesses),
  events: many(events),
}));

export const businessesRelations = relations(businesses, ({ one }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  businesses: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
}));
