# 123RUIT | Autoglas Amersfoort — website

One-page website met een interactieve exploded view van een auto waarbij **uitsluitend de ruiten** uit de carrosserie zweven, een configurator-achtig schadeformulier en lokale SEO.

Stack: **Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zod · Resend (REST)**.

---

## Snel starten

```bash
npm install
cp .env.example .env.local   # en vul de waarden in
npm run dev                  # http://localhost:3000
```

Controles vóór livegang:

```bash
npm run lint
npm run typecheck
npm run build
```

> **Let op:** de bouwomgeving waarin deze site is gemaakt had geen toegang tot npm. `next build`, ESLint en `tsc` zijn daarom **nog niet** tegen de echte Next.js-installatie gedraaid. Alle componenten zijn wel gerenderd (server-side én in de browser) en visueel en functioneel getest met Playwright op 1920, 1440, 768 en 390 px. Draai bovenstaande drie commando's één keer en los eventuele meldingen op.

## Deployen (GitHub + Vercel)

1. Push deze map naar een GitHub-repository.
2. Importeer de repository in Vercel (framework wordt automatisch herkend).
3. Zet de omgevingsvariabelen uit `.env.example` onder *Settings → Environment Variables*.
4. Koppel het definitieve domein en zet `NEXT_PUBLIC_SITE_URL` op dat domein.

## Omgevingsvariabelen

| Variabele | Doel |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Definitief domein. Gebruikt voor canonical, sitemap, Open Graph en JSON-LD. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Internationaal, alleen cijfers (bijv. `31612345678`). **Leeg = alle WhatsApp-knoppen verborgen.** De hero toont dan "Bel direct". |
| `NEXT_PUBLIC_GOOGLE_PROFILE_URL` | Optioneel: link naar het geverifieerde Google Bedrijfsprofiel. Leeg = Google Maps-zoeklink op naam + adres. |
| `RESEND_API_KEY` | Server-side sleutel van Resend. Nooit in frontendcode. |
| `MAIL_FROM` | Afzender op een in Resend geverifieerd domein. |
| `MAIL_TO` | Ontvanger(s) van schadeaanvragen, komma-gescheiden. |

Zolang `RESEND_API_KEY`, `MAIL_FROM` of `MAIL_TO` ontbreekt, antwoordt `/api/schade` met **503 `not_configured`** en ziet de bezoeker de melding *"Je aanvraag is niet verzonden"* met telefoon en e-mail. Er verschijnt nooit een succesmelding zonder dat de e-mail echt is verstuurd.

## Structuur

```
src/
  app/
    layout.tsx           metadata, Open Graph, fonts (Space Grotesk + Inter via next/font)
    page.tsx             homepage + LocalBusiness (AutoRepair) JSON-LD
    privacy/page.tsx     privacyverklaring (concepttekst — laten controleren)
    api/schade/route.ts  formulierverwerking: Zod, honeypot, invultijd, rate limit, uploadcontrole, Resend
    sitemap.ts, robots.ts, not-found.tsx, icon.svg, globals.css
  components/
    SitePage.tsx         volgorde van alle secties
    GlassSelection.tsx   gedeelde ruitselectie (3D-auto → formulier)
    car/
      CarArt.tsx         carrosserie, interieur, verlichting en glasmateriaal (SVG)
      ExplodedCar.tsx    3D-scène, scrolltijdlijn, hover/klik, aanwijslijnen
    form/
      DamageForm.tsx     4-staps formulier met voortgang en samenvatting
      CarPlanSelector.tsx  auto van bovenaf om een ruit te kiezen
    sections/            Header, Hero, TrustBar, Services(+ServiceVisual), HowItWorks,
                         FormSection, About, Reviews, Contact, Footer, MobileActions
    ui/Icons.tsx         lijniconen (inline, Lucide-stijl)
  content/reviews.ts     hier ALLEEN echte, verifieerbare reviews toevoegen
  lib/
    site.ts              alle bedrijfsgegevens op één plek
    glass.ts             geometrie + explode-vectoren per ruit
    damage-schema.ts     Zod-schema's (gedeeld door client en server)
    jsonld.ts
```

## De 3D-visualisatie — wat het is en wat (nog) niet

**Wat het is:** een echte, interactieve 3D-scène opgebouwd met CSS 3D-transformaties en gelaagde SVG — geen WebGL. De carrosserie heeft volume (gestapelde silhouetten), staande wielen en een studiovloer met rode lichtring. Elke ruit (voorruit, achterruit, vier zijruiten, panoramadak) is een **afzonderlijke laag** met een eigen explode-vector; de carrosserie beweegt nooit. Hover, klik, toetsenbord (Tab + Enter) en aanraking werken per ruit. De scrolltijdlijn volgt de opdracht:

| Scroll | Wat er gebeurt |
|---|---|
| 0–20% | auto komt rustig in beeld, ruiten licht losgekomen |
| 20–45% | ruiten bewegen naar buiten |
| 45–65% | volledige exploded view, rode aanwijslijnen + labels |
| 65–80% | inzoomen op de voorruit, sterretje verschijnt en verdwijnt (reparatie) |
| 80–100% | ruiten terug op hun plek |

De animatie is omkeerbaar, smooth geïnterpoleerd, blokkeert scrollen niet en pauzeert zodra de scène in rust is of buiten beeld valt. Bij *reduced motion* staat de auto statisch in exploded view met labels. Zonder JavaScript toont de server-HTML een volledig gemonteerde auto; alle teksten en CTA's staan in de HTML.

**Wat het niet is:** een fotorealistisch GLB-model met Three.js/React Three Fiber en GSAP ScrollTrigger, zoals in de opdracht als voorkeur genoemd. Er was geen geschikt (merkloos, commercieel bruikbaar) model met losse glas-meshes beschikbaar, en de referentieafbeelding `public/images/car-reference.png` was niet meegeleverd. De opdracht stelt dat een hoogwaardige visualisatie beter is dan een amateuristisch 3D-model; deze aanpak houdt de pagina bovendien licht (geen 3D-bibliotheken in de bundle). Three.js, R3F, Drei en GSAP zijn daarom **niet** als dependency opgenomen.

### Later een echt GLB-model integreren

1. Model eisen: merkloos, realistische proporties, commerciële licentie, en **elke ruit als aparte mesh** met namen als `glass_voorruit`, `glass_achterruit`, `glass_zijruit_lv`, `glass_zijruit_la`, `glass_zijruit_rv`, `glass_zijruit_ra`, `glass_panoramadak`. Zitten ruiten in één mesh, splits ze eerst in Blender.
2. `npm i three @react-three/fiber @react-three/drei gsap`
3. Maak `components/car/GlbCar.tsx` en laad het met `next/dynamic` (`ssr: false`).
4. Hergebruik `timeline()` uit `ExplodedCar.tsx` (zelfde fasen) en de `explode`-vectoren uit `lib/glass.ts` als richting per mesh; hergebruik `useGlassSelection()` voor klikken.
5. Houd `ExplodedCar` als fallback bij WebGL-problemen of trage apparaten.

## Ontbrekend / nog te configureren

- [ ] **Referentieafbeelding** `public/images/car-reference.png` — niet aangeleverd.
- [ ] **Officieel logo** — nu een typografisch woordmerk in `Header.tsx` (`Logo`) en `Footer.tsx`.
- [ ] **Echte bedrijfsfoto's** (werkplaats, team, wachtruimte) — bewust niet verzonnen; de Over-ons-sectie is nu typografisch.
- [ ] **Reviews** — vul `src/content/reviews.ts` met echte reviews, of zet `NEXT_PUBLIC_GOOGLE_PROFILE_URL`.
- [ ] **WhatsApp-nummer** — `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] **Domein** — `NEXT_PUBLIC_SITE_URL`.
- [ ] **Resend** — API-sleutel, geverifieerd afzenderdomein, ontvanger.
- [ ] **Feiten laten bevestigen** door de eigenaar: "25+ jaar", "vaak binnen 24 uur", "BOVAG-aangesloten", service op locatie, vervangend vervoer.
- [ ] **Privacyverklaring** — concepttekst; aanvullen (KvK, bewaartermijn) en laten controleren.
- [ ] **Rate limiting** — de huidige limiet werkt per serverless-instantie. Voor strengere bescherming: Vercel KV / Upstash, of Cloudflare Turnstile toevoegen aan het formulier.

## Toegankelijkheid & performance

- Skiplink, semantische landmarks, één `h1`, logische koppen.
- Ruitselectie: 3D-ruiten zijn focusbaar (Tab/Enter); het formulier biedt dezelfde keuze als lijst met radioknoppen én als klikbare bovenaanzicht-auto.
- Formulier: labels, `aria-invalid` + foutmeldingen per veld, focus naar de staptitel bij elke stap, gegevens blijven bewaard bij teruggaan.
- `prefers-reduced-motion` gerespecteerd; geen scroll-jacking.
- Geen externe scripts, geen trackingcookies; fonts via `next/font` (self-hosted).
