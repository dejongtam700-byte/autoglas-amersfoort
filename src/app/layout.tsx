import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400", "500", "600", "700"], display: "swap" });

const title = "Autoglas Amersfoort | Autoruit reparatie en vervangen | 123RUIT";
const description =
  "Ruitschade in Amersfoort? Sterretje repareren, voorruit vervangen en ADAS-kalibratie bij jouw lokale autoruitspecialist. Meer dan 25 jaar ervaring, BOVAG-aangesloten en hulp bij de verzekering.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | 123RUIT Autoglas Amersfoort" },
  description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: site.name,
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "123RUIT Autoglas Amersfoort — exploded view van een auto met zwevende autoruiten" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={`${inter.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
