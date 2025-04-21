import { BusinessesTable } from "@/components/dashboard/admin/admin-tables";
import { getBusinesses } from "@/lib/dashboard/admin/queries";

export default async function AllBusinesses({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    role?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = 10;

  const businessesResult = await getBusinesses({
    page,
    limit,
    search: resolvedParams.search,
  });

  return (
    <div className="mb-12">
      <BusinessesTable
        businessesResult={businessesResult}
        page={page}
        limit={limit}
        initialSearch={resolvedParams.search || ""}
      />
    </div>
  );
}
