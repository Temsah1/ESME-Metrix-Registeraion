import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAdminPhotoUrl(photoUrl: string | null | undefined): string {
  if (!photoUrl) return "/esme_logo.png";
  if (photoUrl.startsWith("/") && !photoUrl.startsWith("/storage/")) return photoUrl;
  const match = photoUrl.match(/\/photos\/(.+)$/);
  const path = match ? match[1] : photoUrl.replace(/^\/+/, "");
  return `/api/admin/photo?path=${encodeURIComponent(path)}`;
}
