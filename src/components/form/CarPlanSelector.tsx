"use client";

import { CarBodyArt, GlassPaneArt } from "@/components/car/CarArt";
import { BODY_PATH, GLASS_PARTS, VIEWBOX, type DamageGlassId } from "@/lib/glass";

/**
 * Auto van bovenaf (neus omhoog) waarop een ruit gekozen kan worden.
 * De lijst met knoppen in het formulier is het toegankelijke alternatief; dit is de visuele variant.
 */
export default function CarPlanSelector({
  value,
  onChange,
  interactive = true,
  className = "",
}: {
  value: DamageGlassId | null;
  onChange?: (id: DamageGlassId) => void;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[1/2] ${className}`}>
      {/* 180° gedraaid: voorkant boven, linkerzijde van de auto links in beeld */}
      <div className="absolute inset-0 rotate-180">
        <svg viewBox={VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path d={BODY_PATH} fill="none" stroke="#a1a1aa" strokeOpacity="0.5" strokeWidth="1.2" transform="scale(1.012)" />
        </svg>
        <CarBodyArt idp="plan" className="absolute inset-0 h-full w-full overflow-visible brightness-[1.9] contrast-[1.05]" />
        {GLASS_PARTS.map((p) => (
          <GlassPaneArt key={p.id} part={p} idp="plan" className="absolute inset-0 h-full w-full overflow-visible brightness-[1.8]" />
        ))}
        <svg
          viewBox={VIEWBOX}
          className="absolute inset-0 h-full w-full overflow-visible"
          role={interactive ? "radiogroup" : undefined}
          aria-label={interactive ? "Kies de beschadigde ruit op de auto" : undefined}
          aria-hidden={interactive ? undefined : true}
        >
          {GLASS_PARTS.map((p) => (
            <path
              key={p.id}
              d={p.path}
              className="plan-hit"
              role={interactive ? "radio" : undefined}
              aria-checked={value === p.id}
              aria-label={interactive ? p.label : undefined}
              tabIndex={interactive ? (value === p.id || (!value && p.id === "voorruit") ? 0 : -1) : -1}
              style={interactive ? undefined : { pointerEvents: "none" }}
              onClick={interactive ? () => onChange?.(p.id) : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onChange?.(p.id);
                      }
                    }
                  : undefined
              }
            />
          ))}
        </svg>
      </div>
      <span className="eyebrow absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full text-[9px] text-silver/70" aria-hidden="true">
        Voorzijde
      </span>
    </div>
  );
}
