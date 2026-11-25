"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { BODY_PATH, GLASS_BY_ID, GLASS_PARTS, VIEWBOX, type GlassId } from "@/lib/glass";
import { useGlassSelection } from "@/components/GlassSelection";
import { CarBodyArt, GlassPaneArt, WindshieldDamage } from "./CarArt";

/* ───────────────────────── tijdlijn ───────────────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface Frame {
  explode: number;
  labels: number;
  zoom: number;
  damage: number;
  approach: number;
}

/** Vertaalt scrollvoortgang (0–1) naar de toestand van de scène. */
export function timeline(p: number): Frame {
  const out = smooth(0.2, 0.45, p);
  const back = smooth(0.8, 0.97, p);
  const explode = lerp(0.3, 1, out) * (1 - back);
  const labels = smooth(0.42, 0.5, p) * (1 - smooth(0.6, 0.66, p));
  const zoom = smooth(0.63, 0.71, p) * (1 - smooth(0.78, 0.88, p));
  const damage = smooth(0.66, 0.69, p) * (1 - smooth(0.72, 0.79, p));
  return { explode, labels, zoom, damage, approach: smooth(0, 0.2, p) };
}

export const PHASES = [
  { at: 0, label: "Gemonteerd" },
  { at: 0.3, label: "Exploded view" },
  { at: 0.66, label: "Sterretje herstellen" },
  { at: 0.88, label: "Weer gemonteerd" },
];

/* ───────────────────────── scène-constanten (plan-eenheden) ───────────────────────── */
const SLICES = 12;
const BODY_DEPTH = 34; // zichtbare hoogte van de carrosseriezijkant
const GROUND = 52; // afstand top → vloer
const WHEEL_R = 23;
const WHEELS: Array<[number, number]> = [
  [97, 150],
  [97, -132],
  [-97, 150],
  [-97, -132],
];

/** Labelposities: richting (px) vanaf het ankerpunt in schermruimte. Elk label een eigen kwadrant → geen overlap. */
const LABELS: Array<{ id: GlassId; text: string; dx: number; dy: number }> = [
  { id: "voorruit", text: "Voorruit", dx: -150, dy: 60 },
  { id: "panoramadak", text: "Panoramadak", dx: -120, dy: -110 },
  { id: "achterruit", text: "Achterruit", dx: 150, dy: -20 },
  { id: "zijruit-lv", text: "Zijruit", dx: 130, dy: 70 },
];

interface Props {
  /** Element waarvan de scrollpositie de animatie stuurt. */
  scrollRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
}

export default function ExplodedCar({ scrollRef, reducedMotion }: Props) {
  const { selected, select, startRequest } = useGlassSelection();
  const [hovered, setHovered] = useState<GlassId | null>(null);
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paneRefs = useRef<Partial<Record<GlassId, HTMLDivElement | null>>>({});
  const anchorRefs = useRef<Partial<Record<GlassId, HTMLSpanElement | null>>>({});
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lineRefs = useRef<Array<SVGPolylineElement | null>>([]);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const overlayRef = useRef<SVGSVGElement>(null);
  const damageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const wakeRef = useRef<() => void>(() => {});
  const hoveredRef = useRef<GlassId | null>(null);
  const selectedRef = useRef<string | null>(null);
  useEffect(() => {
    hoveredRef.current = hovered;
    selectedRef.current = selected;
    wakeRef.current();
  }, [hovered, selected]);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const camera = cameraRef.current;
    const stage = stageRef.current;
    if (!viewport || !camera || !stage) return;

    let unit = 1;
    const resize = () => {
      wakeRef.current();
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      unit = w < 1024 ? Math.min(w / 500, h / 480) : Math.max(0.5, Math.min(w / 560, h / 500));
      stage.style.width = `${260 * unit}px`;
      stage.style.height = `${520 * unit}px`;
      stage.style.setProperty("--u", `${unit}px`);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(viewport);

    let current = reducedMotion ? 0.55 : 0; // start gemonteerd, zweeft daarna rustig naar de begintoestand
    let intro = reducedMotion ? 1 : 0;
    let mouseX = 0;
    let mouseY = 0;
    let mx = 0;
    let my = 0;
    const hoverLift: Record<string, number> = {};
    let raf = 0;
    let lastPhase = -1;
    let visible = true;
    let calmFrames = 0;

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = viewport.getBoundingClientRect();
      mouseX = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      mouseY = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    };
    if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(viewport);

    const target = () => {
      if (reducedMotion) return 0.55;
      const el = scrollRef.current;
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      return range > 0 ? clamp(-r.top / range) : 0;
    };

    function tick() {
      raf = 0;
      const t = target();
      current += (t - current) * 0.09;
      if (Math.abs(t - current) < 0.0004) current = t;
      intro += (1 - intro) * 0.035;
      mx += (mouseX - mx) * 0.05;
      my += (mouseY - my) * 0.05;

      const f = timeline(current);
      const explode = f.explode * (reducedMotion ? 1 : smooth(0, 1, intro));

      // camera: subtiele beweging, lichte parallax op de muis
      const tilt = 50 + f.approach * 4 - my * 2.5;
      const yaw = 34 - f.approach * 6 + mx * 4;
      const scale = (0.94 + f.approach * 0.06) * (1 + f.zoom * 0.6);
      const tx = f.zoom * 24;
      const ty = f.zoom * -12;
      camera.style.transform = `translate3d(${tx}%, ${ty}%, 0) scale(${scale})`;
      stage.style.transform = `rotateX(${tilt}deg) rotateZ(${yaw}deg)`;

      for (const part of GLASS_PARTS) {
        const el = paneRefs.current[part.id];
        if (!el) continue;
        const active = hoveredRef.current === part.id || selectedRef.current === part.id;
        const hl = (hoverLift[part.id] ?? 0) + ((active ? 1 : 0) - (hoverLift[part.id] ?? 0)) * 0.15;
        hoverLift[part.id] = hl;
        const e = explode + hl * 0.12;
        const { dx, dy, lift } = part.explode;
        el.style.transform = `translate3d(${dx * e * unit}px, ${dy * e * unit}px, ${(lift * e + hl * 10) * unit * 0.5}px)`;
      }

      if (damageRef.current) damageRef.current.style.opacity = String(f.damage);
      if (hintRef.current) hintRef.current.style.opacity = String(1 - f.zoom);
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${current})`;

      // labels + aanwijslijnen in schermruimte
      const overlay = overlayRef.current;
      if (overlay) {
        const o = overlay.getBoundingClientRect();
        LABELS.forEach((lab, i) => {
          const a = anchorRefs.current[lab.id];
          const label = labelRefs.current[i];
          const line = lineRefs.current[i];
          const dot = dotRefs.current[i];
          if (!a || !label || !line || !dot) return;
          const r = a.getBoundingClientRect();
          const ax = r.left - o.left;
          const ay = r.top - o.top;
          const k = o.width < 520 ? 0.55 : 1;
          const lw = label.offsetWidth;
          const raw = ax + lab.dx * k;
          const lx = lab.dx < 0 ? Math.max(lw + 4, raw) : Math.min(o.width - lw - 4, raw);
          const ly = ay + lab.dy * k;
          const ex = ax + lab.dx * k * 0.55;
          const op = String(f.labels);
          line.setAttribute("points", `${ax},${ay} ${ex},${ly} ${lx},${ly}`);
          line.style.opacity = op;
          dot.setAttribute("cx", String(ax));
          dot.setAttribute("cy", String(ay));
          dot.style.opacity = op;
          label.style.opacity = op;
          label.style.transform = `translate(${lx}px, ${ly}px) translate(${lab.dx < 0 ? "-100%" : "0"}, -50%)`;
        });
      }

      const ph = PHASES.reduce((acc, p, i) => (current >= p.at - 0.02 ? i : acc), 0);
      if (ph !== lastPhase) {
        lastPhase = ph;
        setPhase(ph);
      }

      const settled =
        Math.abs(t - current) < 0.0005 &&
        1 - intro < 0.002 &&
        Math.abs(mouseX - mx) < 0.002 &&
        Math.abs(mouseY - my) < 0.002 &&
        Object.values(hoverLift).every((v) => v < 0.002 || v > 0.998);
      calmFrames = settled ? calmFrames + 1 : 0;
      // na het tot rust komen nog enkele frames doorrekenen, zodat labels na late layoutwijzigingen kloppen
      if (visible && calmFrames < 15) raf = requestAnimationFrame(tick);
    }
    const wake = () => {
      calmFrames = 0;
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("load", wake);
    document.fonts?.ready.then(wake).catch(() => {});
    wakeRef.current = wake;
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", wake, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("load", wake);
      window.removeEventListener("pointermove", wake);
    };
  }, [scrollRef, reducedMotion]);

  const info = hovered ?? (selected && selected !== "overig" ? selected : null);
  const infoPart = info ? GLASS_BY_ID[info] : null;

  return (
    <div className="relative h-full w-full">
      {/* 3D-viewport — geen kader: de studiovloer loopt over in de pagina-achtergrond */}
      <div ref={viewportRef} className="car-viewport absolute inset-0" style={{ perspective: "1600px" }}>
        <div ref={cameraRef} className="absolute inset-0 grid place-items-center will-change-transform" style={{ transformStyle: "preserve-3d" }}>
          <div
            ref={stageRef}
            className="relative will-change-transform"
            style={
              {
                transformStyle: "preserve-3d",
                "--u": "1.2px",
                width: "calc(var(--u) * 260)",
                height: "calc(var(--u) * 520)",
                transform: "rotateX(50deg) rotateZ(34deg)",
              } as CSSProperties
            }
          >
            {/* vloer: schaduw + dunne rode lichtring */}
            <div className="absolute inset-0" style={{ transform: `translateZ(calc(var(--u) * -${GROUND}))` }}>
              <svg viewBox={VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                <defs>
                  <radialGradient id="floor-shadow">
                    <stop offset="0" stopColor="#000" stopOpacity="0.95" />
                    <stop offset="0.7" stopColor="#000" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#000" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="0" cy="0" rx="135" ry="280" fill="url(#floor-shadow)" />
                <ellipse cx="0" cy="0" rx="175" ry="310" fill="none" stroke="#e21d2d" strokeOpacity="0.12" strokeWidth="9" />
                <ellipse cx="0" cy="0" rx="175" ry="310" fill="none" stroke="#e21d2d" strokeOpacity="0.3" strokeWidth="3" />
                <ellipse cx="0" cy="0" rx="175" ry="310" fill="none" stroke="#ff4a55" strokeOpacity="0.9" strokeWidth="0.7" />
                <ellipse cx="0" cy="0" rx="198" ry="334" fill="none" stroke="#a1a1aa" strokeOpacity="0.12" strokeWidth="0.5" strokeDasharray="2 6" />
              </svg>
            </div>

            {/* wielen (staande vlakken) */}
            {WHEELS.map(([x, y], i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `calc(50% + var(--u) * ${x})`,
                  top: `calc(50% + var(--u) * ${y})`,
                  width: `calc(var(--u) * ${WHEEL_R * 2})`,
                  height: `calc(var(--u) * ${WHEEL_R * 2})`,
                  transform: `translate(-50%, -50%) translateZ(calc(var(--u) * ${-GROUND + WHEEL_R})) rotateY(90deg)`,
                }}
              >
                <svg viewBox="-50 -50 100 100" className="h-full w-full" aria-hidden="true">
                  <circle r="50" fill="#050505" />
                  <circle r="46" fill="none" stroke="#1d1d20" strokeWidth="3" />
                  <circle r="34" fill="#2b2b30" />
                  {Array.from({ length: 10 }, (_, k) => (
                    <path key={k} d="M0,-31 L4,-8 L-4,-8 Z" fill="#8b8b94" transform={`rotate(${k * 36})`} />
                  ))}
                  <circle r="31" fill="none" stroke="#a1a1aa" strokeWidth="1.5" />
                  <circle r="8" fill="#18181b" stroke="#6b6b73" strokeWidth="1" />
                </svg>
              </div>
            ))}

            {/* carrosseriezijkant: gestapelde silhouetten geven volume */}
            {Array.from({ length: SLICES }, (_, i) => {
              const z = -((i + 1) / SLICES) * BODY_DEPTH;
              const t = i / (SLICES - 1);
              const shade = Math.round(lerp(52, 10, Math.pow(t, 0.7)));
              const inset = i > SLICES - 4 ? (i - (SLICES - 4)) * 1.6 : 0; // ondersteboven inlopende onderkant
              return (
                <div key={i} className="absolute inset-0" style={{ transform: `translateZ(calc(var(--u) * ${z})) scale(${1 - inset / 200}, ${1 - inset / 500})` }}>
                  <svg viewBox={VIEWBOX} className="h-full w-full" aria-hidden="true">
                    <path d={BODY_PATH} fill={`rgb(${shade},${shade},${shade + 3})`} />
                  </svg>
                </div>
              );
            })}

            {/* bovenzijde carrosserie */}
            <div className="absolute inset-0">
              <CarBodyArt idp="hero" className="h-full w-full overflow-visible" />
            </div>

            {/* glas: uitsluitend deze lagen bewegen */}
            {GLASS_PARTS.map((part) => {
              const active = hovered === part.id || selected === part.id;
              return (
                <div
                  key={part.id}
                  ref={(el) => {
                    paneRefs.current[part.id] = el;
                  }}
                  className="pointer-events-none absolute inset-0 will-change-transform"
                  data-active={active || undefined}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <GlassPaneArt part={part} idp="hero" className="pane-art absolute inset-0 h-full w-full overflow-visible" />
                  {part.id === "voorruit" && (
                    <div ref={damageRef} className="absolute inset-0 opacity-0">
                      <WindshieldDamage className="absolute inset-0 h-full w-full overflow-visible" />
                    </div>
                  )}
                  {/* klikbaar vlak met dezelfde vorm */}
                  <svg viewBox={VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible">
                    <path
                      d={part.path}
                      role="button"
                      tabIndex={0}
                      aria-label={`${part.label} selecteren voor een schadeaanvraag`}
                      aria-pressed={selected === part.id}
                      className="pane-hit pointer-events-auto cursor-pointer outline-none"
                      onPointerEnter={() => setHovered(part.id)}
                      onPointerLeave={() => setHovered((h) => (h === part.id ? null : h))}
                      onFocus={() => setHovered(part.id)}
                      onBlur={() => setHovered((h) => (h === part.id ? null : h))}
                      onClick={() => select(part.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          select(part.id);
                        }
                      }}
                    />
                  </svg>
                  <span
                    ref={(el) => {
                      anchorRefs.current[part.id] = el;
                    }}
                    className="absolute h-px w-px"
                    style={{ left: `${((part.anchor[0] + 130) / 260) * 100}%`, top: `${((part.anchor[1] + 260) / 520) * 100}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* aanwijslijnen + labels (HTML/SVG in schermruimte → altijd scherp) */}
      <svg ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {LABELS.map((l, i) => (
          <g key={l.id}>
            <polyline
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              fill="none"
              stroke="#E21D2D"
              strokeWidth="1"
              style={{ opacity: 0 }}
            />
            <circle
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              r="3"
              fill="#09090B"
              stroke="#E21D2D"
              strokeWidth="1.5"
              style={{ opacity: 0 }}
            />
          </g>
        ))}
      </svg>
      {LABELS.map((l, i) => (
        <div
          key={l.id}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 px-2 font-display text-[11px] font-medium uppercase tracking-[0.18em] text-paper"
          style={{ opacity: 0 }}
        >
          <span className="text-signal">●</span> {l.text}
        </div>
      ))}

      {/* fasebalk */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0 hidden lg:block" aria-hidden="true">
        <div className="relative h-px bg-steel">
          <div ref={progressBarRef} className="absolute inset-0 origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="mt-3 grid grid-cols-4">
          {PHASES.map((p, i) => (
            <div key={p.label} className={`font-display text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${i === phase ? "text-paper" : "text-silver/50"}`}>
              <span className="mr-2 tabular-nums">0{i + 1}</span>
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* ruitinformatie bij hover/selectie */}
      <div ref={hintRef} className="absolute bottom-0 right-0 w-[min(280px,70%)] lg:bottom-[72px]" aria-live="polite">
        {infoPart ? (
          <div className="border-l border-signal bg-ink/80 py-3 pl-4 pr-3 backdrop-blur-sm">
            <p className="font-display text-[10px] uppercase tracking-[0.22em] text-silver">
              {selected === infoPart.id ? "Geselecteerd" : "Ruit"}
            </p>
            <p className="mt-1 font-display text-lg font-medium text-paper">{infoPart.label}</p>
            <p className="mt-1 text-[13px] leading-snug text-silver">{infoPart.description}</p>
            {selected === infoPart.id && (
              <button type="button" onClick={() => startRequest(infoPart.id)} className="btn-link mt-3">
                Start schadeaanvraag <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        ) : ready ? (
          <p className="hidden border-l border-steel pl-4 text-[12px] leading-snug text-silver lg:block">
            <span className="font-display uppercase tracking-[0.2em] text-paper">Interactief</span>
            <br />
            Wijs een ruit aan en klik om direct een schadeaanvraag te starten.
          </p>
        ) : null}
      </div>
    </div>
  );
}
