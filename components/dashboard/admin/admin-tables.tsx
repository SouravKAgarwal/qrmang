"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/data-table";
import type {
  Business,
  PaginatedResult,
  User,
} from "@/lib/dashboard/admin/queries";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant } from "@/lib/dashboard/organiser/utils";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dashboard/admin/utils";

interface BusinessesTableProps {
  businessesResult: PaginatedResult<Business>;
  page: number;
  limit: number;
  initialSearch: string;
}

interface UsersTableProps {
  usersResult: PaginatedResult<User>;
  page: number;
  limit: number;
  initialSearch: string;
  initialRole: string;
}

export const BusinessesTable = ({
  businessesResult,
  page,
  limit,
  initialSearch,
}: BusinessesTableProps) => {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (initialSearch) params.set("search", initialSearch);
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <DataTable
      title="Businesses"
      data={businessesResult.data}
      total={businessesResult.total}
      columns={[
        { header: "Name", accessor: "name" },
        { header: "Description", accessor: "description" },
        { header: "Owner ID", accessor: "ownerId" },
      ]}
      filters={[]}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
      page={page}
      limit={limit}
    />
  );
};

export const UsersTable = ({
  usersResult,
  page,
  limit,
  initialSearch,
  initialRole,
}: UsersTableProps) => {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (initialSearch) params.set("search", initialSearch);
    if (initialRole) params.set("role", initialRole);
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.role) params.set("role", filters.role);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <DataTable
      title="Users"
      data={usersResult.data}
      total={usersResult.total}
      columns={[
        {
          header: "Name",
          accessor: "name",
          render: (item) => item.name,
        },
        { header: "Email", accessor: "email" },
        {
          header: "Role",
          accessor: "role",
          render: (item) => (
            <Badge
              variant={getBadgeVariant(item.role)}
              className={cn(
                "capitalize transition-transform duration-200 hover:scale-105",
                {
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300":
                    item.role === "admin",
                  "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300":
                    item.role === "user",
                },
              )}
            >
              {item.role}
            </Badge>
          ),
        },
        {
          header: "Email Verified",
          accessor: (item) =>
            item.emailVerified
              ? formatDate(item.emailVerified)
              : "Not Verified",
        },
      ]}
      filters={[
        {
          key: "role",
          label: "Role",
          options: [
            { value: "all", label: "All Roles" },
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
            { value: "business", label: "Business" },
          ],
        },
      ]}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
      page={page}
      limit={limit}
    />
  );
};
