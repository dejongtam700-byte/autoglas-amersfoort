import { z } from "zod";

/** Gedeeld tussen formulier (client) en API-route (server). */

export const GLASS_VALUES = [
  "voorruit",
  "achterruit",
  "zijruit-lv",
  "zijruit-la",
  "zijruit-rv",
  "zijruit-ra",
  "panoramadak",
  "overig",
] as const;

export const DAMAGE_VALUES = ["sterretje", "barst", "gebroken", "anders", "onbekend"] as const;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] as const;

const currentYear = new Date().getFullYear();
const trimmed = (max: number) => z.string().trim().max(max, `Maximaal ${max} tekens.`);

export const step1Schema = z.object({
  glass: z.enum(GLASS_VALUES, { errorMap: () => ({ message: "Kies welke ruit beschadigd is." }) }),
});

export const step2Schema = z.object({
  damage: z.enum(DAMAGE_VALUES, { errorMap: () => ({ message: "Kies het type schade." }) }),
});

export const step3Schema = z.object({
  kenteken: trimmed(12)
    .transform((v) => v.toUpperCase().replace(/[^A-Z0-9]/g, ""))
    .refine((v) => v.length >= 4 && v.length <= 8, "Vul een geldig kenteken in, bijvoorbeeld AB-123-C."),
  merk: trimmed(40).min(2, "Vul het automerk in."),
  model: trimmed(60).optional().or(z.literal("")),
  bouwjaar: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || (/^\d{4}$/.test(v) && +v >= 1950 && +v <= currentYear + 1), "Vul een geldig bouwjaar in."),
  verzekeraar: trimmed(60).optional().or(z.literal("")),
  lease: z.enum(["ja", "nee"], { errorMap: () => ({ message: "Geef aan of het een leaseauto is." }) }),
});

export const step4Schema = z.object({
  naam: trimmed(80).min(2, "Vul je naam in."),
  telefoon: trimmed(20)
    .refine((v) => /^[+0-9][0-9\s\-()]{7,18}$/.test(v), "Vul een geldig telefoonnummer in."),
  email: trimmed(120).email("Vul een geldig e-mailadres in."),
  datum: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => {
      if (!v) return true;
      const d = new Date(v + "T12:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !Number.isNaN(d.getTime()) && d >= today;
    }, "Kies een datum vanaf vandaag."),
  opmerking: trimmed(1500).optional().or(z.literal("")),
  akkoord: z.literal("ja", { errorMap: () => ({ message: "Geef toestemming om je aanvraag te verwerken." }) }),
});

export const damageRequestSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
export type DamageRequest = z.infer<typeof damageRequestSchema>;

export const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema, step4Schema] as const;

/** Zet een Zod-fout om naar { veld: melding }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
