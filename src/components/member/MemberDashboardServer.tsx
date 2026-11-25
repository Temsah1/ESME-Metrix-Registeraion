import MemberDashboardClient from "@/components/member/MemberDashboardClient";
import { getFullCmsData } from "@/lib/cms/server";
import { fetchPublicPass } from "@/lib/registrants/public-pass";

function firstParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] || "";
  return val || "";
}

export async function renderMemberDashboardPage(params: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  isPostRegistration?: boolean;
}) {
  const resolvedSearch = params.searchParams ? await params.searchParams : {};
  const lookupToken =
    firstParam(resolvedSearch.id) ||
    firstParam(resolvedSearch.ticketId) ||
    firstParam(resolvedSearch.phone) ||
    firstParam(resolvedSearch.lookup);

  const [cms, lookupRes] = await Promise.all([
    getFullCmsData(),
    lookupToken
      ? fetchPublicPass(lookupToken)
      : Promise.resolve({ status: "invalid" as const }),
  ]);

  const initialData = lookupRes.status === "found" ? lookupRes.pass : null;
  const initialLookupError =
    lookupToken && lookupRes.status !== "found"
      ? "No registration found for the provided Phone Number or Ticket ID."
      : null;

  return (
    <MemberDashboardClient
      initialData={initialData}
      initialLookupError={initialLookupError}
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
