import type { Metadata } from "next";
import { buildShareMetadata, ShareBadgeLanding } from "@/lib/og/share-page";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  return buildShareMetadata("ticket", id, resolvedSearch);
}

export default async function TicketSharePage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  return <ShareBadgeLanding ticketId={id} searchParams={resolvedSearch} />;
}
