import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_FULL_CMS } from "@/lib/cms/defaults";
import { buildFullCmsData } from "@/lib/cms/parse";
import type { FullCmsData } from "@/lib/cms/types";

/**
 * Fetches live CMS rows from `site_content` on the server with caching disabled
 * so admin edits appear immediately on public routes.
 */
export async function getFullCmsData(): Promise<FullCmsData> {
  noStore();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return DEFAULT_FULL_CMS;
  }

  try {
    const supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    });
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) {
      if (error) {
        console.error("getFullCmsData Supabase query failed:", error.message);
      }
      return DEFAULT_FULL_CMS;
    }

    const rawMap = Object.fromEntries(
      data.map((row: { key: string; value: string }) => [row.key, row.value])
    );
    return buildFullCmsData(rawMap);
  } catch (err) {
    console.error("getFullCmsData exception:", err);
    return DEFAULT_FULL_CMS;
  }
}
