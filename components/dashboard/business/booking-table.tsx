"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/data-table";
import type { Booking, PaginatedResult } from "@/lib/dashboard/admin/queries";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  getBadgeVariant,
} from "@/lib/dashboard/organiser/utils";
import { cn } from "@/lib/utils";

interface BookingsTableProps {
  bookingsResult: PaginatedResult<Booking>;
  page: number;
  limit: number;
  initialSearch: string;
  initialStatus: string;
}

export default function BookingsTable({
  bookingsResult,
  page,
  limit,
  initialSearch,
  initialStatus,
}: BookingsTableProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (initialSearch) params.set("search", initialSearch);
    if (initialStatus) params.set("status", initialStatus);
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status) params.set("status", filters.status);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <DataTable
      title="Bookings"
      data={bookingsResult.data}
      total={bookingsResult.total}
      columns={[
        { header: "Reference", accessor: "bookingReference" },
        {
          header: "Event",
          accessor: "eventTitle",
          render: (item) => item.eventTitle || "Unknown Event",
        },
        {
          header: "Tickets",
          accessor: (item) => item.ticketInfo.totalTickets,
        },
        {
          header: "Amount",
          accessor: (item) => formatCurrency(item.ticketInfo.totalAmount),
        },
        {
          header: "Status",
          accessor: "paymentStatus",
          render: (item) => (
            <Badge
              variant={getBadgeVariant(item.paymentStatus)}
              className={cn(
                "transition-transform duration-200 hover:scale-105",
                {
                  "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300":
                    item.paymentStatus === "completed",
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300":
                    item.paymentStatus === "pending",
                  "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300":
                    item.paymentStatus === "failed",
                },
              )}
            >
              {item.paymentStatus}
            </Badge>
          ),
        },
      ]}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "all", label: "All Statuses" },
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
            { value: "expired", label: "Expired" },
          ],
        },
      ]}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
      page={page}
      limit={limit}
    />
  );
}
