import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";
import * as v from "valibot";
import { SigninSchema } from "./validators/signin-validator";
import { findUserByEmail } from "./resources/user-queries";
import { OAuthAccountAlreadyLinkedError } from "./lib/custom-errors";
import { AuthConfig } from "./auth.config";

const { providers: authConfigProviders, ...authConfigRest } = AuthConfig;

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = v.safeParse(SigninSchema, credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.output;

          const user = await findUserByEmail(email);

          if (!user) return null;
          if (!user.password) throw new OAuthAccountAlreadyLinkedError();

          const passwordMatch = await argon2.verify(user.password, password);

          if (passwordMatch) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
        }

        return null;
      },
    }),
  ],
});

export const { signIn, auth, signOut, handlers } = nextAuth;
