import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import {
  DemographicBarChart,
  DonutChart,
} from "@/components/dashboard/events/charts";

export function AttendeeDemographicsCard({
  demographics,
}: {
  demographics: {
    gender: Array<{ name: string; value: number }>;
    ageGroups: Array<{ name: string; value: number }>;
  };
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Users className="h-5 w-5 flex-shrink-0" />
          Attendee Demographics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-medium sm:mb-4 sm:text-base">
              Gender Distribution
            </h3>
            <DonutChart data={demographics.gender} />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium sm:mb-4 sm:text-base">
              Age Groups
            </h3>
            <DemographicBarChart data={demographics.ageGroups} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
