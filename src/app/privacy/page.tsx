import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { GlassSelectionProvider } from "@/components/GlassSelection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "Hoe 123RUIT Autoglas Amersfoort omgaat met je persoonsgegevens.",
  alternates: { canonical: "/privacy" },
};

/*
 * CONCEPTTEKST — laat deze verklaring controleren en aanvullen door de eigenaar (bijv. KvK-nummer, bewaartermijnen)
 * voordat de site live gaat.
 */
export default function PrivacyPage() {
  return (
    <GlassSelectionProvider>
      <Header base="/" />
      <main id="main" className="bg-paper pb-24 pt-36 text-ink md:pb-36 md:pt-44">
        <article className="shell max-w-[860px]">
          <p className="eyebrow text-graphite">Privacy</p>
          <h1 className="headline-lg mt-6">Privacyverklaring</h1>
          <div className="mt-12 space-y-10 text-[16px] leading-relaxed text-graphite [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-medium [&_h2]:tracking-[-0.02em] [&_h2]:text-ink">
            <section>
              <h2>Wie zijn wij</h2>
              <p className="mt-3">
                {site.name}, {site.address.street}, {site.address.postalCode} {site.address.city}. Je bereikt ons via{" "}
                <a className="text-ink underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>{" "}
                of {site.phone}.
              </p>
            </section>
            <section>
              <h2>Welke gegevens we verwerken</h2>
              <p className="mt-3">
                Wanneer je via het schadeformulier een aanvraag doet, ontvangen we de gegevens die je zelf invult: de beschadigde ruit, het type
                schade, kenteken en voertuiggegevens, eventueel je verzekeraar, je naam, telefoonnummer, e-mailadres, een gewenste datum, je
                toelichting en een eventuele foto van de schade.
              </p>
            </section>
            <section>
              <h2>Waarvoor we ze gebruiken</h2>
              <p className="mt-3">
                Uitsluitend om je aanvraag te beoordelen, contact met je op te nemen, een afspraak in te plannen en, als je dat wilt, de schade met
                je verzekeraar af te handelen. De grondslag is je toestemming en het uitvoeren van de dienst die je bij ons aanvraagt.
              </p>
            </section>
            <section>
              <h2>Hoe we ze verwerken</h2>
              <p className="mt-3">
                De website slaat formuliergegevens niet op in een database. Je aanvraag wordt direct per e-mail naar ons verstuurd via de
                e-maildienst Resend, die daarbij als verwerker optreedt. We bewaren je gegevens niet langer dan nodig voor de afhandeling van je
                aanvraag en onze wettelijke (administratieve) verplichtingen.
              </p>
            </section>
            <section>
              <h2>Cookies</h2>
              <p className="mt-3">Deze website gebruikt geen tracking- of advertentiecookies.</p>
            </section>
            <section>
              <h2>Je rechten</h2>
              <p className="mt-3">
                Je kunt ons altijd vragen je gegevens in te zien, te corrigeren of te verwijderen. Neem daarvoor contact op via{" "}
                <a className="text-ink underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                . Ben je niet tevreden over hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.
              </p>
            </section>
          </div>
          <Link href="/" className="btn-ghost-light mt-16">
            Terug naar de homepage
          </Link>
        </article>
      </main>
      <Footer base="/" />
    </GlassSelectionProvider>
  );
}
