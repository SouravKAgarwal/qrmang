import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, Calendar, Users } from "lucide-react";

type Stats = {
  totalUsers: number;
  totalBusinesses: number;
};

export function StatsCards({ metrics }: { metrics: Stats }) {
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const statItems = [
    {
      label: "Total Users",
      value: formatNumber(metrics.totalUsers),
      icon: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      label: "Total Businesses",
      value: formatNumber(metrics.totalBusinesses),
      icon: (
        <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <Card
          key={index}
          className={cn(
            "border-gray-200 bg-gradient-to-br from-white to-gray-50 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800",
            "transform transition-all duration-300 hover:scale-105 hover:shadow-lg",
          )}
          aria-label={`${item.label}: ${item.value}`}
        >
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="flex-shrink-0">{item.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                {item.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
