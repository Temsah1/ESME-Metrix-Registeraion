export interface ConfirmationEmailInput {
  fullName: string;
  registrationId: string;
  university: string;
  faculty?: string;
  department?: string;
  academicYear?: string;
  graduationYear?: string;
  nationalId?: string;
  isEsmeMember?: boolean;
  committee?: string | null;
  role?: string | null;
  qrDataUrl: string;
  whatsappUrl?: string;
}

export interface ConfirmationEmail {
  from: string;
  subject: string;
  html: string;
  text: string;
  attachments: {
    filename: string;
    content: string;
    contentId: string;
    contentType: string;
  }[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildConfirmationEmail(input: ConfirmationEmailInput): ConfirmationEmail {
  const from = process.env.RESEND_FROM_EMAIL || "ESME Metrix <onboarding@resend.dev>";
  const eventDate = process.env.EVENT_DATE || "Saturday, December 12, 2026";
  const eventVenue = process.env.EVENT_VENUE || "DRTPC, Cairo University";
  const eventTime = process.env.EVENT_TIME || "09:00 AM – 05:00 PM";
  const whatsappUrl =
    input.whatsappUrl?.trim() || "https://chat.whatsapp.com/KOT8wY8h2lK5p0mNN7NcNW";

  const name = escapeHtml(input.fullName);
  const university = escapeHtml(input.university || "Cairo University");
  const faculty = escapeHtml(input.faculty || "Engineering");
  const department = input.department ? escapeHtml(input.department) : "";
  const facultyDisplay =
    department && department !== faculty ? `${faculty} — ${department}` : faculty;
  const academicYear = escapeHtml(input.academicYear || "Undergraduate");
  const graduationYear = escapeHtml(input.graduationYear || "2026");
  const nationalId = escapeHtml(input.nationalId || "N/A");
  const esmeLine =
    input.isEsmeMember && input.committee
      ? `ESME Member — ${escapeHtml(input.committee)}`
      : input.isEsmeMember
      ? "ESME Member"
      : "";

  const registrationId = escapeHtml(input.registrationId);

  const qrBase64 = input.qrDataUrl.includes(",")
    ? input.qrDataUrl.split(",")[1]
    : input.qrDataUrl;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>ESME METRIX 2026 Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B1928; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B1928; padding: 25px 10px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0F243A; border: 2px solid #D97706; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- Brand Header -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #15304B, #0F243A); padding: 30px 20px 20px 20px; border-bottom: 1px solid rgba(217, 119, 6, 0.3);">
                  <img src="https://esme-metrix-registeration.vercel.app/esme-icon.jpg" alt="ESME METRIX" width="56" height="56" style="width: 56px; height: 56px; border-radius: 9999px; object-fit: cover; display: block; margin: 0 auto 12px auto; border: 2px solid #D97706;" />
                  <div style="font-size: 11px; font-weight: bold; color: #F59E0B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
                    ESME CAIRO UNIVERSITY STUDENT CHAPTER
                  </div>
                  <h1 style="color: #FFFFFF; font-size: 30px; margin: 0; font-weight: 900; letter-spacing: 1px;">
                    ESME <span style="color: #D97706;">METRIX</span> 2026
                  </h1>
                  <p style="color: #94A3B8; font-size: 13px; margin: 6px 0 0 0;">
                    Flagship Materials &amp; Innovation Conference
                  </p>
                </td>
              </tr>

              <!-- Confirmation Status Badge -->
              <tr>
                <td align="center" style="padding: 24px 20px 10px 20px;">
                  <div style="background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; font-weight: bold; font-size: 13px; padding: 7px 18px; border-radius: 30px; display: inline-block;">
                    &#10003; REGISTRATION &amp; ADMISSION CONFIRMED
                  </div>
                </td>
              </tr>

              <!-- Greeting & Announcement -->
              <tr>
                <td style="padding: 10px 30px 20px 30px; color: #E2E8F0; text-align: center;">
                  <h2 style="color: #FFFFFF; font-size: 22px; margin: 0 0 10px 0;">Welcome aboard, ${name}!</h2>
                  <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6; margin: 0;">
                    Your registration for <strong>ESME METRIX 2026</strong> is officially confirmed. Your digital credential and encrypted QR admission pass are ready below.
                  </p>
                </td>
              </tr>

              <!-- QR Code Card Box -->
              <tr>
                <td align="center" style="padding: 0 30px 25px 30px;">
                  <div style="background-color: #15304B; border: 2px dashed rgba(217, 119, 6, 0.5); border-radius: 14px; padding: 25px; text-align: center;">
                    <div style="font-size: 11px; font-weight: bold; color: #F59E0B; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;">
                      OFFICIAL ADMISSION QR BADGE
                    </div>
                    
                    <div style="background-color: #FFFFFF; padding: 12px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                      <img src="cid:metrix-qr" alt="ESME METRIX Admission QR" width="220" height="220" style="width: 220px; height: 220px; display: block; border: 0;" />
                    </div>

                    <div style="font-family: monospace; font-size: 18px; font-weight: bold; color: #F59E0B; margin-top: 14px; letter-spacing: 1px;">
                      ID: ${registrationId}
                    </div>
                    <div style="font-size: 11px; color: #10B981; font-weight: bold; margin-top: 4px;">
                      &#9679; Cryptographically Signed &amp; Verified
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Attendee Details Table -->
              <tr>
                <td style="padding: 0 30px 25px 30px;">
                  <div style="background-color: #11253B; border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 12px; font-weight: bold; color: #D97706; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      Verified Attendee Details
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="color: #CBD5E1; font-size: 13px;">
                      <tr>
                        <td width="38%" style="color: #94A3B8;">Full Name:</td>
                        <td style="color: #FFFFFF; font-weight: bold;">${name}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">University:</td>
                        <td style="color: #FFFFFF;">${university}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">Faculty &amp; Major:</td>
                        <td style="color: #FFFFFF;">${facultyDisplay}</td>
                      </tr>
                      ${
                        esmeLine
                          ? `<tr>
                        <td style="color: #94A3B8;">ESME Chapter:</td>
                        <td style="color: #F59E0B; font-weight: bold;">${esmeLine}</td>
                      </tr>`
                          : ""
                      }
                      <tr>
                        <td style="color: #94A3B8;">Academic &amp; Grad Year:</td>
                        <td style="color: #FFFFFF;">${academicYear} (Class of ${graduationYear})</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">National ID:</td>
                        <td style="color: #FFFFFF;">${nationalId}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">Event Date:</td>
                        <td style="color: #F59E0B; font-weight: bold;">${escapeHtml(eventDate)}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">Venue:</td>
                        <td style="color: #FFFFFF;">${escapeHtml(eventVenue)}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">Check-In Opens:</td>
                        <td style="color: #FFFFFF;">${escapeHtml(eventTime)}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- WhatsApp Community CTA -->
              <tr>
                <td align="center" style="padding: 0 30px 25px 30px;">
                  <div style="background-color: rgba(37, 211, 102, 0.1); border: 1px solid #25D366; border-radius: 12px; padding: 18px; text-align: center;">
                    <p style="color: #FFFFFF; font-size: 13px; font-weight: bold; margin: 0 0 10px 0;">
                      Join the official attendee WhatsApp group for hall updates and workshop announcements:
                    </p>
                    <a href="${escapeHtml(whatsappUrl)}" style="background-color: #25D366; color: #052e16; text-decoration: none; font-weight: 800; font-size: 13px; padding: 10px 22px; border-radius: 20px; display: inline-block;">
                      Join Attendee WhatsApp Group
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Certificate Notice -->
              <tr>
                <td style="padding: 0 30px 25px 30px;">
                  <div style="background-color: rgba(217, 119, 6, 0.1); border-left: 4px solid #D97706; padding: 12px 16px; border-radius: 0 8px 8px 0; color: #F59E0B; font-size: 12px; line-height: 1.5;">
                    &#9733; <strong>Important Reminder:</strong> Please present this QR code on your smartphone (along with your original National ID) at the entrance gate for check-in and to claim your <strong>Official Accredited Attendance Certificate</strong>.
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #0A1929; padding: 20px; border-top: 1px solid rgba(217, 119, 6, 0.2); color: #64748B; font-size: 11px;">
                  <p style="margin: 0 0 6px 0; color: #D97706; font-weight: bold; letter-spacing: 1px;">
                    BE POSITIVE VALUABLE
                  </p>
                  <p style="margin: 0;">
                    &copy; 2026 ESME Cairo University Student Chapter. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = [
    `Congratulations, ${input.fullName}!`,
    "Your registration for ESME METRIX 2026 is officially confirmed.",
    "",
    `Registration ID: ${input.registrationId}`,
    `Full Name: ${input.fullName}`,
    `University: ${input.university}`,
    `Faculty & Major: ${
      input.department && input.department !== input.faculty
        ? `${input.faculty || ""} — ${input.department}`
        : input.faculty || "Engineering"
    }`,
    ...(input.isEsmeMember && input.committee
      ? [`ESME Chapter: ESME Member — ${input.committee}`]
      : input.isEsmeMember
      ? ["ESME Chapter: ESME Member"]
      : []),
    `Academic Year: ${input.academicYear || "Undergraduate"} (Class of ${
      input.graduationYear || "2026"
    })`,
    `National ID: ${input.nationalId || "N/A"}`,
    `Event Date: ${eventDate}`,
    `Venue: ${eventVenue}`,
    `Time: ${eventTime}`,
    "",
    "Your encrypted QR entrance badge is attached to this email (ESME-METRIX-QR).",
    "Please present it on your phone alongside your original National ID at gate check-in to receive your official attendance certificate.",
    "",
    "Official Attendee WhatsApp Group:",
    whatsappUrl,
    "",
    "BE POSITIVE VALUABLE.",
    "ESME Cairo University Student Chapter",
  ].join("\n");

  return {
    from,
    subject: `Registration Confirmed & Official QR Pass — ESME METRIX 2026 [${registrationId}]`,
    html,
    text,
    attachments: [
      {
        filename: `ESME-METRIX-QR-${registrationId}.png`,
        content: qrBase64,
        contentId: "metrix-qr",
        contentType: "image/png",
      },
    ],
  };
}

export async function sendConfirmationEmail(to: string, emailContent: ConfirmationEmail): Promise<void> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const attachments = emailContent.attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content, "base64"),
        cid: a.contentId,
        contentType: a.contentType,
      }));

      await transporter.sendMail({
        from: emailContent.from,
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments,
      });

      console.log(`Confirmation email sent via Gmail SMTP to ${to}`);
      return;
    } catch (smtpErr) {
      console.error("Gmail SMTP dispatch failed, attempting Resend fallback:", smtpErr);
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      const { error: sendError } = await resend.emails.send({
        from: emailContent.from,
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: emailContent.attachments,
      });

      if (sendError) {
        console.error("Confirmation email rejected by Resend:", sendError);
      } else {
        console.log(`Confirmation email sent via Resend to ${to}`);
      }
      return;
    } catch (resendErr) {
      console.error("Resend dispatch failed:", resendErr);
      return;
    }
  }

  console.warn("Neither SMTP_USER/SMTP_PASS nor RESEND_API_KEY configured; confirmation email skipped.");
}
