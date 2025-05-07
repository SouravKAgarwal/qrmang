import { UsersTable } from "@/components/dashboard/admin/admin-tables";
import { getUsers } from "@/lib/dashboard/admin/queries";

export default async function AllUsers({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    role?: "user" | "admin" | "business";
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const limit = 10;

  const usersResult = await getUsers({
    page,
    limit,
    search: resolvedParams.search,
    role: resolvedParams.role,
  });

  return (
    <div className="mb-12">
      <UsersTable
        usersResult={usersResult}
        page={page}
        limit={limit}
        initialSearch={resolvedParams.search || ""}
        initialRole={resolvedParams.role || ""}
      />
    </div>
  );
}
