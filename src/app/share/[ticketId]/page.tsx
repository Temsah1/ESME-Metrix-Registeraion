import type { Metadata } from "next";
import { buildShareMetadata, ShareBadgeLanding } from "@/lib/og/share-page";

interface Props {
  params: Promise<{ ticketId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { ticketId } = await params;
  const resolvedSearch = await searchParams;
  return buildShareMetadata("share", ticketId, resolvedSearch);
}

export default async function SharePage({ params, searchParams }: Props) {
  const { ticketId } = await params;
  const resolvedSearch = await searchParams;
  return <ShareBadgeLanding ticketId={ticketId} searchParams={resolvedSearch} />;
}
