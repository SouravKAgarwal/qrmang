import * as v from "valibot";

export const SigninSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string("Please enter a valid email"),
      v.nonEmpty("Please enter your email"),
      v.email("Please enter a valid email")
    ),
    password: v.pipe(v.string(), v.nonEmpty("Please enter your password")),
  })
);

export type SigninInput = v.InferInput<typeof SigninSchema>;
