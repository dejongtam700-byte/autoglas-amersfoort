"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useGlassSelection } from "@/components/GlassSelection";
import CarPlanSelector from "./CarPlanSelector";
import { DAMAGE_GLASS_OPTIONS, DAMAGE_TYPES, type DamageGlassId } from "@/lib/glass";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES, STEP_SCHEMAS, fieldErrors } from "@/lib/damage-schema";
import { site } from "@/lib/site";
import { AlertIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, MailIcon, PhoneIcon, UploadIcon } from "@/components/ui/Icons";

type Values = {
  glass: string;
  damage: string;
  kenteken: string;
  merk: string;
  model: string;
  bouwjaar: string;
  verzekeraar: string;
  lease: string;
  naam: string;
  telefoon: string;
  email: string;
  datum: string;
  opmerking: string;
  akkoord: string;
};

const EMPTY: Values = {
  glass: "",
  damage: "",
  kenteken: "",
  merk: "",
  model: "",
  bouwjaar: "",
  verzekeraar: "",
  lease: "",
  naam: "",
  telefoon: "",
  email: "",
  datum: "",
  opmerking: "",
  akkoord: "",
};

const STEPS = ["Ruit", "Schade", "Voertuig", "Contact"];

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string; notConfigured?: boolean };

/* kleine glyphs voor de schadetypes */
const DamageGlyph = ({ id }: { id: string }) => {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      {id === "sterretje" && (
        <g {...common}>
          <circle cx="20" cy="20" r="2" fill="currentColor" />
          <path d="M20 20l7-3M20 20l-5-7M20 20l-8 2M20 20l2 8M20 20l6 5" />
        </g>
      )}
      {id === "barst" && <path {...common} d="M5 28l8-4 5 3 6-8 5 2 6-9" />}
      {id === "gebroken" && (
        <g {...common}>
          <path d="M20 20L6 8M20 20l14-10M20 20L4 26M20 20l16 8M20 20l-2 16M20 20l3-16" />
          <circle cx="20" cy="20" r="6" />
        </g>
      )}
      {id === "anders" && (
        <g {...common}>
          <rect x="7" y="9" width="26" height="22" />
          <path d="M13 20h14" />
        </g>
      )}
      {id === "onbekend" && (
        <g {...common}>
          <circle cx="20" cy="20" r="13" />
          <path d="M16 16a4 4 0 1 1 5.5 3.7c-1 .4-1.5 1.2-1.5 2.3v1M20 27v.5" />
        </g>
      )}
    </svg>
  );
};

function Field({
  id,
  label,
  optional,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow mb-2 flex justify-between text-[10px] text-silver">
        <span>{label}</span>
        {optional && <span className="tracking-[0.14em] text-silver/60 normal-case">optioneel</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[13px] text-[#ff5a66]">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "h-14 w-full border border-steel bg-anthracite px-4 text-[16px] text-paper placeholder:text-silver/40 transition-colors outline-none focus:border-signal aria-[invalid=true]:border-[#ff5a66]";

export default function DamageForm() {
  const { selected, select } = useGlassSelection();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const uid = useId();
  const fid = (n: string) => `${uid}-${n}`;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Selectie vanuit de 3D-auto overnemen
  useEffect(() => {
    if (selected && selected !== values.glass) {
      setValues((v) => ({ ...v, glass: selected }));
      setErrors((e) => ({ ...e, glass: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const set = (k: keyof Values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const chooseGlass = (id: DamageGlassId) => {
    set("glass", id);
    select(id);
  };

  const validateStep = (i: number) => {
    const res = STEP_SCHEMAS[i].safeParse(values);
    if (res.success) {
      setErrors({});
      return true;
    }
    setErrors(fieldErrors(res.error));
    return false;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onFile = (f: File | null) => {
    if (!f) return setFile(null);
    if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(f.type)) {
      setErrors((e) => ({ ...e, foto: "Alleen JPG, PNG, WEBP of HEIC." }));
      return setFile(null);
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setErrors((e) => ({ ...e, foto: "De foto is groter dan 8 MB." }));
      return setFile(null);
    }
    setErrors((e) => ({ ...e, foto: "" }));
    setFile(f);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) return next();
    if (!validateStep(3)) return;
    // alle stappen nogmaals controleren
    for (let i = 0; i < 3; i++) {
      if (!STEP_SCHEMAS[i].safeParse(values).success) {
        setStep(i);
        validateStep(i);
        return;
      }
    }
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("foto", file);
    fd.append("startedAt", String(startedAt.current));
    fd.append("website", (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "");

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/schade", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; message?: string; fields?: Record<string, string> } | null;
      if (res.ok && data?.ok) {
        setStatus({ kind: "success" });
        return;
      }
      if (data?.fields) setErrors(data.fields);
      setStatus({
        kind: "error",
        notConfigured: data?.error === "not_configured",
        message: data?.message ?? "Verzenden is niet gelukt. Probeer het opnieuw of bel ons.",
      });
    } catch {
      setStatus({ kind: "error", message: "Er is geen verbinding met de server. Probeer het opnieuw of bel ons." });
    }
  };

  const glassLabel = DAMAGE_GLASS_OPTIONS.find((g) => g.id === values.glass)?.label;
  const damageLabel = DAMAGE_TYPES.find((d) => d.id === values.damage)?.label;

  const err = (k: string) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${fid(k)}-err` } : {};

  if (status.kind === "success") {
    return (
      <div className="border border-steel bg-anthracite p-8 md:p-12" role="status">
        <div className="grid h-12 w-12 place-items-center bg-signal text-white">
          <CheckIcon className="h-6 w-6" />
        </div>
        <h3 className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] text-paper">Aanvraag ontvangen.</h3>
        <p className="mt-3 max-w-md text-silver">
          Bedankt, {values.naam.split(" ")[0]}. We bekijken je {glassLabel?.toLowerCase()} en nemen zo snel mogelijk contact met je op via{" "}
          {values.telefoon}.
        </p>
        <a href={site.phoneHref} className="btn-ghost-dark mt-8 tabular-nums">
          <PhoneIcon className="btn-icon" /> Spoed? Bel {site.phone}
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      {/* ─── formulier ─── */}
      <form onSubmit={submit} noValidate className="lg:col-span-7" aria-describedby={fid("progress")}>
        {/* voortgang */}
        <ol id={fid("progress")} className="grid grid-cols-4 gap-2" aria-label="Voortgang">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined}>
              <div className={`h-[3px] transition-colors duration-500 ${i <= step ? "bg-signal" : "bg-steel"}`} />
              <p className={`eyebrow mt-3 text-[10px] ${i === step ? "text-paper" : "text-silver/60"}`}>
                <span className="tabular-nums">0{i + 1}</span> <span className="hidden sm:inline">{s}</span>
              </p>
            </li>
          ))}
        </ol>
        <p className="sr-only" aria-live="polite">
          Stap {step + 1} van 4: {STEPS[step]}
        </p>

        {/* honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="mt-10 min-h-[420px]">
          {step === 0 && (
            <fieldset>
              <legend className="contents">
                <h3 ref={headingRef} tabIndex={-1} data-form-focus className="font-display text-[28px] font-semibold tracking-[-0.03em] text-paper outline-none md:text-[34px]">
                  Welke ruit is beschadigd?
                </h3>
              </legend>
              <p className="mt-2 text-[15px] text-silver">Kies op de auto of in de lijst.</p>

              <div className="mx-auto mt-8 w-[150px] lg:hidden">
                <CarPlanSelector value={(values.glass || null) as DamageGlassId | null} onChange={chooseGlass} />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Beschadigde ruit">
                {DAMAGE_GLASS_OPTIONS.map((g) => {
                  const on = values.glass === g.id;
                  return (
                    <label
                      key={g.id}
                      className={`flex min-h-[56px] cursor-pointer items-center justify-between gap-3 border px-4 text-[15px] transition-colors ${
                        on ? "border-signal bg-signal/10 text-paper" : "border-steel text-silver hover:border-silver hover:text-paper"
                      }`}
                    >
                      <input type="radio" name="glass" value={g.id} checked={on} onChange={() => chooseGlass(g.id)} className="sr-only" />
                      {g.label}
                      <span className={`grid h-4 w-4 place-items-center border ${on ? "border-signal bg-signal" : "border-graphite"}`} aria-hidden="true">
                        {on && <CheckIcon className="h-3 w-3 text-white" strokeWidth={2.5} />}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.glass && <p className="mt-3 text-[13px] text-[#ff5a66]">{errors.glass}</p>}
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="contents">
                <h3 ref={headingRef} tabIndex={-1} className="font-display text-[28px] font-semibold tracking-[-0.03em] text-paper outline-none md:text-[34px]">
                  Wat voor schade heb je?
                </h3>
              </legend>
              <p className="mt-2 text-[15px] text-silver">Twijfel je? Kies &lsquo;Weet ik niet&rsquo; — wij beoordelen het voor je.</p>
              <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Type schade">
                {DAMAGE_TYPES.map((d) => {
                  const on = values.damage === d.id;
                  return (
                    <label
                      key={d.id}
                      className={`flex min-h-[120px] cursor-pointer flex-col justify-between border p-4 transition-colors ${
                        on ? "border-signal bg-signal/10 text-paper" : "border-steel text-silver hover:border-silver hover:text-paper"
                      }`}
                    >
                      <input type="radio" name="damage" value={d.id} checked={on} onChange={() => set("damage", d.id)} className="sr-only" />
                      <span className={on ? "text-signal" : ""}>
                        <DamageGlyph id={d.id} />
                      </span>
                      <span className="font-display text-[16px] font-medium">{d.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors.damage && <p className="mt-3 text-[13px] text-[#ff5a66]">{errors.damage}</p>}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="contents">
                <h3 ref={headingRef} tabIndex={-1} className="font-display text-[28px] font-semibold tracking-[-0.03em] text-paper outline-none md:text-[34px]">
                  Voertuiggegevens
                </h3>
              </legend>
              <p className="mt-2 text-[15px] text-silver">Met het kenteken zoeken we de juiste ruit voor jouw auto.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field id={fid("kenteken")} label="Kenteken" error={errors.kenteken} className="sm:col-span-2">
                  <div className="flex h-16 max-w-[300px] items-stretch overflow-hidden border-2 border-[#111] bg-[#f7c600]">
                    <span className="flex w-9 flex-col items-center justify-end bg-[#003399] pb-1.5 font-display text-[11px] font-bold text-white" aria-hidden="true">
                      NL
                    </span>
                    <input
                      id={fid("kenteken")}
                      value={values.kenteken}
                      onChange={(e) => set("kenteken", e.target.value.toUpperCase())}
                      placeholder="AB-123-C"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      className="w-full bg-transparent px-4 font-display text-[26px] font-bold tracking-[0.08em] text-[#111] placeholder:text-[#111]/30 outline-none"
                      {...err("kenteken")}
                    />
                  </div>
                </Field>
                <Field id={fid("merk")} label="Automerk" error={errors.merk}>
                  <input id={fid("merk")} value={values.merk} onChange={(e) => set("merk", e.target.value)} className={inputCls} placeholder="Bijv. Volkswagen" {...err("merk")} />
                </Field>
                <Field id={fid("model")} label="Model" optional error={errors.model}>
                  <input id={fid("model")} value={values.model} onChange={(e) => set("model", e.target.value)} className={inputCls} placeholder="Bijv. Golf" />
                </Field>
                <Field id={fid("bouwjaar")} label="Bouwjaar" optional error={errors.bouwjaar}>
                  <input
                    id={fid("bouwjaar")}
                    inputMode="numeric"
                    maxLength={4}
                    value={values.bouwjaar}
                    onChange={(e) => set("bouwjaar", e.target.value.replace(/\D/g, ""))}
                    className={inputCls}
                    placeholder="Bijv. 2019"
                    {...err("bouwjaar")}
                  />
                </Field>
                <Field id={fid("verzekeraar")} label="Verzekeringsmaatschappij" optional error={errors.verzekeraar}>
                  <input id={fid("verzekeraar")} value={values.verzekeraar} onChange={(e) => set("verzekeraar", e.target.value)} className={inputCls} />
                </Field>
                <fieldset className="sm:col-span-2">
                  <legend className="eyebrow mb-2 text-[10px] text-silver">Leaseauto</legend>
                  <div className="grid max-w-[300px] grid-cols-2 gap-2" role="radiogroup" aria-label="Leaseauto">
                    {[
                      ["ja", "Ja"],
                      ["nee", "Nee"],
                    ].map(([v, l]) => (
                      <label
                        key={v}
                        className={`flex h-14 cursor-pointer items-center justify-center border text-[15px] transition-colors ${
                          values.lease === v ? "border-signal bg-signal/10 text-paper" : "border-steel text-silver hover:border-silver"
                        }`}
                      >
                        <input type="radio" name="lease" value={v} checked={values.lease === v} onChange={() => set("lease", v)} className="sr-only" />
                        {l}
                      </label>
                    ))}
                  </div>
                  {errors.lease && <p className="mt-2 text-[13px] text-[#ff5a66]">{errors.lease}</p>}
                </fieldset>
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend className="contents">
                <h3 ref={headingRef} tabIndex={-1} className="font-display text-[28px] font-semibold tracking-[-0.03em] text-paper outline-none md:text-[34px]">
                  Je contactgegevens
                </h3>
              </legend>
              <p className="mt-2 text-[15px] text-silver">We gebruiken deze gegevens alleen om je aanvraag te behandelen.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field id={fid("naam")} label="Naam" error={errors.naam} className="sm:col-span-2">
                  <input id={fid("naam")} autoComplete="name" value={values.naam} onChange={(e) => set("naam", e.target.value)} className={inputCls} {...err("naam")} />
                </Field>
                <Field id={fid("telefoon")} label="Telefoonnummer" error={errors.telefoon}>
                  <input id={fid("telefoon")} type="tel" autoComplete="tel" value={values.telefoon} onChange={(e) => set("telefoon", e.target.value)} className={inputCls} {...err("telefoon")} />
                </Field>
                <Field id={fid("email")} label="E-mailadres" error={errors.email}>
                  <input id={fid("email")} type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={inputCls} {...err("email")} />
                </Field>
                <Field id={fid("datum")} label="Gewenste afspraakdatum" optional error={errors.datum}>
                  <input id={fid("datum")} type="date" value={values.datum} onChange={(e) => set("datum", e.target.value)} className={`${inputCls} [color-scheme:dark]`} {...err("datum")} />
                </Field>
                <Field id={fid("foto")} label="Foto van de schade" optional error={errors.foto}>
                  <label
                    htmlFor={fid("foto")}
                    className="flex h-14 cursor-pointer items-center gap-3 border border-dashed border-graphite px-4 text-[14px] text-silver transition-colors hover:border-silver hover:text-paper"
                  >
                    <UploadIcon className="h-4 w-4 shrink-0 text-signal" />
                    <span className="truncate">{file ? file.name : "Kies een foto (max. 8 MB)"}</span>
                  </label>
                  <input
                    id={fid("foto")}
                    type="file"
                    accept={ALLOWED_UPLOAD_TYPES.join(",")}
                    className="sr-only"
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                    {...err("foto")}
                  />
                </Field>
                <Field id={fid("opmerking")} label="Aanvullende informatie" optional error={errors.opmerking} className="sm:col-span-2">
                  <textarea
                    id={fid("opmerking")}
                    rows={3}
                    value={values.opmerking}
                    onChange={(e) => set("opmerking", e.target.value)}
                    className={`${inputCls} h-auto py-3`}
                    placeholder="Bijv. waar de schade zit of wanneer je auto beschikbaar is"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-silver">
                    <input
                      type="checkbox"
                      checked={values.akkoord === "ja"}
                      onChange={(e) => set("akkoord", e.target.checked ? "ja" : "")}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[#e21d2d]"
                      {...err("akkoord")}
                    />
                    <span>
                      Ik geef toestemming om mijn gegevens te gebruiken voor het behandelen van deze aanvraag. Lees de{" "}
                      <Link href="/privacy" className="text-paper underline underline-offset-4 hover:text-signal">
                        privacyverklaring
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.akkoord && (
                    <p id={`${fid("akkoord")}-err`} className="mt-2 text-[13px] text-[#ff5a66]">
                      {errors.akkoord}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>
          )}
        </div>

        {status.kind === "error" && (
          <div role="alert" className="mt-8 flex gap-4 border-l-2 border-signal bg-signal/10 p-5">
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
            <div className="text-[14px] leading-relaxed text-paper">
              <p className="font-medium">{status.notConfigured ? "Je aanvraag is niet verzonden." : status.message}</p>
              {status.notConfigured && <p className="mt-1 text-silver">{status.message}</p>}
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                <a href={site.phoneHref} className="inline-flex items-center gap-2 text-paper underline underline-offset-4 tabular-nums">
                  <PhoneIcon className="h-4 w-4" /> {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-paper underline underline-offset-4">
                  <MailIcon className="h-4 w-4" /> {site.email}
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-steel pt-6">
          {step > 0 ? (
            <button type="button" onClick={back} className="inline-flex h-12 items-center gap-2 font-display text-[14px] text-silver hover:text-paper">
              <ArrowLeftIcon className="h-4 w-4" /> Vorige
            </button>
          ) : (
            <span className="text-[13px] text-silver/70">Duurt ongeveer 1 minuut</span>
          )}
          {step < 3 ? (
            <button type="button" onClick={next} className="btn-primary min-w-[180px]">
              Volgende <ArrowRightIcon className="btn-icon" />
            </button>
          ) : (
            <button type="submit" disabled={status.kind === "submitting"} className="btn-primary min-w-[200px] disabled:opacity-60">
              {status.kind === "submitting" ? "Bezig met verzenden…" : "Verstuur aanvraag"}
              {status.kind !== "submitting" && <ArrowRightIcon className="btn-icon" />}
            </button>
          )}
        </div>
      </form>

      {/* ─── visuele samenvatting ─── */}
      <aside className="hidden lg:col-span-5 lg:block" aria-label="Samenvatting">
        <div className="sticky top-28 grid grid-cols-[180px_1fr] gap-10 border-l border-steel pl-10">
          <div className="pt-6">
            <CarPlanSelector
              value={(values.glass || null) as DamageGlassId | null}
              onChange={chooseGlass}
              interactive={step === 0}
            />
          </div>
          <dl className="space-y-6 self-center">
            {[
              ["Ruit", glassLabel],
              ["Schade", damageLabel],
              ["Kenteken", values.kenteken || undefined],
              ["Voertuig", [values.merk, values.model].filter(Boolean).join(" ") || undefined],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-steel pb-4">
                <dt className="eyebrow text-[10px] text-silver/70">{k}</dt>
                <dd className={`mt-1.5 font-display text-[18px] ${v ? "text-paper" : "text-silver/40"}`}>{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}
