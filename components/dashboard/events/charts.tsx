"use client";

import { formatDate } from "@/lib/dashboard/admin/utils";
import { formatCurrency } from "@/lib/dashboard/organiser/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function SalesChart({
  data,
}: {
  data: { date: string; ticketsSold: number; revenue: number }[];
}) {
  return (
    <div className="h-[250px] w-full sm:h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 15,
            right: 10,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.3}
            stroke="hsl(var(--muted-foreground))"
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDate(value)}
            stroke="hsl(var(--foreground))"
            fontSize={12}
          />
          <YAxis yAxisId="left" stroke="hsl(var(--foreground))" fontSize={12} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="font-medium text-foreground">
                      {formatDate(payload[0].payload.date)}
                    </p>
                    <p className="text-primary">Tickets: {payload[0].value}</p>
                    <p className="text-green-600">
                      Revenue: {formatCurrency(Number(payload[1].value))}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              fontSize: "12px",
              color: "hsl(var(--foreground))",
              paddingTop: "10px",
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ticketsSold"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Tickets Sold"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            strokeWidth={2}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TicketStatusPieChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  return (
    <div className="h-[250px] w-full sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          margin={{
            top: 0,
            right: 10,
            left: 30,
            bottom: 10,
          }}
        >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="status"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: "hsl(var(--foreground))" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="hsl(var(--background))"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} tickets`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "4px",
              fontWeight: 500,
              color: "hsl(var(--foreground))",
            }}
            itemStyle={{
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: "10px",
              fontSize: "14px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value) => (
              <span className="text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-[200px] w-full sm:h-[250px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          margin={{
            top: 15,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: "hsl(var(--foreground))" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="hsl(var(--background))"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} attendees`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "4px",
              color: "hsl(var(--foreground))",
            }}
            itemStyle={{
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              fontSize: "12px",
              color: "hsl(var(--foreground))",
              paddingTop: "10px",
            }}
            formatter={(value) => (
              <span className="text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DemographicBarChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-[200px] w-full sm:h-[250px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 15,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.3}
            stroke="hsl(var(--muted-foreground))"
          />
          <XAxis type="number" stroke="hsl(var(--foreground))" />
          <YAxis
            dataKey="name"
            type="category"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => [`${value} attendees`]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "4px",
              color: "hsl(var(--foreground))",
            }}
            itemStyle={{
              color: "hsl(var(--foreground))",
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StackedDemographicChart({
  data,
}: {
  data: {
    ageGroup: string;
    male: number;
    female: number;
    other: number;
  }[];
}) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="ageGroup" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          />
          <Legend />
          <Bar dataKey="male" stackId="a" fill="#0088FE" name="Male" />
          <Bar dataKey="female" stackId="a" fill="#FFBB28" name="Female" />
          <Bar dataKey="other" stackId="a" fill="#FF8042" name="Other" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
