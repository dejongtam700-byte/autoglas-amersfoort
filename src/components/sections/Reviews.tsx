"use client";

import { useState } from "react";
import { reviews } from "@/content/reviews";
import { site } from "@/lib/site";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";

export default function Reviews() {
  const [i, setI] = useState(0);
  const has = reviews.length > 0;
  const r = has ? reviews[i % reviews.length] : null;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-anthracite py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow flex items-center gap-3 text-silver">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            Reviews
          </p>
          <h2 id="reviews-title" className="mt-8 font-display text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-paper">
            Wat klanten
            <br />
            over ons zeggen.
          </h2>
        </div>

        <div className="lg:col-span-8">
          {r ? (
            <figure aria-live="polite">
              <span className="block font-display text-[96px] leading-[0.6] text-signal" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="mt-4 font-display text-[clamp(1.5rem,2.8vw,2.5rem)] font-medium leading-[1.2] tracking-[-0.025em] text-paper">
                {r.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between border-t border-steel pt-6">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[14px] text-silver hover:text-paper">
                  {r.author} · via {r.source}
                </a>
                {reviews.length > 1 && (
                  <div className="flex gap-2">
                    <button type="button" aria-label="Vorige review" onClick={() => setI((x) => (x - 1 + reviews.length) % reviews.length)} className="grid h-11 w-11 place-items-center border border-steel text-paper hover:border-paper">
                      <ArrowLeftIcon className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Volgende review" onClick={() => setI((x) => (x + 1) % reviews.length)} className="grid h-11 w-11 place-items-center border border-steel text-paper hover:border-paper">
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </figcaption>
            </figure>
          ) : (
            <div className="border-l border-steel pl-8 md:pl-12">
              <p className="max-w-2xl font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.2] tracking-[-0.025em] text-paper">
                Benieuwd naar de ervaringen van andere automobilisten uit Amersfoort? Lees de beoordelingen van onze klanten op Google.
              </p>
              <a href={site.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark mt-10">
                Bekijk onze reviews op Google <ArrowRightIcon className="btn-icon" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
