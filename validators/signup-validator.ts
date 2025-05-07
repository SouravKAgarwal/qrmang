import * as v from "valibot";

export const SignupSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string(),
      v.nonEmpty("Please enter your name"),
      v.minLength(6, "Name must be at least 6 characters")
    ),
    email: v.pipe(
      v.string("Please enter a valid email"),
      v.nonEmpty("Please enter your email"),
      v.email("Please enter a valid email")
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty("Please enter your password"),
      v.minLength(6, "Password must be at least 6 characters")
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty("Please enter your password")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match"
    ),
    ["confirmPassword"]
  )
);

export type SignupInput = v.InferInput<typeof SignupSchema>;
