import { site } from "@/lib/site";

/** LocalBusiness (AutoRepair) structured data. Bevat uitsluitend feitelijke, door het bedrijf aangeleverde gegevens. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneE164,
    email: site.email,
    image: `${site.url}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: "Amersfoort" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "17:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Autoglasdiensten",
      itemListElement: [
        "Sterretje repareren",
        "Voorruit vervangen",
        "Zijruit en achterruit vervangen",
        "ADAS-kalibratie",
        "Camperruiten",
        "Verzekeringsafhandeling",
      ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
    },
  };
}
