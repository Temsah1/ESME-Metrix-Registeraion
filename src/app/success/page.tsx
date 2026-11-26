import { renderMemberDashboardPage } from "@/components/member/MemberDashboardServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return renderMemberDashboardPage({ searchParams, isPostRegistration: true });
}
