import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dashboard/admin/utils";

export function RecentBookingsCard({
  bookings,
}: {
  bookings: Array<{
    id: string;
    email: string;
    tickets: number;
    date: string;
    amount: number;
    status: string;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {booking.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{booking.email}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.tickets} tickets • {formatDate(booking.date)}
                </p>
              </div>
              <Badge
                variant={
                  booking.status === "completed" ? "default" : "secondary"
                }
              >
                ₹{booking.amount}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
