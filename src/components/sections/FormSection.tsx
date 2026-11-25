import DamageForm from "@/components/form/DamageForm";
import { site } from "@/lib/site";

export default function FormSection() {
  return (
    <section id="schade" aria-labelledby="schade-title" className="relative bg-ink py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="eyebrow flex items-center gap-3 self-start text-silver md:col-span-4 md:mt-5">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            Schade melden
          </p>
          <div className="md:col-span-8">
            <h2 id="schade-title" className="headline-lg text-paper">
              Meld je ruitschade
              <br />
              in vier stappen.
            </h2>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-silver">
              We nemen zo snel mogelijk contact met je op. Liever direct iemand spreken? Bel{" "}
              <a href={site.phoneHref} className="text-paper underline underline-offset-4 hover:text-signal tabular-nums">
                {site.phone}
              </a>
              .
            </p>
          </div>
        </div>
        <div className="mt-16 md:mt-20">
          <DamageForm />
        </div>
      </div>
    </section>
  );
}
