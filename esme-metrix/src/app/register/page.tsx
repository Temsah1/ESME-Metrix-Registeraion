import RegisterFormClient from "@/components/register/RegisterFormClient";
import { getFullCmsData } from "@/lib/cms/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RegisterPage() {
  const cms = await getFullCmsData();
  return <RegisterFormClient formConfig={cms.form} arFormConfig={cms.ar?.form} />;
}
