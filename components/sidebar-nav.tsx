import Link from "next/link";
import { Button } from "./ui/button";
import { Home, LayoutDashboardIcon, Ticket } from "lucide-react";
import { GoPerson } from "react-icons/go";
import { Signout } from "./signout-button";
import { useSession } from "next-auth/react";

export function SidebarNav({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const { data: session } = useSession();
  const items = [
    { icon: Home, title: "Home", href: "/", show: true },
    {
      icon: LayoutDashboardIcon,
      title: "Dashboard",
      href: "/dashboard",
      show: session?.user?.role !== "user",
    },
    { icon: GoPerson, title: "Profile", href: "/user/profile", show: true },
    {
      icon: Ticket,
      title: "Your Bookings",
      href: "/user/bookings",
      show: true,
    },
  ];
  return (
    <nav
      className={`flex h-full flex-col justify-between bg-background lg:bg-transparent transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <ul className="space-y-2 lg:space-y-1">
        <li className="mb-4 flex w-full items-center justify-start lg:hidden">
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="w-full justify-start pt-3 text-xl font-semibold tracking-wider hover:bg-transparent"
          >
            <Link href="/" className="font-firaSans">
              QRMang
            </Link>
          </Button>
        </li>
        {items.map(
          (item) =>
            item.show && (
              <li
                key={item.title}
                className="flex w-full items-center justify-start"
                onClick={toggleSidebar}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="w-full justify-start text-lg hover:bg-transparent"
                >
                  <Link href={item.href} className="space-x-1">
                    <item.icon className="h-7 w-7 lg:h-5 lg:w-5" />
                    <span className="font-medium lg:text-sm">{item.title}</span>
                  </Link>
                </Button>
              </li>
            ),
        )}
      </ul>

      <div className="px-8 pb-6">
        <Signout />
      </div>
    </nav>
  );
}
