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
  formatCurrency,
  getBadgeVariant,
} from "@/lib/dashboard/organiser/utils";
import { bookings } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

type Booking = typeof bookings.$inferSelect & { eventTitle: string };

export function RecentBookingsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:shadow-xl",
        "border border-gray-200 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800",
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-transparent dark:border-gray-700">
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Booking Reference
                </TableHead>
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Event
                </TableHead>
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tickets
                </TableHead>
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </TableHead>
                <TableHead className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No recent bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className={cn(
                      "transition-colors duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30",
                      "border-b border-gray-100 last:border-0 dark:border-gray-800",
                    )}
                  >
                    <TableCell className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {booking.bookingReference}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {booking.eventTitle}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.ticketInfo.totalTickets}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-semibold text-green-600 dark:text-green-100">
                      {formatCurrency(booking.ticketInfo.totalAmount)}
                    </TableCell>
                    <TableCell className="py-4 text-sm">
                      <Badge
                        variant={getBadgeVariant(booking.paymentStatus)}
                        className={cn(
                          "transition-transform duration-200 hover:scale-105",
                          {
                            "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300":
                              booking.paymentStatus === "completed",
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300":
                              booking.paymentStatus === "pending",
                            "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300":
                              booking.paymentStatus === "failed",
                          },
                        )}
                      >
                        {booking.paymentStatus}
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
