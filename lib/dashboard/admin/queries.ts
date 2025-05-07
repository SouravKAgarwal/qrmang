import { eq, ilike, and, sql } from "drizzle-orm";
import { bookings, events, businesses, users } from "@/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import db from "@/drizzle";

export type Event = InferSelectModel<typeof events> & { organizerName: string };
export type Booking = InferSelectModel<typeof bookings> & {
  eventTitle: string | null;
};
export type Business = InferSelectModel<typeof businesses>;
export type User = InferSelectModel<typeof users>;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export async function getBusinesses({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResult<Business>> {
  const offset = (page - 1) * limit;
  let query: any = db.select().from(businesses);

  const conditions = [];
  if (search) {
    conditions.push(ilike(businesses.name, `%${search}%`));
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const [data, countResult] = await Promise.all([
    query.limit(limit).offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(businesses)
      .where(and(...conditions)),
  ]);

  return {
    data,
    total: countResult[0].count,
  };
}

export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
  role = undefined,
}: {
  page?: number;
  limit?: number;
  search?: string;
  role?: "all" | "user" | "admin" | "business";
}): Promise<PaginatedResult<User>> {
  const offset = (page - 1) * limit;
  let query: any = db.select().from(users);

  const conditions = [];
  if (search) {
    conditions.push(ilike(users.name, `%${search}%`));
  }
  if (role && role !== "all") {
    conditions.push(eq(users.role, role));
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const [data, countResult] = await Promise.all([
    query.limit(limit).offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(...conditions)),
  ]);

  return {
    data,
    total: countResult[0].count,
  };
}
