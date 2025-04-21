"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

type TicketSalesData = { date: string; ticketsSold: number }[];

export function TicketSalesChart({ data }: { data: TicketSalesData }) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-gray-100 transition-all duration-500 hover:shadow-2xl",
        "border border-indigo-200/50 dark:border-indigo-800/50 dark:from-indigo-950/70 dark:to-gray-900",
        "animate-fade-in",
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
          Ticket Sales Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="h-[280px] sm:h-[320px] lg:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
                className="dark:stroke-gray-700/50"
                opacity={0.7}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                className="dark:[&>line]:stroke-gray-600 dark:[&>text]:fill-gray-300"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                className="dark:[&>line]:stroke-gray-600 dark:[&>text]:fill-gray-300"
                tickFormatter={(value) => value.toLocaleString()}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#111827",
                }}
                itemStyle={{ color: "#111827", fontWeight: "500" }}
                labelStyle={{
                  color: "#111827",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
                formatter={(value: number) => [
                  `${value.toLocaleString()} tickets`,
                  "Tickets Sold",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                cursor={{
                  stroke: "#6366f1",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="ticketsSold"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#fillGradient)"
                activeDot={{
                  r: 7,
                  fill: "#ffffff",
                  stroke: "#6366f1",
                  strokeWidth: 3,
                }}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <div className="group-hover:opacity-8 absolute inset-0 bg-indigo-500 opacity-0 transition-opacity duration-500" />
    </Card>
  );
}
