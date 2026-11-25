import Link from "next/link";
import { navItems, site } from "@/lib/site";

export default function Footer({ base = "" }: { base?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink pb-28 pt-20 text-silver lg:pb-12">
      <div className="shell">
        <div className="grid gap-12 border-b border-steel pb-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-[26px] font-bold tracking-[-0.04em] text-paper">
              <span className="text-signal">123</span>RUIT
            </p>
            <p className="mt-1 eyebrow text-[10px]">Autoglas Amersfoort</p>
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed">
              Lokale autoruitspecialist voor reparatie en vervanging van autoruiten, ADAS-kalibratie en verzekeringsafhandeling.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-[10px] text-paper">Contact</p>
            <address className="mt-5 space-y-1 text-[14px] not-italic leading-relaxed">
              <p>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </p>
              <p className="pt-3">
                <a href={site.phoneHref} className="tabular-nums hover:text-paper">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="break-all hover:text-paper">
                  {site.email}
                </a>
              </p>
            </address>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-[10px] text-paper">Openingstijden</p>
            <ul className="mt-5 space-y-1 text-[14px]">
              {site.hours.map((h) => (
                <li key={h.label} className="flex justify-between gap-4">
                  <span>{h.label}</span>
                  <span className="tabular-nums">{h.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footernavigatie" className="md:col-span-2">
            <p className="eyebrow text-[10px] text-paper">Menu</p>
            <ul className="mt-5 space-y-1 text-[14px]">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={`${base}${n.href}`} className="hover:text-paper">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`${base}#schade`} className="hover:text-paper">
                  Schade melden
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-8 text-[12px] sm:flex-row">
          <p>
            © {year} {site.name}
          </p>
          <Link href="/privacy" className="hover:text-paper">
            Privacyverklaring
          </Link>
        </div>
      </div>
    </footer>
  );
}
