import { renderMemberDashboardPage } from "@/components/member/MemberDashboardServer";

export const revalidate = 60;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return renderMemberDashboardPage({ searchParams });
}
