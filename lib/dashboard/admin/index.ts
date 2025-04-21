import db from "@/drizzle";
import { users, businesses } from "@/drizzle/schema";
import { eq, ilike, or, sql, and, ne } from "drizzle-orm";
import { type DashboardData } from "@/types";

export async function fetchAdminDashboardData(
  search: string = "",
): Promise<DashboardData> {
  try {
    const [usersCount, businessCount, usersData, businessesData] =
      await Promise.all([
        db
          .select({ count: sql<number>`count(*)` })
          .from(users)
          .where(ne(users.role, "admin")),
        db.select({ count: sql<number>`count(*)` }).from(businesses),
        db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
          })
          .from(users)
          .where(
            and(
              ne(users.role, "admin"),
              search
                ? or(
                    ilike(users.name, `%${search}%`),
                    ilike(users.email, `%${search}%`),
                  )
                : undefined,
            ),
          )
          .limit(5),
        db
          .select({
            id: businesses.id,
            name: businesses.name,
            owner: { name: users.name },
          })
          .from(businesses)
          .leftJoin(users, eq(businesses.ownerId, users.id))
          .where(search ? ilike(businesses.name, `%${search}%`) : undefined)
          .limit(5),
      ]);

    return {
      stats: {
        totalUsers: Number(usersCount[0].count),
        totalBusinesses: Number(businessCount[0].count),
      },
      users: usersData,
      businesses: businessesData,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw new Error("Could not load dashboard data");
  }
}
