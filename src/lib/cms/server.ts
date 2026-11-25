import { createClient } from "@supabase/supabase-js";
import { DEFAULT_FULL_CMS } from "@/lib/cms/defaults";
import { buildFullCmsData } from "@/lib/cms/parse";
import type { FullCmsData } from "@/lib/cms/types";

/**
 * Fetches live CMS rows from `site_content` on the server with graceful default fallbacks.
 */
export async function getFullCmsData(): Promise<FullCmsData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return DEFAULT_FULL_CMS;
  }

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) {
      return DEFAULT_FULL_CMS;
    }

    const rawMap = Object.fromEntries(
      data.map((row: { key: string; value: string }) => [row.key, row.value])
    );
    return buildFullCmsData(rawMap);
  } catch {
    return DEFAULT_FULL_CMS;
  }
}
