import { BODY_PATH, CABIN_PATH, ROOF_PATH, VIEWBOX, type GlassPart } from "@/lib/glass";

/**
 * Statische tekeningen van de auto in bovenaanzicht (merkloze sportieve GT).
 * - CarBodyArt: carrosserie, interieur, verlichting. Beweegt nooit.
 * - GlassPaneArt: één ruit met glasmateriaal, dikte, reflectie en (achterruit) verwarmingsdraden.
 * Het id-voorvoegsel voorkomt dubbele SVG-id's wanneer de auto meerdere keren op de pagina staat.
 */

export function CarBodyArt({ idp = "c", className }: { idp?: string; className?: string }) {
  const id = (s: string) => `${idp}-${s}`;
  return (
    <svg viewBox={VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("paint")} x1="-100" x2="100" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#060607" />
          <stop offset="0.06" stopColor="#18181b" />
          <stop offset="0.13" stopColor="#55555d" />
          <stop offset="0.2" stopColor="#232327" />
          <stop offset="0.38" stopColor="#1b1b1f" />
          <stop offset="0.5" stopColor="#2a2a2f" />
          <stop offset="0.62" stopColor="#1b1b1f" />
          <stop offset="0.8" stopColor="#232327" />
          <stop offset="0.87" stopColor="#55555d" />
          <stop offset="0.94" stopColor="#18181b" />
          <stop offset="1" stopColor="#060607" />
        </linearGradient>
        <linearGradient id={id("light")} x1="0" x2="0" y1="240" y2="-240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.15" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={id("streak")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("cabin")} cx="0" cy="-20" r="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1d1d21" />
          <stop offset="1" stopColor="#070708" />
        </radialGradient>
        <linearGradient id={id("seat")} x1="0" x2="1">
          <stop offset="0" stopColor="#141416" />
          <stop offset="0.5" stopColor="#2a2a2e" />
          <stop offset="1" stopColor="#141416" />
        </linearGradient>
        <linearGradient id={id("roof")} x1="-60" x2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0c0c0e" />
          <stop offset="0.15" stopColor="#3b3b42" />
          <stop offset="0.5" stopColor="#1c1c20" />
          <stop offset="0.85" stopColor="#3b3b42" />
          <stop offset="1" stopColor="#0c0c0e" />
        </linearGradient>
        <clipPath id={id("bodyclip")}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      {/* buitenspiegels */}
      {[1, -1].map((s) => (
        <path
          key={s}
          d={`M${86 * s},98 C${100 * s},98 ${110 * s},94 ${112 * s},86 C${110 * s},80 ${98 * s},80 ${86 * s},84 Z`}
          fill={`url(#${id("paint")})`}
          stroke="#000"
          strokeOpacity="0.6"
          strokeWidth="0.6"
        />
      ))}

      {/* carrosserie */}
      <path d={BODY_PATH} fill={`url(#${id("paint")})`} />
      <path d={BODY_PATH} fill={`url(#${id("light")})`} />

      <g clipPath={`url(#${id("bodyclip")})`}>
        {/* studiolicht-reflectie over motorkap en kofferklep */}
        <path d="M-120,200 L120,150 L120,170 L-120,222 Z" fill={`url(#${id("streak")})`} />
        <path d="M-120,-190 L120,-205 L120,-196 L-120,-180 Z" fill={`url(#${id("streak")})`} opacity="0.6" />
        {/* naden en vouwlijnen */}
        <g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="0.7">
          <path d="M-62,108 C-58,150 -50,200 -40,228" />
          <path d="M62,108 C58,150 50,200 40,228" />
          <path d="M-58,-168 C-30,-174 30,-174 58,-168" />
          <path d="M-88,-12 L-98,-12 M88,-12 L98,-12" />
        </g>
        <g fill="none" stroke="#fff" strokeOpacity="0.09" strokeWidth="0.8">
          <path d="M-22,110 C-20,160 -16,200 -12,232" />
          <path d="M22,110 C20,160 16,200 12,232" />
        </g>
        {/* schouderlijnen */}
        <g fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.9">
          <path d="M86,150 C84,90 82,0 86,-110 C88,-150 86,-190 78,-214" />
          <path d="M-86,150 C-84,90 -82,0 -86,-110 C-88,-150 -86,-190 -78,-214" />
        </g>
      </g>

      {/* cabine/interieur — zichtbaar door het glas en wanneer een ruit wordt verwijderd */}
      <path d={CABIN_PATH} fill={`url(#${id("cabin")})`} />
      <g opacity="0.95">
        {/* dashboard */}
        <path d="M-64,92 C-30,98 30,98 64,92 L62,80 C30,84 -30,84 -62,80 Z" fill="#111113" />
        {/* stuur (Nederland: links = +x in deze oriëntatie) */}
        <ellipse cx="34" cy="70" rx="14" ry="3.2" fill="none" stroke="#2c2c31" strokeWidth="2" />
        {/* voorstoelen */}
        {[34, -34].map((x) => (
          <g key={x}>
            <rect x={x - 15} y={18} width="30" height="38" rx="9" fill={`url(#${id("seat")})`} />
            <rect x={x - 13} y={6} width="26" height="12" rx="5" fill="#1f1f23" />
          </g>
        ))}
        {/* middenconsole */}
        <rect x="-6" y="-4" width="12" height="74" rx="3" fill="#0d0d0f" />
        {/* achterbank */}
        <rect x="-58" y="-74" width="116" height="40" rx="10" fill={`url(#${id("seat")})`} />
        <rect x="-56" y="-86" width="112" height="12" rx="5" fill="#1a1a1d" />
      </g>

      {/* dakframe */}
      <path d={ROOF_PATH} fill={`url(#${id("roof")})`} />
      <path d="M-48,24 C-24,21 24,21 48,24 L50,-80 C24,-84 -24,-84 -50,-80 Z" fill="#050506" opacity="0.85" />

      {/* koplampen */}
      {[1, -1].map((s) => (
        <g key={`hl${s}`}>
          <path
            d={`M${30 * s},233 C${50 * s},231 ${70 * s},223 ${84 * s},208 L${80 * s},204 C${68 * s},216 ${50 * s},224 ${30 * s},227 Z`}
            fill="#0c0d10"
            stroke="#3f3f46"
            strokeWidth="0.5"
          />
          <path
            d={`M${34 * s},230 C${52 * s},228 ${68 * s},221 ${80 * s},209`}
            fill="none"
            stroke="#cfe3ff"
            strokeOpacity="0.22"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d={`M${34 * s},230 C${52 * s},228 ${68 * s},221 ${80 * s},209`}
            fill="none"
            stroke="#f4f8ff"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* doorlopende achterlichtbalk */}
      <path d="M-80,-221 C-50,-233 50,-233 80,-221" fill="none" stroke="#e21d2d" strokeOpacity="0.28" strokeWidth="5" strokeLinecap="round" />
      <path d="M-80,-221 C-50,-233 50,-233 80,-221" fill="none" stroke="#ff3343" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Eén ruit met glasmateriaal. */
export function GlassPaneArt({
  part,
  idp = "g",
  className,
}: {
  part: GlassPart;
  idp?: string;
  className?: string;
}) {
  const id = (s: string) => `${idp}-${part.id}-${s}`;
  const isRear = part.id === "achterruit";
  return (
    <svg viewBox={VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("tint")} x1="-1" y1="-1" x2="1" y2="1">
          <stop offset="0" stopColor="#5d7487" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#1e2a35" stopOpacity="0.62" />
          <stop offset="1" stopColor="#0d141b" stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id={id("refl")} x1="0" x2="1" y1="0" y2="0.35">
          <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id("clip")}>
          <path d={part.path} />
        </clipPath>
      </defs>
      {/* glasdikte: donkere rand iets verschoven */}
      <path d={part.path} transform="translate(0.9 1.6)" fill="#0a1016" opacity="0.9" />
      <path d={part.path} fill={`url(#${id("tint")})`} className="glass-fill" />
      <g clipPath={`url(#${id("clip")})`}>
        <rect x="-130" y="-260" width="260" height="520" fill={`url(#${id("refl")})`} />
        {isRear && (
          <g stroke="#d8a36b" strokeOpacity="0.45" strokeWidth="0.45" fill="none">
            {Array.from({ length: 11 }, (_, i) => -104 - i * 5).map((y) => (
              <path key={y} d={`M-52,${y} C-20,${y - 2.5} 20,${y - 2.5} 52,${y}`} />
            ))}
          </g>
        )}
        {/* zwarte zeefdrukrand langs de randen */}
        <path d={part.path} fill="none" stroke="#050505" strokeWidth="4.5" strokeOpacity="0.85" />
      </g>
      {/* geslepen glasrand */}
      <path d={part.path} fill="none" stroke="#cfe0ee" strokeOpacity="0.55" strokeWidth="0.6" className="glass-edge" />

    </svg>
  );
}

/** Sterretje met barstjes op de voorruit (zelfde viewBox, wordt over de voorruit gelegd). */
export function WindshieldDamage({ className }: { className?: string }) {
  return (
    <svg viewBox={VIEWBOX} className={className} aria-hidden="true" focusable="false">
        <g transform="translate(-22 68) scale(1.9)">
          <circle r="7" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.4" />
          <g stroke="#f4f7fb" strokeWidth="0.32" strokeLinecap="round" fill="none" strokeOpacity="0.9">
            <path d="M0,0 L3.2,-1.4 L5.8,-1 L8.6,-2.8" />
            <path d="M0,0 L-2.6,-2.8 L-4.4,-6.2" />
            <path d="M0,0 L-3.8,1.2 L-7.4,0.4 L-9.6,1.8" />
            <path d="M0,0 L0.8,3.6 L2.6,5.6 L2.2,8.4" />
            <path d="M0,0 L2.4,2 L5.2,2.6" />
            <path d="M0,0 L-1.4,3.2 L-3.6,4.8" />
            <path d="M0,0 L0.6,-3.4 L-0.2,-5.6" />
            <path d="M3.2,-1.4 L4,-3.2 M-3.8,1.2 L-4.6,3 M0.8,3.6 L-0.6,4.6" strokeOpacity="0.6" />
          </g>
          <circle r="1.5" fill="#fff" fillOpacity="0.85" />
          <circle r="2.6" fill="#fff" fillOpacity="0.12" />
        </g>
    </svg>
  );
}
