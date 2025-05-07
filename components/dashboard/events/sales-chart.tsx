import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { SalesChart } from "@/components/dashboard/events/charts";

export function SalesChartCard({
  salesData,
  className,
}: {
  salesData: Array<{ date: string; revenue: number; ticketsSold: number }>;
  className?: string;
}) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Activity className="h-5 w-5 flex-shrink-0" />
          Sales Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SalesChart data={salesData} />
      </CardContent>
    </Card>
  );
}
