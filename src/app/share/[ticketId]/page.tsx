import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

interface Props {
  params: Promise<{ ticketId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticketId } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://esme-metrix-registeration.vercel.app";

  let name = "Attendee";
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("registrants")
      .select("full_name")
      .eq("registration_id", ticketId)
      .maybeSingle();

    if (data?.full_name) {
      name = data.full_name;
    }
  } catch (e) {
    console.error("OG registrant fetch failed:", e);
  }

  const title = `${name} is attending ESME METRIX 2026!`;
  const description =
    "Join us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.";
  const ogImageUrl = `${baseUrl}/api/og?id=${encodeURIComponent(ticketId)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/share/${ticketId}`,
      siteName: "ESME METRIX 2026",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage() {
  // Visitors who click the shared LinkedIn post are redirected to register on the homepage
  redirect("/");
}
