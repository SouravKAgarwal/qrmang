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
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export interface Attendee {
  name: string;
  age: number;
  aadharNumber: string;
  gender: "Male" | "Female" | "Other";
}

export interface Variant {
  id: string;
  name: string | null;
  price: number;
}

export interface MenuItem {
  menuItemId: string;
  name: string;
  variantId: string;
  variantName: string | null;
  price: number;
  quantity: number;
}

// Enums
export const roleEnum = pgEnum("role", ["admin", "user", "business"]);
export const businessEnum = pgEnum("business_type", ["restaurant", "event"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "delivered", "cancelled"]);
export const deliveryTypeEnum = pgEnum("delivery_type", ["delivery", "pickup"]);

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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("emailUniqueIndex").on(lower(table.email)),
    uniqueIndex("roleIndex").on(table.role),
  ],
);

// Accounts table
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
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
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
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
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
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ],
);

export const businesses = pgTable("businesses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  businessType: businessEnum("business_type").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const collections = pgTable(
  "collections",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(), 
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("collectionBusinessIdIndex").on(table.businessId),
  ],
);

// Menu Items table
export const menu_items = pgTable(
  "menu_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // e.g., "Side of chips"
    description: text("description"),
    variants: jsonb("variants")
      .notNull()
      .$type<Variant[]>()
      .default([]), // Array of variants with id, name, price
    category: text("category").notNull(), // e.g., appetizer, main course
    isAvailable: boolean("is_available").notNull().default(true),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("menuItemCollectionIdIndex").on(table.collectionId),
  ],
);

// Events table
export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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
  ticketTypes: jsonb("ticket_types")
    .notNull()
    .$type<
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

// Tickets table
export const tickets = pgTable(
  "tickets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    eventId: text("event_id")
      .references(() => events.id, { onDelete: "cascade" })
      .notNull(),
    bookingId: text("booking_id")
      .references(() => bookings.id, { onDelete: "cascade" })
      .notNull(),
    ticketType: jsonb("ticket_type")
      .notNull()
      .$type<
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
    attendees: jsonb("attendees")
      .notNull()
      .$type<Attendee[]>(),
    issuedAt: timestamp("issued_at").defaultNow().notNull(),
    verifiedAt: timestamp("verified_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("ticketEventIdIndex").on(table.eventId),
    uniqueIndex("ticketBookingIdIndex").on(table.bookingId),
  ],
);

// Bookings table
export const bookings = pgTable(
  "bookings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    eventId: text("event_id")
      .references(() => events.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" }),
    attendees: jsonb("attendees")
      .notNull()
      .$type<Attendee[]>(),
    ticketInfo: jsonb("ticket_info")
      .notNull()
      .$type<{
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
    emailSent: boolean("emailSent").default(false).notNull(),
    whatsappSent: boolean("whatsappSent").default(false).notNull(),
    bookedAt: timestamp("booked_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("bookingEventIdIndex").on(table.eventId),
    uniqueIndex("bookingUserIdIndex").on(table.userId),
  ],
);

// Orders table
export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    items: jsonb("items")
      .notNull()
      .$type<MenuItem[]>(),
    totalAmount: numeric("total_amount").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    paymentStatus: text("payment_status")
      .notNull()
      .default("pending")
      .$type<"pending" | "completed" | "failed" | "expired">(),
    deliveryAddress: text("delivery_address"),
    deliveryType: deliveryTypeEnum("delivery_type").notNull(),
    orderReference: text("order_reference").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("orderUserIdIndex").on(table.userId),
    uniqueIndex("orderBusinessIdIndex").on(table.businessId),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businesses),
  events: many(events),
  bookings: many(bookings),
  orders: many(orders),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  collections: many(collections),
  orders: many(orders),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  business: one(businesses, {
    fields: [collections.businessId],
    references: [businesses.id],
  }),
  menuItems: many(menu_items),
}));

export const menuItemsRelations = relations(menu_items, ({ one }) => ({
  collection: one(collections, {
    fields: [menu_items.collectionId],
    references: [collections.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  tickets: many(tickets),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  booking: one(bookings, {
    fields: [tickets.bookingId],
    references: [bookings.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [orders.businessId],
    references: [businesses.id],
  }),
}));