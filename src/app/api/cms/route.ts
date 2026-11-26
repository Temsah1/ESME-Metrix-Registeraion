import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { buildFullCmsData, serializeFullCmsToSiteContentRows } from "@/lib/cms/parse";
import { getFullCmsData } from "@/lib/cms/server";
import type { FullCmsData } from "@/lib/cms/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

function getWriteClient(authClient: Awaited<ReturnType<typeof createClient>>) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createAdminClient();
  }
  return authClient;
}

function revalidateAllPublicRoutes() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/register");
  revalidatePath("/dashboard");
  revalidatePath("/member");
  revalidatePath("/success");
  revalidatePath("/share/[ticketId]", "page");
  revalidatePath("/ticket/[id]", "page");
}

export async function GET() {
  try {
    const authClient = await createClient();
    const dbClient = getWriteClient(authClient);
    const { data, error } = await dbClient.from("site_content").select("key, value");

    if (error) {
      return NextResponse.json(
        { error: `Failed to read CMS data from Supabase: ${error.message}` },
        { status: 500, headers: NO_STORE_HEADERS }
      );
    }

    const rawMap = Object.fromEntries(
      (data ?? []).map((row: { key: string; value: string }) => [row.key, row.value])
    );
    const cms = buildFullCmsData(rawMap);

    return NextResponse.json(
      { ok: true, rowCount: (data ?? []).length, cms },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err: unknown) {
    console.error("GET /api/cms failed:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Unable to load CMS data." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await authClient.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: "Admin session expired or unauthorized. Please sign in at /admin again." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const body = (await request.json()) as { cms?: FullCmsData } | FullCmsData | null;
    const cmsPayload: FullCmsData | undefined =
      body && typeof body === "object" && "cms" in body
        ? body.cms
        : (body as FullCmsData | undefined);

    if (!cmsPayload || typeof cmsPayload !== "object" || !cmsPayload.landing || !cmsPayload.form) {
      return NextResponse.json(
        { error: "Invalid CMS payload supplied." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const dbClient = getWriteClient(authClient);
    const updates = serializeFullCmsToSiteContentRows(cmsPayload);

    const { data: upsertedRows, error: upsertErr } = await dbClient
      .from("site_content")
      .upsert(updates, { onConflict: "key" })
      .select("key, updated_at");

    if (upsertErr) {
      return NextResponse.json(
        { error: `Supabase CMS save failed: ${upsertErr.message}` },
        { status: 500, headers: NO_STORE_HEADERS }
      );
    }

    if (!upsertedRows || upsertedRows.length === 0) {
      return NextResponse.json(
        {
          error:
            "Supabase returned 0 updated CMS rows (check site_content RLS policy or SUPABASE_SERVICE_ROLE_KEY).",
        },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    revalidateAllPublicRoutes();
    const freshCms = await getFullCmsData();

    return NextResponse.json(
      {
        ok: true,
        updatedCount: upsertedRows.length,
        cms: freshCms,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err: unknown) {
    console.error("POST /api/cms failed:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Unexpected error while saving CMS changes." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export const PUT = POST;
