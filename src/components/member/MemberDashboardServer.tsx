import MemberDashboardClient from "@/components/member/MemberDashboardClient";
import { getFullCmsData } from "@/lib/cms/server";
import { fetchPublicPassById } from "@/lib/registrants/public-pass";

function firstParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] || "";
  return val || "";
}

export async function renderMemberDashboardPage(params: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  isPostRegistration?: boolean;
}) {
  const resolvedSearch = params.searchParams ? await params.searchParams : {};
  const ticketIdToken =
    firstParam(resolvedSearch.id) || firstParam(resolvedSearch.ticketId);

  const [cms, lookupRes] = await Promise.all([
    getFullCmsData(),
    ticketIdToken
      ? fetchPublicPassById(ticketIdToken)
      : Promise.resolve({ status: "invalid" as const }),
  ]);

  const initialData = lookupRes.status === "found" ? lookupRes.pass : null;
  const initialLookupNotFound = Boolean(ticketIdToken && lookupRes.status !== "found");

  return (
    <MemberDashboardClient
      initialData={initialData}
      initialLookupNotFound={initialLookupNotFound}
      cms={cms}
      agenda={cms.agenda}
      confirmationCms={cms.confirmation}
      eventDate={cms.eventDate}
      eventVenue={cms.eventVenue}
      eventTime={cms.eventTime}
      eventMapsUrl={cms.eventMapsUrl}
      ticketBgUrl={cms.ticketBgUrl}
      isPostRegistration={params.isPostRegistration}
    />
  );
}
