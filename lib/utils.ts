import { clsx, type ClassValue } from "clsx";
import { format, isEqual, add } from "date-fns";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import html2canvas from "html2canvas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export function formatDateTime(eventStart: string, eventEnd?: string) {
  const parsedStart = new Date(eventStart);
  const parsedEnd = eventEnd ? new Date(eventEnd) : null;

  const adjustedStart = add(parsedStart, { hours: 5, minutes: 30 });
  const adjustedEnd = parsedEnd
    ? add(parsedEnd, { hours: 5, minutes: 30 })
    : null;

  const isSameDay = adjustedEnd && isEqual(adjustedStart, adjustedEnd);
  const isSameMonth =
    adjustedEnd &&
    format(adjustedStart, "MMMM yyyy") === format(adjustedEnd, "MMMM yyyy");

  let dateString;
  if (isSameDay) {
    dateString = format(adjustedStart, "MMMM d, yyyy");
  } else if (isSameMonth) {
    const month = format(adjustedStart, "MMMM");
    const startDay = format(adjustedStart, "d");
    const endDay = adjustedEnd ? format(adjustedEnd, "d") : "";
    const year = format(adjustedStart, "yyyy");

    dateString = `${month} ${startDay}-${endDay}, ${year}`;
  } else {
    const formattedStartDate = format(adjustedStart, "MMMM d, yyyy");
    const formattedEndDate = adjustedEnd
      ? format(adjustedEnd, "MMMM d, yyyy")
      : "";
    dateString = adjustedEnd
      ? `${formattedStartDate} - ${formattedEndDate}`
      : formattedStartDate;
  }

  return {
    date: dateString,
    time: adjustedEnd
      ? `${format(adjustedStart, "h:mm a")} - ${format(adjustedEnd, "h:mm a")}`
      : `${format(adjustedStart, "h:mm a")}`,
  };
}

export async function hashString(string: string) {
  const saltRounds = 10;
  return await bcrypt.hash(string, saltRounds);
}

export const getNonWhiteBoundingBox = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return { top: 0, left: 0, width: canvas.width, height: canvas.height };

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let top = canvas.height,
    left = canvas.width,
    right = 0,
    bottom = 0;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const pos = (y * canvas.width + x) * 4;
      const r = pixels[pos];
      const g = pixels[pos + 1];
      const b = pixels[pos + 2];

      if (r < 250 || g < 250 || b < 250) {
        if (y < top) top = y;
        if (x < left) left = x;
        if (y > bottom) bottom = y;
        if (x > right) right = x;
      }
    }
  }

  return {
    top: Math.max(0, top + 10),
    left: Math.max(0, left - 10),
    width: Math.min(canvas.width, right - left + 20),
    height: Math.min(canvas.height, bottom - top - 10),
  };
};

export const generateImage = async (
  canvasRef: React.RefObject<HTMLDivElement | null>,
): Promise<Blob> => {
  if (!canvasRef.current) throw new Error("No ticket element found");

  const clone = canvasRef.current.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  document.body.appendChild(clone);

  try {
    const images = clone.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve, reject) => {
          const imgClone = new Image();
          imgClone.crossOrigin = "Anonymous";
          imgClone.src = img.src;
          imgClone.onload = resolve;
          imgClone.onerror = reject;
        });
      }),
    );

    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 2,
      logging: true,
      backgroundColor: null,
      removeContainer: true,
      ignoreElements(element) {
        return (
          element.classList.contains("no-export") ||
          element.tagName === "button"
        );
      },
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
    });

    const { top, left, width, height } = getNonWhiteBoundingBox(canvas);
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const croppedCtx = croppedCanvas.getContext("2d");
    if (!croppedCtx) throw new Error("Could not create canvas context");

    croppedCtx.drawImage(canvas, left, top, width, height, 0, 0, width, height);

    return new Promise<Blob>((resolve, reject) => {
      croppedCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }
        },
        "image/png",
        1,
      );
    });
  } finally {
    document.body.removeChild(clone);
  }
};

export const generateBase64Image = async (
  canvasRef: React.RefObject<HTMLDivElement | null>,
): Promise<string> => {
  if (!canvasRef.current) throw new Error("No ticket element found");

  const clone = canvasRef.current.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  document.body.appendChild(clone);

  try {
    const images = clone.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve, reject) => {
          const imgClone = new Image();
          imgClone.crossOrigin = "Anonymous";
          imgClone.src = img.src;
          imgClone.onload = resolve;
          imgClone.onerror = reject;
        });
      }),
    );

    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 2,
      logging: true,
      backgroundColor: null,
      removeContainer: true,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
    });

    const { top, left, width, height } = getNonWhiteBoundingBox(canvas);
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const croppedCtx = croppedCanvas.getContext("2d");
    if (!croppedCtx) throw new Error("Could not create canvas context");

    croppedCtx.drawImage(canvas, left, top, width, height, 0, 0, width, height);

    return croppedCanvas.toDataURL("image/png", 1);
  } finally {
    document.body.removeChild(clone);
  }
};
