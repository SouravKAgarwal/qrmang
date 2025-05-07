import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type User } from "@/types";
import { Building2, User as UserIcon } from "lucide-react";

export function UsersTable({ users }: { users: User[] }) {
  return (
    <Card
      className={cn(
        "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "transition-all duration-300 hover:shadow-md",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
          Users
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 px-4">
        <div className="space-y-4 py-4 md:hidden">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No users found.
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "rounded-lg bg-white p-4 dark:bg-gray-800",
                  "border border-gray-200 dark:border-gray-700",
                  "transition-colors duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30",
                )}
                aria-label={`User: ${user.name}`}
              >
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
                <div className="mt-1 text-xs uppercase text-gray-500 dark:text-gray-400">
                  {user.role}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto pb-2 md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "transition-colors duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30",
                      "cursor-pointer",
                    )}
                    aria-label={`User: ${user.name}`}
                  >
                    <td className="px-4 py-3 text-xs font-medium text-indigo-900 dark:text-indigo-100">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {user.role === "user" ? (
                        <UserIcon className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
