import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mt-1 text-xs font-medium sm:text-sm">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="line-clamp-1 text-ellipsis text-xl font-bold">
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
