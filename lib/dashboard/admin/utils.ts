import { add, format } from "date-fns";

export function formatDate(date: string | Date): string {
  return format(add(new Date(date), { hours: 5, minutes: 30 }), "MMM dd, yyyy");
}

export function getBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" {
  switch (status.toLowerCase()) {
    case "published":
    case "completed":
      return "default";
    case "draft":
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
}
