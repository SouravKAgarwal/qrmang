import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect("/dashboard/admin");
  } else if (session?.user?.role === "business") {
    redirect("/dashboard/organiser");
  } else {
    redirect("/");
  }
}
