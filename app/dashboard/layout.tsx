import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const adminData = {
  navMain: [
    {
      title: "Basic",
      show: true,
      items: [
        { title: "Home", url: "/" },
        { title: "Your Profile", url: "/user/profile" },
        { title: "Dashboard", url: "/dashboard/admin" },
      ],
    },
    {
      title: "Users Management",
      show: true,
      items: [{ title: "All Users", url: "/dashboard/admin/users/all" }],
    },
    {
      title: "Businesses Management",
      show: true,
      items: [
        { title: "All Businesses", url: "/dashboard/admin/businesses/all" },
      ],
    },
  ],
};

const businessData = {
  navMain: [
    {
      title: "Basic",
      show: true,
      items: [
        { title: "Home", url: "/" },
        { title: "Your Profile", url: "/user/profile" },
        { title: "Dashboard", url: "/dashboard/organiser" },
      ],
    },
    {
      title: "Event Management",
      show: true,
      items: [
        { title: "Create Event", url: "/dashboard/organiser/create" },
        { title: "All Events", url: "/dashboard/organiser/events" },
        { title: "Scan Event Pass", url: "/dashboard/organiser/scanner" },
      ],
    },
    {
      title: "Booking Management",
      show: true,
      items: [{ title: "All Bookings", url: "/dashboard/organiser/bookings" }],
    },
  ],
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) return;

  return (
    <div className="flex min-h-[80svh] w-full flex-col items-center justify-center">
      <SidebarProvider>
        <AppSidebar
          data={session?.user?.role === "admin" ? adminData : businessData}
          user={session?.user}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 md:px-10">
            <SidebarTrigger className="-ml-1" />
            <ul className="flex items-center space-x-2">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:bg-transparent"
                asChild
              >
                <Link href="/user/profile">
                  {session?.user?.image ? (
                    <Image
                      src={session?.user?.image}
                      width={1000}
                      height={1000}
                      fetchPriority="high"
                      priority
                      className="h-8 w-8 rounded-full"
                      alt={session?.user?.name ?? "User"}
                    />
                  ) : (
                    <AvatarFallback className="h-9 w-9">
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </AvatarFallback>
                  )}
                </Link>
              </Button>
            </ul>
          </header>
          <div className="flex flex-1 flex-col gap-4 px-6 py-10 pt-5 md:px-10">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
