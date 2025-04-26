import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { auth } from "@/auth";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-black px-6 py-2 text-white md:px-10">
      <h3 className="text-xl font-semibold tracking-wider">
        <Link href="/" className="font-firaSans">
          QRMang
        </Link>
      </h3>

      <ul className="flex items-center space-x-2">
        {/* <ThemeToggle /> */}
        {session?.user ? (
          <li>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 hover:bg-transparent"
              asChild
            >
              <Link href="/user/profile">
                {session?.user?.image?.startsWith("https") ? (
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
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-black">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Link>
            </Button>
          </li>
        ) : (
          <>
            <li>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-black"
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
