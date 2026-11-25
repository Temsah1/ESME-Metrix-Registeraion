import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/register");
    revalidatePath("/dashboard");
    revalidatePath("/member");
    revalidatePath("/success");
    revalidatePath("/share/[ticketId]", "page");
    revalidatePath("/ticket/[id]", "page");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
