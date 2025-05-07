import { auth } from "@/auth";
import { ProfileForm } from "@/components/profile-form";
import { Separator } from "@/components/ui/separator";
import db from "@/drizzle";
import { businesses } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) return;

  const business = await db
    .select()
    .from(businesses)
    .where(eq(businesses.ownerId, user?.id))
    .then((res) => res[0]);

  return (
    <div className="py-6">
      {/* <div>
        <h3 className="text-2xl font-bold">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator /> */}
      {!!user && <ProfileForm user={user} business={business} />}
    </div>
  );
}
