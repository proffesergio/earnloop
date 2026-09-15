import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getMobilityDesk } from "@/lib/scholarship-content";
import { slugifyMobilityName } from "@/lib/scholarships";
import { pageMetadata, itemListStructuredData, absoluteUrl } from "@/lib/seo";
import ScholarshipsExplorer from "./explorer";

export const metadata: Metadata = pageMetadata({
  title: "Study-abroad scholarships and mobility grants",
  description: "A curated desk of official scholarships, study grants, and mobility routes with eligibility, funding, and application steps.",
  path: "/scholarships",
});
export const dynamic = "force-dynamic";

export default async function ScholarshipsPage() {
  const { opportunities, guides } = await getMobilityDesk();
  return (
    <>
      <ScholarshipsExplorer opportunities={opportunities} guides={guides} />
      <JsonLd
        data={itemListStructuredData(
          opportunities.map((item) => ({
            name: item.name,
            url: absoluteUrl(`/scholarships/${slugifyMobilityName(item.name)}`),
          }))
        )}
      />
    </>
  );
}