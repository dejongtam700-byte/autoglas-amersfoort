import { CarIcon, ClockIcon, CoffeeIcon, DocIcon, KeyIcon, MedalIcon, ToolIcon, HomeIcon } from "@/components/ui/Icons";

const POINTS = [
  { icon: MedalIcon, title: "Meer dan 25 jaar ervaring" },
  { icon: HomeIcon, title: "Persoonlijke aandacht" },
  { icon: ToolIcon, title: "Professionele montage" },
  { icon: DocIcon, title: "Hulp bij verzekeringen" },
  { icon: ClockIcon, title: "Snelle dienstverlening" },
  { icon: CoffeeIcon, title: "Wachtruimte met koffie" },
  { icon: KeyIcon, title: "Haal- en brengservice" },
  { icon: CarIcon, title: "Vervangend vervoer" },
];

export default function About() {
  return (
    <section id="over-ons" aria-labelledby="over-title" className="bg-paper py-24 text-ink md:py-36">
      <div className="shell grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3 text-graphite">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            Over ons
          </p>
          <h2 id="over-title" className="headline-lg mt-8 text-[clamp(2.5rem,4.4vw,4.25rem)]">
            Lokaal vakmanschap.
            <br />
            Persoonlijke service.
          </h2>
          <div className="mt-10 max-w-xl space-y-5 text-[17px] leading-relaxed text-graphite">
            <p>
              123RUIT Autoglas Amersfoort is een lokaal familiebedrijf. Al meer dan 25 jaar helpen we automobilisten in Amersfoort en omgeving
              met ruitschade, van een klein sterretje tot een complete nieuwe voorruit.
            </p>
            <p>
              We nemen de tijd om je schade te bekijken, adviseren eerlijk over reparatie of vervanging en
              regelen de afhandeling met je verzekeraar.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pt-4">
          <div className="flex items-end gap-6 border-b border-ink/15 pb-10">
            <span className="font-display text-[clamp(6rem,14vw,11rem)] font-semibold leading-[0.8] tracking-[-0.07em]">
              25<span className="text-signal">+</span>
            </span>
            <p className="max-w-[16ch] pb-2 text-[15px] leading-snug text-graphite">jaar ervaring met autoglas in Amersfoort en omgeving</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2">
            {POINTS.map(({ icon: Icon, title }, i) => (
              <li
                key={title}
                className={`flex items-center gap-4 border-b border-ink/15 py-5 text-[16px] font-medium ${i % 2 ? "sm:border-l sm:pl-6" : "sm:pr-6"}`}
              >
                <Icon className="h-5 w-5 shrink-0 text-signal" />
                {title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
