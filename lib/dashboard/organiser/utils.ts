import { add, format } from "date-fns";

export function formatDate(date: string | Date): string {
  return format(add(new Date(date), { hours: 5, minutes: 30 }), "MMM dd, yyyy");
}

export function calculateTicketsSold(
  ticketTypes: { seatsAvailable: number; seatsRemaining: number }[],
): number {
  return ticketTypes.reduce(
    (acc, type) => acc + (type.seatsAvailable - type.seatsRemaining),
    0,
  );
}

export function getEventStatus(publishedAt: Date | null): string {
  return publishedAt ? "Published" : "Draft";
}

export function getBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "completed":
    case "Published":
      return "default";
    case "pending":
    case "Draft":
      return "secondary";
    default:
      return "destructive";
  }
}

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}