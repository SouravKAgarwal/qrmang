"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(
  file: string,
): Promise<{ url?: string; error?: string }> {
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          file,
          { folder: "uploads" },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          },
        );
      },
    );

    return { url: result.secure_url };
  } catch (error) {
    return { error: "Upload failed" };
  }
}
