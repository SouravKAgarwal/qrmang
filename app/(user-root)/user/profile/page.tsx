import { auth } from "@/auth";
import { ProfileForm } from "@/components/profile-form";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) return;

  return <div className="py-6">{!!user && <ProfileForm user={user} />}</div>;
}
