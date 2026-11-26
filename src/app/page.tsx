import HomeLandingClient from "@/components/HomeLandingClient";
import { getFullCmsData } from "@/lib/cms/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const cms = await getFullCmsData();
  return <HomeLandingClient cms={cms} />;
}
