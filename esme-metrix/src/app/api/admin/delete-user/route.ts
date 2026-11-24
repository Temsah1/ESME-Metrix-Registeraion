import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_request: NextRequest) {
  return NextResponse.json(
    { error: "Deletion is disabled until server-side admin authorization is configured." },
    { status: 403 }
  );
}
