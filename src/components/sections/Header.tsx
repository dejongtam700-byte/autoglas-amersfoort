"use client";

import { useEffect, useState } from "react";
import { navItems, site } from "@/lib/site";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/Icons";

export function Logo({ className = "", base = "" }: { className?: string; base?: string }) {
  // Typografisch woordmerk. Vervang door het officiële logo zodra dit beschikbaar en toegestaan is.
  return (
    <a href={`${base}#home`} className={`group flex items-center gap-3 ${className}`} aria-label={`${site.name} — naar boven`}>
      <span className="font-display text-[22px] font-bold leading-none tracking-[-0.04em] text-paper">
        <span className="text-signal">123</span>RUIT
      </span>
      <span className="h-6 w-px bg-steel" aria-hidden="true" />
      <span className="font-display text-[10px] font-medium uppercase leading-[1.25] tracking-[0.2em] text-silver">
        Autoglas
        <br />
        Amersfoort
      </span>
    </a>
  );
}

/** `base` = "/" op subpagina's, zodat ankerlinks naar de homepage verwijzen. */
export default function Header({ base = "" }: { base?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-steel/70 bg-ink/90 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
        Naar de inhoud
      </a>
      <div className="shell flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
        <Logo base={base} />

        <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={`${base}${item.href}`} className="relative font-display text-[14px] text-silver transition-colors hover:text-paper">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <a href={site.phoneHref} className="flex items-center gap-2.5 font-display text-[14px] text-paper tabular-nums hover:text-signal">
            <PhoneIcon className="h-4 w-4 text-signal" />
            {site.phone}
          </a>
          <a href={`${base}#schade`} className="btn-primary min-h-[44px] px-5 text-[14px]">
            Afspraak maken
          </a>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <a href={site.phoneHref} className="grid h-11 w-11 place-items-center text-paper" aria-label={`Bel ${site.phone}`}>
            <PhoneIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center text-paper"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100svh-72px)] overflow-y-auto border-t border-steel bg-ink lg:hidden">
          <nav aria-label="Mobiele navigatie" className="shell flex h-full flex-col py-8">
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <li key={item.href} className="border-b border-steel">
                  <a
                    href={`${base}${item.href}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-5 py-5 font-display text-[32px] font-medium tracking-[-0.03em] text-paper"
                  >
                    <span className="font-display text-[11px] tracking-[0.2em] text-signal tabular-nums">0{i + 1}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto grid gap-3 pt-10">
              <a href={`${base}#schade`} onClick={() => setOpen(false)} className="btn-primary w-full">
                Afspraak maken
              </a>
              <a href={site.phoneHref} className="btn-ghost-dark w-full tabular-nums">
                <PhoneIcon className="btn-icon" /> {site.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
