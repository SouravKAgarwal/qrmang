CREATE TYPE "public"."business_type" AS ENUM('restaurant', 'event');--> statement-breakpoint
CREATE TYPE "public"."delivery_type" AS ENUM('delivery', 'pickup');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"business_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" text PRIMARY KEY NOT NULL,
	"collection_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"variants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category" text NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_id" text NOT NULL,
	"items" jsonb NOT NULL,
	"total_amount" numeric NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"delivery_address" text,
	"delivery_type" "delivery_type" NOT NULL,
	"order_reference" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_reference_unique" UNIQUE("order_reference")
);
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_owner_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "attendees" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "ticket_info" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "ticket_type" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "attendees" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "business_type" "business_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "collectionBusinessIdIndex" ON "collections" USING btree ("business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "menuItemCollectionIdIndex" ON "menu_items" USING btree ("collection_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orderUserIdIndex" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orderBusinessIdIndex" ON "orders" USING btree ("business_id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bookingEventIdIndex" ON "bookings" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookingUserIdIndex" ON "bookings" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ticketEventIdIndex" ON "tickets" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ticketBookingIdIndex" ON "tickets" USING btree ("booking_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roleIndex" ON "user" USING btree ("role");