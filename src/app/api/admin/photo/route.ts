import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify authenticated admin session
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    // 2. Extract path parameter
    const searchParams = request.nextUrl.searchParams;
    let path = searchParams.get("path") || searchParams.get("url") || "";

    if (!path) {
      return NextResponse.json({ error: "Missing photo path" }, { status: 400 });
    }

    // Clean up if full URL was passed
    if (path.includes("/photos/")) {
      path = path.split("/photos/")[1];
    }
    path = path.replace(/^\/+/, "");

    const supabase = createAdminClient();

    // 3. Attempt direct stream via service role key
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("photos")
      .download(path);

    if (!downloadError && fileData) {
      const buffer = await fileData.arrayBuffer();
      const contentType = fileData.type || (path.endsWith(".png") ? "image/png" : "image/jpeg");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 4. Fallback to signed URL redirect
    const { data: signedData, error: signedError } = await supabase.storage
      .from("photos")
      .createSignedUrl(path, 300);

    if (signedData?.signedUrl) {
      return NextResponse.redirect(signedData.signedUrl, 307);
    }

    console.error("Failed to retrieve admin photo:", { path, downloadError, signedError });
    return NextResponse.json({ error: "Photo not found or inaccessible" }, { status: 404 });
  } catch (err) {
    console.error("Admin photo route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
