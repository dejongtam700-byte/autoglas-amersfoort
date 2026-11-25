import { site, whatsappUrl } from "@/lib/site";
import { ArrowRightIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function Contact() {
  const wa = whatsappUrl();
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-paper py-24 text-ink md:py-36">
      <div className="shell">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-graphite">
              <span className="h-px w-8 bg-signal" aria-hidden="true" />
              Contact en route
            </p>
            <h2 id="contact-title" className="headline-xl mt-8 text-[clamp(2.75rem,5.4vw,5.75rem)]">
              Ruitschade<span className="text-signal">?</span>
              <br />
              Wij helpen je verder.
            </h2>

            <div className="mt-12 grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <a href={site.phoneHref} className="btn-primary tabular-nums">
                <PhoneIcon className="btn-icon" /> Bel direct
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">
                  <WhatsAppIcon className="btn-icon" /> Stuur een WhatsApp
                </a>
              )}
              <a href={site.routeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">
                <MapPinIcon className="btn-icon" /> Plan je route
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <address className="not-italic">
              <dl className="divide-y divide-ink/15 border-y border-ink/15">
                <div className="grid grid-cols-[110px_1fr] gap-4 py-6">
                  <dt className="eyebrow pt-1 text-[10px] text-graphite">Adres</dt>
                  <dd className="text-[17px] leading-relaxed">
                    {site.name}
                    <br />
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                    <a href={site.routeUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-[14px] text-signal hover:text-ink">
                      Route plannen <ArrowRightIcon className="h-4 w-4" />
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-4 py-6">
                  <dt className="eyebrow pt-1 text-[10px] text-graphite">Telefoon</dt>
                  <dd>
                    <a href={site.phoneHref} className="text-[17px] tabular-nums hover:text-signal">
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-4 py-6">
                  <dt className="eyebrow pt-1 text-[10px] text-graphite">E-mail</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 break-all text-[17px] hover:text-signal">
                      <MailIcon className="h-4 w-4 shrink-0 text-signal" />
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-4 py-6">
                  <dt className="eyebrow pt-1 text-[10px] text-graphite">Open</dt>
                  <dd>
                    <ul className="space-y-1.5 text-[16px]">
                      {site.hours.map((h) => (
                        <li key={h.label} className="flex justify-between gap-6">
                          <span>{h.label}</span>
                          <span className="tabular-nums text-graphite">{h.value}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
