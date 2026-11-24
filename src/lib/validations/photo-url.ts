export function isAllowedPhotoUrl(url: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || typeof url !== "string") return false;
  const normalizedBase = base.replace(/\/$/, "");
  return url.startsWith(`${normalizedBase}/storage/v1/object/public/photos/`);
}