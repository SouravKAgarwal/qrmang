"use client";

import { Download, Share2, X } from "lucide-react";
import { useState } from "react";

const Gallery = ({
  pamphletUrl,
  title,
}: {
  pamphletUrl: string;
  title: string;
}) => {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleImageClick = () => {
    setIsEnlarged(true);
  };

  const handleClose = () => {
    setIsEnlarged(false);
  };

  const getDownloadUrl = (url: string) => {
    if (url.includes("cloudinary.com") && !url.includes("fl_attachment")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }
    return url;
  };

  const handleDownload = () => {
    const downloadUrl = getDownloadUrl(pamphletUrl);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(pamphletUrl, { mode: "cors" });
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();

        const mimeType = response.headers.get("content-type") || "image/jpeg";
        const fileExtension = mimeType.includes("png") ? "png" : "jpg";

        const file = new File([blob], `${title}.${fileExtension}`, {
          type: mimeType,
        });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title,
            files: [file],
          });
        } else {
          throw new Error("File sharing not supported");
        }
      } catch (error) {
        console.error("Error sharing image:", error);
        try {
          await navigator.share({
            title: title,
            url: pamphletUrl,
          });
        } catch (urlError) {
          console.error("Fallback URL sharing failed:", urlError);
          alert("Sharing failed. Copy the URL manually: " + pamphletUrl);
        }
      }
    } else {
      alert(
        "Sharing is not supported in your browser. Copy the URL manually: " +
          pamphletUrl,
      );
    }
  };

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
      <div className="group relative h-auto w-40 overflow-hidden rounded-lg">
        <img
          src={pamphletUrl}
          alt={title}
          className="h-full w-full cursor-pointer object-cover"
          onClick={handleImageClick}
        />
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            className="rounded-full bg-gray-800 p-1 text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            className="rounded-full bg-gray-800 p-1 text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isEnlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleClose}
        >
          <div className="relative max-h-[600px] max-w-[400px] overflow-auto">
            <img
              src={pamphletUrl}
              alt={title}
              className="h-auto w-full object-contain"
            />
            <button
              className="absolute right-2 top-2 rounded-full bg-red-800 p-1 text-white hover:bg-red-700"
              onClick={handleClose}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
