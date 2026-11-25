const STEPS = [
  { title: "Meld je schade", text: "Via het formulier, telefonisch of langs in de werkplaats. Een foto helpt ons direct verder." },
  { title: "Wij beoordelen de ruitschade", text: "We kijken of reparatie mogelijk is of dat de ruit vervangen moet worden, en regelen de verzekering." },
  { title: "Maak een afspraak", text: "Op een moment dat jou uitkomt. Vaak kun je al binnen 24 uur terecht." },
  { title: "Weer veilig onderweg", text: "Vakkundig gemonteerd en waar nodig gekalibreerd. Je rijdt weer met helder zicht weg." },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="werkwijze-title" className="bg-anthracite py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="eyebrow flex items-center gap-3 self-start text-silver md:col-span-4 md:mt-5">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            Zo werkt het
          </p>
          <h2 id="werkwijze-title" className="headline-lg max-w-[14ch] text-paper md:col-span-8">
            Van ruitschade naar helder zicht.
          </h2>
        </div>

        <ol className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-4 md:gap-8">
          {/* verbindingslijn */}
          <span className="absolute left-0 right-0 top-[38px] hidden h-px bg-steel md:block" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[72px_1fr] gap-5 md:block">
              <div className="relative">
                <span className="block font-display text-[64px] font-semibold leading-none tracking-[-0.06em] text-paper/90 tabular-nums md:text-[76px]">
                  0{i + 1}
                </span>
                <span className="absolute left-0 top-[38px] hidden h-[7px] w-[7px] -translate-y-1/2 bg-signal md:block md:left-auto md:right-6" aria-hidden="true" />
              </div>
              <div className="md:mt-10 md:pr-6">
                <h3 className="font-display text-[20px] font-medium tracking-[-0.02em] text-paper md:text-[22px]">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-silver">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
