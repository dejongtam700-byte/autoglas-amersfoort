"use client";

import { useEffect, useRef, useState } from "react";
import ExplodedCar from "@/components/car/ExplodedCar";
import { site, whatsappUrl } from "@/lib/site";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function Hero() {
  const scrollRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const wa = whatsappUrl();

  return (
    <section
      id="home"
      ref={scrollRef}
      aria-labelledby="hero-title"
      className={`relative bg-ink ${reduced ? "" : "h-[210svh] lg:h-[250vh]"}`}
    >
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
        <div className="studio-floor pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* 3D-visualisatie: rechterkant (desktop) / midden (mobiel) */}
        <div className="absolute inset-x-0 top-[27%] bottom-[24%] lg:inset-y-0 lg:left-[34%] lg:right-0 2xl:left-[38%] lg:top-[84px]">
          <div className="relative h-full w-full lg:pr-[clamp(20px,4vw,64px)] lg:pb-16">
            <ExplodedCar scrollRef={scrollRef} reducedMotion={reduced} />
          </div>
        </div>

        {/* tekst */}
        <div className="shell pointer-events-none relative z-10 flex h-full flex-col justify-between pb-[84px] pt-[92px] sm:pb-[100px] lg:justify-center lg:pb-24 lg:pt-[84px]">
          <div className="pointer-events-auto lg:max-w-[min(50%,860px)]">
            <p className="eyebrow flex items-center gap-3 text-silver">
              <span className="h-px w-8 bg-signal" aria-hidden="true" />
              Autoruitspecialist • Amersfoort
            </p>
            <h1
              id="hero-title"
              className="headline-xl mt-5 text-[clamp(2.75rem,5.3vw,5.75rem)] text-paper lg:mt-7 lg:whitespace-nowrap"
            >
              Helder zicht<span className="text-signal">.</span>
              <br />
              Veilig onderweg.
            </h1>
          </div>

          <div className="pointer-events-auto lg:mt-9 lg:max-w-[min(40%,520px)]">
            <p className="max-w-[440px] text-[15px] leading-relaxed text-silver lg:text-[17px]">
              Van een klein sterretje tot een compleet nieuwe autoruit. Persoonlijk geholpen door jouw lokale ruitspecialist.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:gap-3 lg:mt-8">
              <a href="#schade" className="btn-primary px-4 sm:px-6">
                Meld je ruitschade <ArrowRightIcon className="btn-icon hidden sm:block" />
              </a>
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark px-4 sm:px-6">
                  <WhatsAppIcon className="btn-icon" /> WhatsApp ons
                </a>
              ) : (
                <a href={site.phoneHref} className="btn-ghost-dark px-4 tabular-nums sm:px-6">
                  <PhoneIcon className="btn-icon" /> Bel direct
                </a>
              )}
            </div>
            <div className="mt-6 hidden items-center gap-4 lg:flex lg:mt-10">
              <span className="font-display text-[34px] font-semibold leading-none tracking-[-0.04em] text-paper">25+</span>
              <span className="h-8 w-px bg-steel" aria-hidden="true" />
              <p className="text-[13px] leading-snug text-silver">
                Jaar ervaring met autoglas.
                <br />
                Lokaal familiebedrijf in Amersfoort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
