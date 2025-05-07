import { auth } from "@/auth";
import { RecentBookingsTable } from "@/components/dashboard/business/recent-bookings-table";
import { RecentEventsTable } from "@/components/dashboard/business/recent-events-table";
import { fetchOrganiserDashboardData } from "@/lib/dashboard/organiser";

export default async function OrganizerDashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  let data;
  try {
    data = await fetchOrganiserDashboardData(session.user.id);
  } catch (error) {
    return (
      <>
        <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
        <p className="mt-4 text-red-500">
          Error loading dashboard data. Please try again later.
        </p>
      </>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span className="font-geistSans font-medium">
          Hey, {session?.user?.name?.split(" ")[0]}
        </span>
      </div>

      <RecentEventsTable events={data.recentEvents} />
      <RecentBookingsTable bookings={data.recentBookings} />
    </div>
  );
}
