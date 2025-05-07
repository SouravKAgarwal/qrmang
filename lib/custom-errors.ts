import { AuthError } from "next-auth";

export class OAuthAccountAlreadyLinkedError extends AuthError {
  static type = "OAuthAccountAlreadyLinkedError";
}

export class EmailNotVerifiedError extends AuthError {
  static type = "EmailNotVerifiedError";
}
