"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { IndianRupee, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/dashboard/organiser/utils";

type Stats = {
  totalEvents: number;
  totalBookings: number;
  totalTickets: number;
  totalRevenue: number;
};

export function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      <Card
        className={cn(
          "group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-300 hover:shadow-lg",
          "border border-blue-200 dark:border-blue-800 dark:from-blue-900/50 dark:to-blue-950",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Total Events
          </CardTitle>
          <FiCalendar
            className={cn(
              "h-6 w-6 text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-600",
              "dark:text-blue-400 dark:group-hover:text-blue-300",
            )}
          />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {formatNumber(stats.totalEvents)}
          </p>
        </CardContent>
        <div className="absolute inset-0 bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
      </Card>

      <Card
        className={cn(
          "group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 transition-all duration-300 hover:shadow-lg",
          "border border-green-200 dark:border-green-800 dark:from-green-900/50 dark:to-green-950",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-200">
            Total Bookings
          </CardTitle>
          <FiUsers
            className={cn(
              "h-6 w-6 text-green-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-green-600",
              "dark:text-green-400 dark:group-hover:text-green-300",
            )}
          />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">
            {formatNumber(stats.totalBookings)}
          </p>
        </CardContent>
        <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
      </Card>

      <Card
        className={cn(
          "group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 transition-all duration-300 hover:shadow-lg",
          "border border-purple-200 dark:border-purple-800 dark:from-purple-900/50 dark:to-purple-950",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-purple-800 dark:text-purple-200">
            Tickets Sold
          </CardTitle>
          <Ticket
            className={cn(
              "h-6 w-6 text-purple-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-purple-600",
              "dark:text-purple-400 dark:group-hover:text-purple-300",
            )}
          />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {formatNumber(stats.totalTickets)}
          </p>
        </CardContent>
        <div className="absolute inset-0 bg-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
      </Card>

      <Card
        className={cn(
          "group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 transition-all duration-300 hover:shadow-lg",
          "border border-orange-200 dark:border-orange-800 dark:from-orange-900/50 dark:to-orange-950",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-orange-800 dark:text-orange-200">
            Total Revenue
          </CardTitle>
          <IndianRupee
            className={cn(
              "h-6 w-6 text-orange-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-600",
              "dark:text-orange-400 dark:group-hover:text-orange-300",
            )}
          />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </CardContent>
        <div className="absolute inset-0 bg-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
      </Card>
    </div>
  );
}
