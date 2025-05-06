import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { User } from "next-auth";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Props {
  data: {
    navMain: {
      title: string;
      show?: boolean;
      items: {
        title: string | undefined;
        url: string;
      }[];
    }[];
  };
  user: User;
}

export function AppSidebar({ data, user }: Props) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup className="py-2">
          <SidebarGroupContent className="relative">
            <h3 className="text-xl font-semibold tracking-wider">
              <Link href="/" className="font-firaSans">
                QRMang
              </Link>
            </h3>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map(
          (item) =>
            item.show && (
              <SidebarGroup key={item.title}>
                {item.title !== "" && (
                  <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map(
                      (item) =>
                        item.title && (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <Link href={item.url}>{item.title}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ),
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ),
        )}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <div className="flex items-center justify-center p-4">
          {user?.image?.startsWith("https") ? (
            <Image
              src={user?.image}
              width={1000}
              height={1000}
              fetchPriority="high"
              priority
              className="h-8 w-8 rounded-full"
              alt={user?.name ?? "User"}
            />
          ) : (
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
