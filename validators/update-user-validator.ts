import * as v from "valibot";

export const UpdateUserInfoSchema = v.object({
  id: v.pipe(
    v.string("Your ID must be a string"),
    v.uuid("Your ID must be a valid UUID"),
  ),
  name: v.pipe(
    v.string("Name must be a string"),
    v.nonEmpty("Name cannot be empty"),
    v.minLength(6, "Name must have 6 characters or more"),
  ),
  image: v.pipe(
    v.string("Image must be a string"),
    v.nonEmpty("Image cannot be empty"),
  ),
});

export type UpdateUserInfoInput = v.InferInput<typeof UpdateUserInfoSchema>;
