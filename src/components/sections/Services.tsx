"use client";

import { useState } from "react";
import ServiceVisual from "./ServiceVisual";
import { ArrowRightIcon, CarIcon, KeyIcon, MapPinIcon } from "@/components/ui/Icons";

const SERVICES = [
  {
    title: "Sterretje repareren",
    seo: "Sterretje repareren in Amersfoort",
    text: "Een sterretje dat kleiner is dan een 2-euromunt en niet in het directe zichtveld van de bestuurder zit, kunnen we vaak repareren met hars. Snel, en de ruit hoeft niet te worden vervangen.",
  },
  {
    title: "Voorruit vervangen",
    seo: "Voorruit vervangen",
    text: "Bij een barst of een te grote beschadiging vervangen we de voorruit door een passende ruit voor jouw auto. Professioneel gemonteerd met de juiste lijm en uithardingstijd.",
  },
  {
    title: "Zijruit en achterruit vervangen",
    seo: "Zijruit en achterruit vervangen",
    text: "Ingeslagen of gesprongen zijruit of achterruit? We vervangen de ruit en verwijderen achtergebleven glassplinters uit het portier en het interieur.",
  },
  {
    title: "ADAS-kalibratie",
    seo: "ADAS-kalibratie",
    text: "Veel moderne auto's hebben een camera achter de voorruit voor rijhulpsystemen. Na het vervangen van de voorruit moet deze camera opnieuw worden gekalibreerd, zodat systemen als rijstrookassistentie correct werken.",
  },
  {
    title: "Camperruiten",
    seo: "Camperruiten",
    text: "Ook voor de voorruit van je camper kun je bij ons terecht. Grote ruiten vragen om ervaring en zorgvuldige montage.",
  },
  {
    title: "Verzekeringsafhandeling",
    seo: "Verzekeringsafhandeling",
    text: "Ruitschade is vaak gedekt als je een beperkt casco- of allriskverzekering hebt. Wij helpen je met de afhandeling met de verzekeraar, zodat jij er geen omkijken naar hebt.",
  },
];

const EXTRAS = [
  { icon: MapPinIcon, title: "Service op locatie", text: "In overleg komen we naar je toe, thuis of op het werk." },
  { icon: KeyIcon, title: "Haal- en brengservice", text: "Wij halen je auto op en brengen hem weer terug." },
  { icon: CarIcon, title: "Vervangend vervoer", text: "Zo blijf je mobiel terwijl wij aan je auto werken." },
];

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="diensten" aria-labelledby="diensten-title" className="bg-paper py-24 text-ink md:py-36">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="eyebrow flex items-center gap-3 self-start text-graphite md:col-span-4 md:mt-5">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            Onze specialisaties
          </p>
          <h2 id="diensten-title" className="headline-lg md:col-span-8">
            Elke ruit.
            <br />
            Elke schade.
          </h2>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* lijst (tab-achtig, maar alle tekst staat ook zonder JS in de HTML) */}
          <ol className="lg:col-span-5">
            {SERVICES.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title} className="border-t border-ink/15 last:border-b">
                  <h3 className="m-0">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`dienst-${i}`}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group flex w-full items-baseline gap-6 py-6 text-left"
                    >
                      <span className={`font-display text-[12px] tabular-nums tracking-[0.2em] ${on ? "text-signal" : "text-ink/40"}`}>0{i + 1}</span>
                      <span
                        className={`font-display text-[24px] font-medium tracking-[-0.03em] transition-colors md:text-[30px] ${
                          on ? "text-ink" : "text-ink/45 group-hover:text-ink/80"
                        }`}
                      >
                        {s.title}
                      </span>
                      <ArrowRightIcon className={`ml-auto h-5 w-5 shrink-0 self-center transition-all duration-300 ${on ? "translate-x-0 text-signal opacity-100" : "-translate-x-2 opacity-0"}`} />
                    </button>
                  </h3>
                  <div id={`dienst-${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-md pb-7 pl-[46px] text-[15px] leading-relaxed text-graphite">{s.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* grote technische visualisatie */}
          <div className="relative lg:col-span-7">
            <div className="sticky top-28">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(9_9_11/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(9_9_11/0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" aria-hidden="true" />
                {SERVICES.map((s, i) => (
                  <div key={s.title} className={`absolute inset-0 transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== active}>
                    <ServiceVisual id={i} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/15 pt-4">
                <p className="eyebrow text-[10px] text-graphite">
                  <span className="text-signal tabular-nums">0{active + 1}</span> / 06 — {SERVICES[active].title}
                </p>
                <a href="#schade" className="font-display text-[13px] font-medium uppercase tracking-[0.16em] text-ink underline decoration-signal decoration-2 underline-offset-[6px] hover:text-signal">
                  Schade melden
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* aanvullende dienstverlening */}
        <div className="mt-24 md:mt-32">
          <p className="eyebrow text-graphite">Aanvullende dienstverlening</p>
          <ul className="mt-8 grid border-t border-ink/15 md:grid-cols-3">
            {EXTRAS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className={`flex gap-5 py-8 md:px-8 ${i > 0 ? "border-t border-ink/15 md:border-l md:border-t-0" : "md:pl-0"}`}>
                <Icon className="mt-1 h-6 w-6 shrink-0 text-signal" />
                <div>
                  <h3 className="font-display text-[20px] font-medium tracking-[-0.02em]">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-graphite">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
