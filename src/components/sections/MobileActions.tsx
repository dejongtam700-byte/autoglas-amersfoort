import { site, whatsappUrl } from "@/lib/site";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Vaste actiebalk op mobiel + zwevende WhatsApp-knop op desktop (alleen als het nummer is geconfigureerd). */
export default function MobileActions() {
  const wa = whatsappUrl();
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-steel bg-ink/95 backdrop-blur-md lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className={`grid ${wa ? "grid-cols-3" : "grid-cols-2"}`}>
          <a href={site.phoneHref} className="flex h-14 items-center justify-center gap-2 font-display text-[14px] text-paper">
            <PhoneIcon className="h-4 w-4 text-signal" /> Bellen
          </a>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center gap-2 border-l border-steel font-display text-[14px] text-paper">
              <WhatsAppIcon className="h-4 w-4 text-signal" /> WhatsApp
            </a>
          )}
          <a href="#schade" className="flex h-14 items-center justify-center bg-signal font-display text-[14px] font-medium text-white">
            Afspraak maken
          </a>
        </div>
      </div>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Stuur ons een WhatsApp-bericht"
          className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center bg-[#1f1f22] text-paper shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:bg-signal lg:grid"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
      )}
    </>
  );
}
