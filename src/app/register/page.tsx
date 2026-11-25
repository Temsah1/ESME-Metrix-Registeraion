import RegisterFormClient from "@/components/register/RegisterFormClient";
import { getFullCmsData } from "@/lib/cms/server";

export const revalidate = 60;

export default async function RegisterPage() {
  const cms = await getFullCmsData();
  return <RegisterFormClient formConfig={cms.form} />;
}
