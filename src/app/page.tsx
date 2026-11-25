import HomeLandingClient from "@/components/HomeLandingClient";
import { getFullCmsData } from "@/lib/cms/server";

export const revalidate = 60;

export default async function HomePage() {
  const cms = await getFullCmsData();
  return <HomeLandingClient cms={cms} />;
}
