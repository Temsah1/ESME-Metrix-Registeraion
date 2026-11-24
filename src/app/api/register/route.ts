import { NextRequest, NextResponse, after } from "next/server";
import { completeRegistrationSchema } from "@/lib/validations/registration";
import { isAllowedPhotoUrl } from "@/lib/validations/photo-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateRegistrationId, REGISTRATION_ID_REGEX } from "@/lib/registration-id";
import { signQrPayload } from "@/lib/qr";
import { buildConfirmationEmail, sendConfirmationEmail } from "@/lib/email/confirmation";
import QRCode from "qrcode";
import crypto from "crypto";

const MAX_ID_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = completeRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    if (!isAllowedPhotoUrl(data.idPhotoUrl) || !isAllowedPhotoUrl(data.karnetPhotoUrl)) {
      return NextResponse.json(
        { error: "Document photos must be uploaded through the registration form." },
        { status: 400 }
      );
    }

    if (data.avatarUrl && !isAllowedPhotoUrl(data.avatarUrl)) {
      return NextResponse.json(
        { error: "Personal badge photo must be uploaded through the registration form." },
        { status: 400 }
      );
    }

    if (!process.env.QR_SIGNING_SECRET) {
      console.error("QR_SIGNING_SECRET is not configured; refusing registration.");
      return NextResponse.json(
        { error: "Registration is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const supabase = createAdminClient();

    const { data: existingUser } = await supabase
      .from("registrants")
      .select("id, phone, email")
      .or(`phone.eq.${data.phone},email.eq.${data.email.toLowerCase()}`)
      .limit(1)
      .maybeSingle();

    if (existingUser) {
      const isPhoneDuplicate = existingUser.phone === data.phone;
      return NextResponse.json(
        {
          error: isPhoneDuplicate
            ? "A registration already exists with this phone number."
            : "A registration already exists with this email address.",
        },
        { status: 409 }
      );
    }

    const registrantUuid = crypto.randomUUID();
    const email = data.email.toLowerCase();

    let insertError: { code?: string; message?: string } | null = null;
    let registrationId = "";
    let qrBase64 = "";

    for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt++) {
      registrationId = generateRegistrationId();
      const payload = signQrPayload(registrationId, registrantUuid);

      qrBase64 = await QRCode.toDataURL(JSON.stringify(payload), {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 400,
        color: { dark: "#000000", light: "#FFFFFF" },
      });

      const { error } = await supabase.from("registrants").insert([
        {
          id: registrantUuid,
          full_name: data.fullName,
          phone: data.phone,
          email,
<<<<<<< HEAD
          national_id: data.nationalId || null,
          graduation_year: data.graduationYear || null,
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
          university: data.university,
          faculty: data.faculty,
          academic_year: data.academicYear,
          city: data.city,
          job_title: data.jobTitle,
          company: data.company || null,
          id_photo_url: data.idPhotoUrl,
          karnet_photo_url: data.karnetPhotoUrl,
          avatar_url: data.avatarUrl || null,
          qr_code: qrBase64,
          registration_id: registrationId,
          linkedin_shared: false,
        },
      ]);

      if (!error) {
        insertError = null;
        break;
      }

      insertError = error;

      if (error.code === "23505") {
        if (error.message?.includes("registration_id")) {
          continue;
        }
        const field = error.message?.includes("phone") ? "phone number" : "email address";
        return NextResponse.json(
          { error: `A registration already exists with this ${field}.` },
          { status: 409 }
        );
      }

      break;
    }

    if (insertError) {
      console.error("Supabase registration insert error:", insertError);
      return NextResponse.json(
        { error: "Could not save registration. Please try again." },
        { status: 500 }
      );
    }

    const emailContent = buildConfirmationEmail({
      fullName: data.fullName,
      registrationId,
      university: data.university,
<<<<<<< HEAD
      faculty: data.faculty,
      academicYear: data.academicYear,
      graduationYear: data.graduationYear,
      nationalId: data.nationalId,
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      qrDataUrl: qrBase64,
    });

    after(async () => {
      try {
        await sendConfirmationEmail(email, emailContent);
      } catch (emailErr) {
        console.error("Confirmation email dispatch failed:", emailErr);
      }
    });

    return NextResponse.json({
      success: true,
      registration_id: registrationId,
      full_name: data.fullName,
      email: data.email,
      university: data.university,
      avatar_url: data.avatarUrl || null,
      qr_code: qrBase64,
    });
  } catch (error) {
    console.error("Unexpected error in /api/register:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { registration_id, avatar_url } = await request.json();

    if (typeof registration_id !== "string" || !REGISTRATION_ID_REGEX.test(registration_id)) {
      return NextResponse.json(
        { error: "Valid registration_id is required." },
        { status: 400 }
      );
    }

    if (!isAllowedPhotoUrl(avatar_url)) {
      return NextResponse.json(
        { error: "Personal badge photo must be uploaded through the application." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("registrants")
      .update({ avatar_url })
      .eq("registration_id", registration_id)
      .select("registration_id, avatar_url")
      .maybeSingle();

    if (error || !data) {
      console.error("Failed to update avatar_url:", error);
      return NextResponse.json(
        { error: "Registration not found or could not be updated." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration_id: data.registration_id,
      avatar_url: data.avatar_url,
    });
  } catch (err) {
    console.error("Error in PATCH /api/register:", err);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !REGISTRATION_ID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Valid registration_id is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("registrants")
      .select(
        "registration_id, full_name, email, university, faculty, academic_year, job_title, company, qr_code, avatar_url"
      )
      .eq("registration_id", id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("Error in GET /api/register:", err);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
