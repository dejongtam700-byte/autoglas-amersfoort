import { ClockIcon, HomeIcon, MedalIcon, ShieldIcon } from "@/components/ui/Icons";

const ITEMS = [
  { icon: MedalIcon, big: "25+", small: "Jaar ervaring met autoglas" },
  { icon: ClockIcon, big: "24 uur", small: "Vaak binnen 24 uur geholpen" },
  { icon: ShieldIcon, big: "BOVAG", small: "Aangesloten bij BOVAG" },
  { icon: HomeIcon, big: "Lokaal", small: "Familiebedrijf in Amersfoort" },
];

export default function TrustBar() {
  return (
    <section aria-label="Waarom 123RUIT Autoglas Amersfoort" className="relative z-10 border-y border-steel bg-ink">
      <ul className="shell grid grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, big, small }, i) => (
          <li
            key={big}
            className={`flex flex-col gap-4 py-8 md:py-12 ${i % 2 ? "border-l border-steel pl-5 md:pl-8" : "pr-5"} ${
              i > 1 ? "border-t border-steel lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l lg:pl-8" : ""} ${i > 0 ? "lg:pl-8" : ""}`}
          >
            <Icon className="h-5 w-5 text-signal" />
            <div>
              <p className="font-display text-[30px] font-semibold leading-none tracking-[-0.04em] text-paper md:text-[44px]">{big}</p>
              <p className="mt-2 text-[13px] leading-snug text-silver md:text-[14px]">{small}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
