/**
 * Centrale bedrijfs- en siteconfiguratie.
 * Alle contactgegevens staan hier op één plek, zodat ze overal consistent zijn.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const rawWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

export const site = {
  name: "123RUIT | Autoglas Amersfoort",
  brand: "123RUIT",
  shortName: "Autoglas Amersfoort",
  description:
    "Autoruitspecialist in Amersfoort. Sterretje repareren, voorruit vervangen, ADAS-kalibratie en volledige verzekeringsafhandeling. Lokaal familiebedrijf met meer dan 25 jaar ervaring.",
  url: rawSiteUrl.replace(/\/$/, ""),

  phone: "033 737 0006",
  phoneHref: "tel:+31337370006",
  phoneE164: "+31337370006",
  email: "autoglasamersfoort@123ruit.nl",

  address: {
    street: "Argonweg 26B",
    postalCode: "3812 RB",
    city: "Amersfoort",
    country: "NL",
  },

  hours: [
    { label: "Maandag t/m vrijdag", value: "08:30–17:00" },
    { label: "Zaterdag", value: "Op afspraak" },
    { label: "Zondag", value: "Op afspraak" },
  ],

  /** Route via Google Maps met het bedrijfsadres als bestemming. */
  routeUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("123RUIT Autoglas Amersfoort, Argonweg 26B, 3812 RB Amersfoort"),

  /** Geverifieerd Google Bedrijfsprofiel, of een zoeklink op naam + adres als terugval. */
  googleProfileUrl:
    process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL ||
    "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("123RUIT Autoglas Amersfoort Argonweg 26B"),

  /** WhatsApp is pas actief wanneer het nummer via de omgevingsvariabele is bevestigd. */
  whatsappNumber: rawWhatsApp,
} as const;

export const whatsappEnabled = site.whatsappNumber.length >= 10;

export function whatsappUrl(message = "Hallo, ik heb ruitschade en wil graag een afspraak maken.") {
  if (!whatsappEnabled) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navItems = [
  { href: "#home", label: "Home" },
  { href: "#diensten", label: "Diensten" },
  { href: "#over-ons", label: "Over ons" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
] as const;
