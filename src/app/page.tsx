import SitePage from "@/components/SitePage";
import { localBusinessJsonLd } from "@/lib/jsonld";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify + escapen van "<" voorkomt het afbreken van de script-tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c") }}
      />
      <SitePage />
    </>
  );
}
