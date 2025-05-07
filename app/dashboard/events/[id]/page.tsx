import { fetchEventDashboardData } from "@/lib/dashboard/events";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  DollarSign,
  Ticket,
  Users,
  User,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/dashboard/organiser/utils";
import { StatCard } from "@/components/dashboard/events/stats-card";
import { TicketInventory } from "@/components/dashboard/events/ticket-inventory";
import { SalesChartCard } from "@/components/dashboard/events/sales-chart";
import { TicketStatusCard } from "@/components/dashboard/events/ticket-status";
import { AttendeeDemographicsCard } from "@/components/dashboard/events/attendees-demographic";
import { RecentBookingsCard } from "@/components/dashboard/events/recent-bookings";

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchEventDashboardData(id);

  if (!data) return <div className="text-center text-lg">Event not found</div>;

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {data.eventDetails.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                {data.eventDetails.venue}, {data.eventDetails.city}
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                {formatDate(data.eventDetails.eventStart)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
          >
            {data.stats.occupancyRate}% Occupied
          </Badge>
          <Badge
            variant="secondary"
            className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
          >
            {formatCurrency(data.stats.totalRevenue)} Revenue
          </Badge>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:mb-8 lg:grid-cols-4">
        <StatCard
          title="Total Tickets Sold"
          value={data.stats.totalTicketsSold}
          icon={<Ticket className="h-5 w-5 flex-shrink-0" />}
          description={`${data.stats.occupancyRate}% of capacity`}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.stats.totalRevenue)}
          icon={<DollarSign className="h-5 w-5 flex-shrink-0" />}
          description={`${data.stats.totalBookings} bookings`}
        />
        <StatCard
          title="Active Tickets"
          value={
            data.ticketStatus.find((t) => t.status === "active")?.count || 0
          }
          icon={<Users className="h-5 w-5 flex-shrink-0" />}
          description={`${
            data.ticketStatus.find((t) => t.status === "done")?.count || 0
          } used`}
        />
        <StatCard
          title="Organizer"
          value={data.eventDetails.organizerName}
          icon={<User className="h-5 w-5 flex-shrink-0" />}
          description="Contact"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2">
        <TicketInventory ticketAvailability={data.ticketAvailability} />
        <TicketStatusCard ticketStatus={data.ticketStatus} />
      </div>

      <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:mb-8">
        <SalesChartCard salesData={data.salesOverTime} />
        <AttendeeDemographicsCard demographics={data.demographics} />
      </div>

      <RecentBookingsCard bookings={data.recentBookings} />
    </div>
  );
}
