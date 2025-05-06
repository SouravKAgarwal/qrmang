import * as v from "valibot";

export const BusinessTypeEnum = v.enum({
  restaurant: "restaurant",
  event: "event",
});

export const BusinessSchema = v.object({
  name: v.pipe(
    v.string("Name must be a string"),
    v.nonEmpty("Name cannot be empty"),
    v.minLength(3, "Name must have 3 characters or more"),
  ),
  description: v.pipe(
    v.string("Description must be a string"),
    v.nonEmpty("Description cannot be empty"),
    v.minLength(10, "Description must have 10 characters or more"),
  ),
  businessType: BusinessTypeEnum,
});

export type BusinessFormInput = v.InferInput<typeof BusinessSchema>;
