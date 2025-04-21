"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

type CategoryData = { name: string; value: number }[];

export function CategoryChart({ data }: { data: CategoryData }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    if (index !== activeIndex) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25; // Position label outside segment
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="#111827"
          className="dark:fill-gray-100"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={14}
          fontWeight={600}
          style={{ pointerEvents: "none" }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:shadow-xl",
        "border border-gray-200 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800",
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
          Event Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart onMouseLeave={onPieLeave}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={30}
                fill="#8884d8"
                animationDuration={800}
                paddingAngle={2}
                onMouseEnter={onPieEnter}
                label={renderCustomLabel}
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-200 hover:opacity-90 focus:opacity-90"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  color: "#1f2937",
                  padding: "8px",
                }}
                itemStyle={{ color: "#1f2937" }}
                formatter={(value: number, name: string) => [
                  `${value} events`,
                  name,
                ]}
                labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconSize={12}
                formatter={(value) => (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
    </Card>
  );
}
