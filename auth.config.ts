import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "./drizzle";
import { authVerifyEmailAction } from "./actions/auth-verify-email-action";
import * as schema from "./drizzle/schema";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { NextAuthConfig } from "next-auth";
import { EmailNotVerifiedError } from "./lib/custom-errors";

export const AuthConfig = {
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    authenticatorsTable: schema.authenticators,
    verificationTokensTable: schema.verificationTokens,
    sessionsTable: schema.sessions,
  }),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 1 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/user");
      const isOnAdminDashboard =
        nextUrl.pathname.startsWith("/dashboard/admin");
      const isOnBusinessDashboard = nextUrl.pathname.startsWith(
        "/dashboard/organiser",
      );
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      const isOnBooking = nextUrl.pathname.startsWith("/events/booking");
      const bookingVerify = nextUrl.pathname.startsWith(
        "/events/booking/verify",
      );

      const callbackUrl = encodeURIComponent(nextUrl.href);

      if (isOnProfile || isOnBooking) {
        if (isLoggedIn) return true;
        return Response.redirect(
          new URL(`/auth/sign-in?callbackUrl=${callbackUrl}`, nextUrl),
        );
      }

      if (bookingVerify) {
        if (isLoggedIn && auth?.user?.role === "business") return true;
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isOnAdminDashboard) {
        if (isLoggedIn && auth?.user?.role === "admin") return true;
        if (isLoggedIn && auth?.user?.role === "business")
          return Response.redirect(new URL("/dashboard/organiser", nextUrl));
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isOnBusinessDashboard) {
        if (isLoggedIn && auth?.user?.role === "business") return true;
        if (isLoggedIn && auth?.user?.role === "admin")
          return Response.redirect(new URL("/dashboard/admin", nextUrl));
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isOnAuth) {
        if (!isLoggedIn) return true;
        const redirectUrl = nextUrl.searchParams.get("callbackUrl") || "/";
        return Response.redirect(new URL(redirectUrl, nextUrl));
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (user?.id) token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.picture = user.image;
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.picture = session.user.image ?? token.picture;
        token.role = session.user.role ?? token.role;
        token.id = session.user.id ?? token.id;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.image = token.picture;

      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }

      if (account?.provider === "github") {
        return true;
      }

      if (account?.provider === "credentials") {
        if (user.emailVerified) {
          return true;
        } else if (user.email) {
          await authVerifyEmailAction(user.email);
          throw new EmailNotVerifiedError();
        }
        return false;
      }

      return false;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (["google", "github"].includes(account.provider)) {
        if (user.email) await authVerifyEmailAction(user.email);
      }
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
