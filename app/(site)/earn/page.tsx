import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { EarnBoard } from "@/components/hustle/earn-board";
import { getPublishedHustles } from "@/lib/hustle-content";
import { pageMetadata, itemListStructuredData, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Earn · AI side-hustle blueprints",
  description: "A searchable directory of realistic AI side-hustle blueprints built around proof, shipping, and clear buyer demand.",
  path: "/earn",
});
export const dynamic = "force-dynamic";

export default async function EarnPage() {
  const hustles = await getPublishedHustles();
  return (
    <>
      <EarnBoard hustles={hustles} />
      <JsonLd
        data={itemListStructuredData(
          hustles.map((hustle) => ({ name: hustle.title, url: absoluteUrl(`/earn/${hustle.slug}`) }))
        )}
      />
    </>
  );
}