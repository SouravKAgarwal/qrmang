import * as v from "valibot";

const QrCodeOptionsSchema = v.pipe(
  v.object({
    image: v.any(),
    imageOptions: v.object({
      hideBackgroundDots: v.boolean(),
      imageSize: v.number(),
      crossOrigin: v.string(),
      saveAsBlob: v.boolean(),
    }),
    qrOptions: v.object({
      errorCorrectionLevel: v.string(),
    }),
    dotsOptions: v.object({
      color: v.string(),
      type: v.string(),
    }),
    backgroundOptions: v.object({
      color: v.string(),
    }),
    cornersSquareOptions: v.object({
      color: v.string(),
      type: v.string(),
    }),
    cornersDotOptions: v.object({
      color: v.string(),
      type: v.string(),
    }),
  }),
);

export const QrCodeCreationSchema = v.pipe(
  v.object({
    userId: v.pipe(
      v.string("Invalid user ID"),
      v.nonEmpty("User ID is required"),
    ),
    title: v.pipe(
      v.string("Invalid title"),
      v.nonEmpty("QR title is required"),
    ),
    qrImage: v.pipe(
      v.string("Invalid QR image"),
      v.nonEmpty("QR image is required"),
    ),
    options: QrCodeOptionsSchema,
    originalUrl: v.pipe(
      v.string("Invalid URL"),
      v.url("Enter a valid URL"),
      v.nonEmpty("URL is required"),
    ),
    shortUrl: v.pipe(
      v.string("Invalid URL"),
      v.url("Enter a valid URL"),
      v.nonEmpty("URL is required"),
    ),
    passwordProtected: v.boolean(),
    passwordHash: v.optional(v.string()),
    expiresAt: v.optional(v.date()),
  }),
);

export type QrCodeCreationInput = v.InferInput<typeof QrCodeCreationSchema>;
