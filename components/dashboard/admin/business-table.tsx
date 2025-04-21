import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Business } from "@/types";

export function BusinessesTable({ businesses }: { businesses: Business[] }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:shadow-md",
        "border border-gray-200 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
          Businesses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 px-4">
        <div className="space-y-4 py-4 md:hidden">
          {businesses.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No businesses found.
            </p>
          ) : (
            businesses.map((business) => (
              <div
                key={business.id}
                className={cn(
                  "rounded-lg bg-white p-4 dark:bg-gray-800",
                  "border border-gray-200 dark:border-gray-700",
                  "transition-colors duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30",
                )}
                aria-label={`User: ${business.name}`}
              >
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">
                  {business.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {business?.owner?.name}
                </p>
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
                  Owner
                </th>
              </tr>
            </thead>
            <tbody>
              {businesses.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No businesses found.
                  </td>
                </tr>
              ) : (
                businesses.map((business) => (
                  <tr
                    key={business.id}
                    className={cn(
                      "transition-colors duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30",
                      "cursor-pointer",
                    )}
                    aria-label={`User: ${business.name}`}
                  >
                    <td className="px-4 py-3 text-xs font-medium text-indigo-900 dark:text-indigo-100">
                      {business.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                      {business?.owner?.name}
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
