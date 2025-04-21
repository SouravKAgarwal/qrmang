import { fetchAdminDashboardData } from "@/lib/dashboard/admin";
import { StatsCards } from "@/components/dashboard/admin/stats-card";
import { UsersTable } from "@/components/dashboard/admin/users-table";
import { BusinessesTable } from "@/components/dashboard/admin/business-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Suspense } from "react";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const search = (await searchParams).search || "";

  const session = await auth();
  if (!session?.user?.id) redirect("/");

  let data;
  try {
    data = await fetchAdminDashboardData(search);
  } catch (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="text-center text-gray-700 dark:text-gray-300">
            <h2 className="mb-2 text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              Unable to Load Dashboard
            </h2>
            <p className="text-red-500">
              Error loading data. Please try again later.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex max-w-7xl flex-col items-center justify-between gap-4 py-4 sm:flex-row">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
              Admin Dashboard
            </h1>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Welcome, {session.user.name?.split(" ")[0]}
            </p>
          </div>
          <form
            action="/admin/dashboard/admin"
            method="GET"
            className="relative w-full sm:w-64"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              name="search"
              placeholder="Search users or businesses..."
              defaultValue={search}
              className="border-gray-200 bg-white pl-10 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </form>
        </div>
      </header>

      <main className="space-y-6">
        <Suspense
          fallback={
            <div className="grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          }
        >
          <StatsCards metrics={data.stats} />
        </Suspense>

        <section
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          aria-label="Users and businesses"
        >
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            }
          >
            <UsersTable users={data.users} />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            }
          >
            <BusinessesTable businesses={data.businesses} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
