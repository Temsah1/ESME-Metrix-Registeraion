import { NextRequest, NextResponse } from "next/server";
import { verifyMemberLogin } from "@/lib/registrants/public-pass";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = typeof body?.identifier === "string" ? body.identifier : "";
    const nationalId = typeof body?.nationalId === "string" ? body.nationalId : "";

    const result = await verifyMemberLogin({ identifier, nationalId });

    if (result.status === "invalid") {
      return NextResponse.json(
        {
          error:
            "Please enter a valid registered Phone Number (or Email) and your 14-digit Egyptian National ID.",
        },
        { status: 400 }
      );
    }

    if (result.status === "not_found") {
      return NextResponse.json(
        {
          error:
            "No registration found matching these details. Please verify your Phone Number and National ID, or register now.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(result.pass);
  } catch (err) {
    console.error("Error in POST /api/member/login:", err);
    return NextResponse.json(
      { error: "Unable to verify member credentials right now. Please try again." },
      { status: 500 }
    );
  }
}
