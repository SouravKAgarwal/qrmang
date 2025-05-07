"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  formatDate,
  calculateTicketsSold,
  getEventStatus,
  getBadgeVariant,
} from "@/lib/dashboard/organiser/utils";
import { events } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Event = typeof events.$inferSelect;

export function RecentEventsTable({ events }: { events: Event[] }) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:shadow-xl",
        "border border-gray-200 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800",
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
          Recent Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-transparent dark:border-gray-700">
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Title
                </TableHead>
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Venue
                </TableHead>
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Start Date
                </TableHead>
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No recent events found.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow
                    key={event.id}
                    className={cn(
                      "transition-colors duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30",
                      "border-b border-gray-100 last:border-0 dark:border-gray-800",
                    )}
                  >
                    <TableCell className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <Link
                        target="_blank"
                        href={`/dashboard/events/${event.id}`}
                      >
                        {event.title}
                      </Link>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-900 dark:text-gray-100">
                      {event.venue}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(event.eventStart)}
                    </TableCell>
                    <TableCell className="py-4 text-sm">
                      <Badge
                        variant={getBadgeVariant(
                          getEventStatus(event.publishedAt),
                        )}
                        className={cn(
                          "transition-transform duration-200 hover:scale-105",
                          {
                            "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300":
                              getEventStatus(event.publishedAt) === "Published",
                            "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300":
                              getEventStatus(event.publishedAt) === "Draft",
                          },
                        )}
                      >
                        {getEventStatus(event.publishedAt)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
