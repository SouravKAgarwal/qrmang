import db from "@/drizzle";
import { businesses } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const id = (await params).id;

  const business = await db
    .select()
    .from(businesses)
    .where(eq(businesses.id, id))
    .limit(1);

  if (!business[0]) {
    notFound();
  }

  const { name, description, businessType } = business[0];

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg">
        <Image
          src={
            businessType === "restaurant"
              ? "/restaurant-hero.jpg"
              : "/event-hero.jpg"
          }
          alt={`${name} hero image`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <h1 className="text-4xl font-bold text-white">{name}</h1>
        </div>
      </div>

      {/* Business Details Card */}
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {businessType === "restaurant" ? "Restaurant" : "Event Company"}{" "}
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Description
            </h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Type
            </h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {businessType === "restaurant" ? "Restaurant" : "Event Company"}
            </p>
          </div>
          <div className="flex justify-end">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href={`/business/${id}/manage`}>Manage Business</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
