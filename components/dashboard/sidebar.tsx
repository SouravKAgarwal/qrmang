import { Home, QrCode, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const menuItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Scanner", icon: QrCode, path: "/dashboard/scanner" },
];

export default function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <nav
      className={`flex h-full flex-col justify-between bg-background lg:bg-transparent transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <ul className="space-y-2 px-4">
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
        {menuItems.map((item) => (
          <li
            key={item.name}
            className="flex w-full items-center justify-start"
            onClick={toggleSidebar}
          >
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="w-full justify-start text-lg hover:bg-transparent"
            >
              <Link href={item.path} className="space-x-1">
                <item.icon className="h-7 w-7 lg:h-5 lg:w-5" />
                <span className="font-medium lg:text-sm">{item.name}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="p-4">
        <Button variant="ghost" size="sm">
          <Settings />
          Settings
        </Button>
      </div>
    </nav>
  );
}
