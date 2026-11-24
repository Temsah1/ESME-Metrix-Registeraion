export interface ConfirmationEmailInput {
  fullName: string;
  registrationId: string;
  university: string;
<<<<<<< HEAD
  faculty?: string;
  academicYear?: string;
  graduationYear?: string;
  nationalId?: string;
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
  qrDataUrl: string;
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
  const eventDate = process.env.EVENT_DATE || "12 December 2026";
<<<<<<< HEAD
  const eventVenue = process.env.EVENT_VENUE || "Cairo University, Faculty of Engineering";
  const eventTime = process.env.EVENT_TIME || "Saturday 12 / 12 / 2026 — 09:00 AM";

  const name = escapeHtml(input.fullName);
  const university = escapeHtml(input.university || "Cairo University");
  const faculty = escapeHtml(input.faculty || "Engineering");
  const academicYear = escapeHtml(input.academicYear || "Undergraduate");
  const graduationYear = escapeHtml(input.graduationYear || "2026");
=======
  const eventVenue = process.env.EVENT_VENUE || "Cairo University";
  const eventTime = process.env.EVENT_TIME || "Saturday 12 / 12 / 2026";

  const name = escapeHtml(input.fullName);
  const university = escapeHtml(input.university);
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
  const registrationId = escapeHtml(input.registrationId);

  const qrBase64 = input.qrDataUrl.includes(",")
    ? input.qrDataUrl.split(",")[1]
    : input.qrDataUrl;

  const html = `
<<<<<<< HEAD
    <!DOCTYPE html>
    <html>
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
                  <div style="font-size: 11px; font-weight: bold; color: #F59E0B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
                    ESME CAIRO UNIVERSITY STUDENT CHAPTER
                  </div>
                  <h1 style="color: #FFFFFF; font-size: 30px; margin: 0; font-weight: 900; letter-spacing: 1px;">
                    ESME <span style="color: #D97706;">METRIX</span> 2026
                  </h1>
                  <p style="color: #94A3B8; font-size: 13px; margin: 6px 0 0 0;">
                    Flagship Materials & Engineering Gathering
                  </p>
                </td>
              </tr>

              <!-- Confirmation Status Badge -->
              <tr>
                <td align="center" style="padding: 24px 20px 10px 20px;">
                  <div style="background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; font-weight: bold; font-size: 13px; padding: 7px 18px; border-radius: 30px; display: inline-block;">
                    &#10003; REGISTRATION & ADMISSION CONFIRMED
                  </div>
                </td>
              </tr>

              <!-- Greeting & Announcement -->
              <tr>
                <td style="padding: 10px 30px 20px 30px; color: #E2E8F0; text-align: center;">
                  <h2 style="color: #FFFFFF; font-size: 22px; margin: 0 0 10px 0;">أهلاً بك يا ${name}!</h2>
                  <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6; margin: 0;">
                    تم تأكيد تسجيلك بنجاح في مؤتمر <strong>ESME METRIX 2026</strong>. تم إصدار هويتك الرقمية وكود الدخول (QR Code) بنجاح.
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
                    
                    <!-- Embedded QR Image -->
                    <div style="background-color: #FFFFFF; padding: 12px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                      <img src="cid:metrix-qr" alt="ESME METRIX Admission QR" width="220" height="220" style="width: 220px; height: 220px; display: block; border: 0;" />
                    </div>

                    <div style="font-family: monospace; font-size: 18px; font-weight: bold; color: #F59E0B; margin-top: 14px; letter-spacing: 1px;">
                      ID: ${registrationId}
                    </div>
                    <div style="font-size: 11px; color: #10B981; font-weight: bold; margin-top: 4px;">
                      ● Cryptographically Signed & Verified
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Attendee Details Table -->
              <tr>
                <td style="padding: 0 30px 25px 30px;">
                  <div style="background-color: #11253B; border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 12px; font-weight: bold; color: #D97706; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      بيانات التسجيل المعتمدة (Attendee Details)
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="color: #CBD5E1; font-size: 13px;">
                      <tr>
                        <td width="35%" style="color: #94A3B8;">الاسم الكامل:</td>
                        <td style="color: #FFFFFF; font-weight: bold;">${name}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">الجامعة:</td>
                        <td style="color: #FFFFFF;">${university}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">القسم والتخصص:</td>
                        <td style="color: #FFFFFF;">${faculty}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">السنة وسنة التخرج:</td>
                        <td style="color: #FFFFFF;">${academicYear} (دفعة ${graduationYear})</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">تاريخ الفعالية:</td>
                        <td style="color: #F59E0B; font-weight: bold;">${escapeHtml(eventDate)}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">المكان:</td>
                        <td style="color: #FFFFFF;">${escapeHtml(eventVenue)}</td>
                      </tr>
                      <tr>
                        <td style="color: #94A3B8;">الميعاد:</td>
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
                      انضم إلى جروب الواتساب الرسمي لمتابعة الورش والمحاضرات:
                    </p>
                    <a href="https://chat.whatsapp.com/BahfelppPpX8aXanFJvDhl?s=cl&p=i&iam=2" style="background-color: #25D366; color: #FFFFFF; text-decoration: none; font-weight: 900; font-size: 13px; padding: 10px 22px; border-radius: 20px; display: inline-block;">
                      دخول جروب الواتساب الرسمي
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Certificate Notice -->
              <tr>
                <td style="padding: 0 30px 25px 30px;">
                  <div style="background-color: rgba(217, 119, 6, 0.1); border-left: 4px solid #D97706; padding: 12px 16px; border-radius: 0 8px 8px 0; color: #F59E0B; font-size: 12px; line-height: 1.5;">
                    ★ <strong>تنويه هام:</strong> يرجى إبراز كود الـ QR هذا (من الموبايل أو مطبوعاً) عند بوابة الدخول لتسجيل حضورك الفعلي واستلام <strong>شهادة الحضور الرسمية المعتمدة</strong>.
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
    `تهانينا، ${input.fullName}!`,
    "تم تأكيد تسجيلك رسمياً في مؤتمر ESME METRIX 2026.",
    "",
    `رقم التسجيل: ${input.registrationId}`,
    `الاسم: ${input.fullName}`,
    `الجامعة: ${input.university}`,
    `القسم: ${input.faculty || "الهندسة"}`,
    `تاريخ الفعالية: ${eventDate}`,
    `المكان: ${eventVenue}`,
    `الميعاد: ${eventTime}`,
    "",
    "كود الـ QR الخاص بدخولك مرفق مع هذا الإيميل (metrix-qr.png).",
    "يرجى الاحتفاظ به جاهزاً على موبايلك عند الوصول لبوابة الدخول لاستلام شهادة الحضور الرسمية.",
    "",
    "رابط جروب الواتساب الرسمي:",
    "https://chat.whatsapp.com/BahfelppPpX8aXanFJvDhl?s=cl&p=i&iam=2",
    "",
    "BE POSITIVE VALUABLE.",
    "ESME Cairo University Student Chapter",
=======
    <div style="font-family: Arial, sans-serif; background-color: #15304B; color: #F8FAFC; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #D97706;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #D97706; font-size: 26px; margin: 0; font-weight: bold;">ESME METRIX 2026</h1>
        <p style="color: #CBD5E1; font-size: 13px; margin-top: 4px;">ESME METRIX — ESME Cairo University Student Chapter</p>
      </div>

      <div style="background-color: #10B981; color: #FFFFFF; font-weight: bold; font-size: 13px; padding: 6px 14px; border-radius: 20px; display: inline-block; margin-bottom: 12px;">
        &#10003; REGISTRATION CONFIRMED
      </div>

      <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 8px;">Congratulations, ${name}!</h2>
      <p style="color: #E5E7EB; font-size: 15px; line-height: 1.6;">
        Your registration for ESME Metrix 2026 has been successfully confirmed.
      </p>

      <div style="background-color: #0F243A; padding: 20px; border-radius: 10px; margin: 24px 0; text-align: center; border: 1px solid rgba(217, 119, 6, 0.3);">
        <div style="font-size: 12px; color: #CBD5E1; letter-spacing: 1px; margin-bottom: 10px; font-weight: bold;">YOUR DIGITAL ADMISSION BADGE</div>
        <img src="cid:metrix-qr" alt="ESME Metrix QR Code" width="220" height="220" style="width: 220px; height: 220px; border-radius: 8px; margin: 0 auto; display: block; border: 2px solid #D97706;" />
        <p style="font-family: monospace; font-size: 16px; font-weight: bold; color: #F59E0B; margin-top: 12px; letter-spacing: 1px;">ID: ${registrationId}</p>
      </div>

      <div style="color: #E5E7EB; font-size: 14px; margin-bottom: 24px; line-height: 1.8;">
        <strong>Attendee:</strong> ${name}<br />
        <strong>Institution:</strong> ${university}<br />
        <strong>Event:</strong> ESME Metrix 2026 — Materials Engineering Event<br />
        <strong>Date:</strong> ${escapeHtml(eventDate)}<br />
        <strong>Venue:</strong> ${escapeHtml(eventVenue)}<br />
        <strong>Time:</strong> ${escapeHtml(eventTime)}
      </div>

      <p style="color: #CBD5E1; font-size: 13px; border-top: 1px solid rgba(217, 119, 6, 0.2); padding-top: 16px; text-align: center;">
        Please keep this QR code ready on your mobile device during entrance verification.<br />
        <span style="color: #D97706; font-weight: bold; letter-spacing: 1px;">BE POSITIVE VALUABLE.</span><br />
        <span style="color: #94A3B8; font-size: 11px;">ESME METRIX — ESME Cairo University Student Chapter</span>
      </p>
    </div>
  `;

  const text = [
    `Congratulations, ${input.fullName}!`,
    "Your registration for ESME Metrix 2026 has been successfully confirmed.",
    "",
    `Registration ID: ${input.registrationId}`,
    `Attendee: ${input.fullName}`,
    `Institution: ${input.university}`,
    `Date: ${eventDate}`,
    `Venue: ${eventVenue}`,
    `Time: ${eventTime}`,
    "",
    "Your QR admission badge is attached to this email (metrix-qr.png).",
    "Keep it ready on your mobile device during entrance verification.",
    "",
    "BE POSITIVE VALUABLE.",
    "ESME METRIX — ESME Cairo University Student Chapter",
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
  ].join("\n");

  return {
    from,
<<<<<<< HEAD
    subject: `تأكيد تسجيلك وكود الدخول الرسمي — ESME METRIX 2026 [${registrationId}]`,
=======
    subject: "You're registered — ESME METRIX 2026",
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
    html,
    text,
    attachments: [
      {
<<<<<<< HEAD
        filename: `ESME-METRIX-QR-${registrationId}.png`,
=======
        filename: "metrix-qr.png",
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
        content: qrBase64,
        contentId: "metrix-qr",
        contentType: "image/png",
      },
    ],
  };
}

export async function sendConfirmationEmail(to: string, emailContent: ConfirmationEmail): Promise<void> {
<<<<<<< HEAD
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. Primary engine: Resend API
  if (resendApiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);

      const { data, error: sendError } = await resend.emails.send({
        from: emailContent.from,
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: emailContent.attachments.map((a) => ({
          filename: a.filename,
          content: a.content,
        })),
      });

      if (sendError) {
        console.error("Confirmation email rejected by Resend API:", sendError);
      } else {
        console.log(`Confirmation email sent via Resend API to ${to} (Message ID: ${data?.id})`);
        return;
      }
    } catch (resendErr) {
      console.error("Resend API dispatch encountered error, checking fallback:", resendErr);
    }
  }

  // 2. Secondary fallback: Nodemailer (SMTP / Gmail)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

=======
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // 1. Primary: Try nodemailer Gmail SMTP if configured
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
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

<<<<<<< HEAD
      console.log(`Confirmation email sent via Gmail SMTP fallback to ${to}`);
      return;
    } catch (smtpErr) {
      console.error("Gmail SMTP fallback dispatch failed:", smtpErr);
    }
  }

  console.warn("Neither RESEND_API_KEY nor SMTP credentials configured; email dispatch skipped.");
=======
      console.log(`Confirmation email sent via Gmail SMTP to ${to}`);
      return;
    } catch (smtpErr) {
      console.error("Gmail SMTP dispatch failed, attempting Resend fallback:", smtpErr);
    }
  }

  // 2. Secondary fallback: Resend API
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
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
}
