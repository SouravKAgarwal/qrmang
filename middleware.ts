import NextAuth from "next-auth";
import { AuthConfig } from "./auth.config";

export default NextAuth(AuthConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
