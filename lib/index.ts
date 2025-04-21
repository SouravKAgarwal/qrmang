"use server";

import { uploadImage } from "@/actions/image-upload-action";

export const uploadImageUrl = async (qrImage: string): Promise<string> => {
  const uploadResponse = await uploadImage(qrImage);
  if (uploadResponse.url) {
    return uploadResponse.url;
  } else {
    return "";
  }
};
