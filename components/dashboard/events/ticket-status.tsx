import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { TicketStatusPieChart } from "@/components/dashboard/events/charts";

export function TicketStatusCard({
  ticketStatus,
  className,
}: {
  ticketStatus: Array<{ status: string; count: number }>;
  className?: string;
}) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <PieChart className="h-5 w-5 flex-shrink-0" />
          Ticket Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TicketStatusPieChart data={ticketStatus} />
      </CardContent>
    </Card>
  );
}
