import EventsTable from "@/components/dashboard/business/event-table";
import { getEvents } from "@/lib/dashboard/organiser/queries";

export default async function AllEvents({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = 10;

  const eventsResult = await getEvents({
    page,
    limit,
    search: resolvedParams.search,
    category: resolvedParams.category,
  });

  return (
    <div className="mb-12">
      <EventsTable
        eventsResult={eventsResult}
        page={page}
        limit={limit}
        initialSearch={resolvedParams.search || ""}
        initialCategory={resolvedParams.category || ""}
      />
    </div>
  );
}
