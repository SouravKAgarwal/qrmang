import BookingsTable from "@/components/dashboard/business/booking-table";
import { getBookings } from "@/lib/dashboard/organiser/queries";

export default async function AllEvents({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    limit?: number;
    status?: "pending" | "completed" | "failed" | "expired" | "all";
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = 10;

  const bookings = await getBookings({
    page,
    limit,
    search: resolvedParams.search,
    status: resolvedParams.status,
  });

  return (
    <div className="mb-12">
      <BookingsTable
        bookingsResult={bookings}
        page={page}
        limit={limit}
        initialSearch={resolvedParams.search || ""}
        initialStatus={resolvedParams.status || ""}
      />
    </div>
  );
}
