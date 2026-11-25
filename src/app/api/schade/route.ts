import { NextResponse } from "next/server";
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  damageRequestSchema,
  fieldErrors,
  type DamageRequest,
} from "@/lib/damage-schema";
import { DAMAGE_GLASS_OPTIONS, DAMAGE_TYPES } from "@/lib/glass";

/**
 * POST /api/schade — verwerkt een schadeaanvraag.
 *
 * - Validatie met Zod (zelfde schema als het formulier).
 * - Spambescherming: honeypot-veld, minimale invultijd en eenvoudige rate limit per IP.
 * - Upload: alleen afbeeldingen, max. 8 MB, MIME-type én bestandshandtekening gecontroleerd.
 * - Verzending via de Resend REST-API. Er wordt niets opgeslagen: gegevens gaan alleen per e-mail naar het bedrijf.
 * - Zonder RESEND_API_KEY / MAIL_FROM / MAIL_TO antwoordt de route met 503 "not_configured"
 *   zodat de bezoeker nooit een valse bevestiging ziet.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 4000;
const RATE_LIMIT = 5; // aanvragen
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minuten
// Let op: in een serverless omgeving is dit geheugen per instantie. Voor strengere limieten: Vercel KV / Upstash.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

/** Controleert de eerste bytes van het bestand, zodat een hernoemd bestand niet als afbeelding doorgaat. */
function hasImageSignature(buf: Uint8Array, type: string) {
  const ascii = (from: number, to: number) => String.fromCharCode(...buf.slice(from, to));
  switch (type) {
    case "image/jpeg":
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case "image/png":
      return buf[0] === 0x89 && ascii(1, 4) === "PNG";
    case "image/webp":
      return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "image/heic":
    case "image/heif":
      return ascii(4, 8) === "ftyp";
    default:
      return false;
  }
}

function labelFor(list: ReadonlyArray<{ id: string; label: string }>, id: string) {
  return list.find((x) => x.id === id)?.label ?? id;
}

function buildEmail(d: DamageRequest) {
  const rows: Array<[string, string]> = [
    ["Ruit", labelFor(DAMAGE_GLASS_OPTIONS, d.glass)],
    ["Schade", labelFor(DAMAGE_TYPES, d.damage)],
    ["Kenteken", d.kenteken],
    ["Merk / model", [d.merk, d.model].filter(Boolean).join(" ")],
    ["Bouwjaar", d.bouwjaar || "—"],
    ["Verzekeraar", d.verzekeraar || "—"],
    ["Leaseauto", d.lease === "ja" ? "Ja" : "Nee"],
    ["Naam", d.naam],
    ["Telefoon", d.telefoon],
    ["E-mail", d.email],
    ["Gewenste datum", d.datum || "—"],
    ["Opmerking", d.opmerking || "—"],
  ];
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<h2 style="margin:0 0 12px">Nieuwe schadeaanvraag via de website</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#666;border-bottom:1px solid #eee;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #eee">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { html, text };
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "onbekend";
  if (rateLimited(ip)) {
    return json(429, { ok: false, error: "rate_limited", message: "Te veel aanvragen in korte tijd. Probeer het later opnieuw of bel ons." });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json(400, { ok: false, error: "bad_request", message: "De aanvraag kon niet worden gelezen." });
  }

  // Honeypot + invultijd: bots vullen verborgen velden in of versturen direct.
  const honeypot = String(form.get("website") ?? "");
  const startedAt = Number(form.get("startedAt") ?? 0);
  if (honeypot || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return json(400, { ok: false, error: "rejected", message: "De aanvraag kon niet worden verwerkt. Bel ons gerust." });
  }

  const raw: Record<string, string> = {};
  for (const key of Object.keys(damageRequestSchema.shape)) {
    const v = form.get(key);
    if (typeof v === "string") raw[key] = v;
  }
  const parsed = damageRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return json(422, { ok: false, error: "validation", fields: fieldErrors(parsed.error), message: "Controleer de gemarkeerde velden." });
  }

  // Optionele foto
  let attachment: { filename: string; content: string } | undefined;
  const file = form.get("foto");
  if (file && typeof file !== "string" && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return json(422, { ok: false, error: "validation", fields: { foto: "De foto is groter dan 8 MB." }, message: "De foto is te groot." });
    }
    if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
      return json(422, { ok: false, error: "validation", fields: { foto: "Alleen JPG, PNG, WEBP of HEIC." }, message: "Dit bestandstype wordt niet ondersteund." });
    }
    const buf = new Uint8Array(await file.arrayBuffer());
    if (!hasImageSignature(buf, file.type)) {
      return json(422, { ok: false, error: "validation", fields: { foto: "Het bestand is geen geldige afbeelding." }, message: "Het bestand is geen geldige afbeelding." });
    }
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    attachment = { filename: `ruitschade-${parsed.data.kenteken}.${ext}`, content: Buffer.from(buf).toString("base64") };
  }

  if (!apiKey || !from || !to) {
    // Eerlijk melden: de aanvraag is NIET verzonden.
    return json(503, {
      ok: false,
      error: "not_configured",
      message: "Online aanvragen is nog niet geactiveerd. Bel of mail ons, dan helpen we je direct.",
    });
  }

  const { html, text } = buildEmail(parsed.data);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: parsed.data.email,
        subject: `Schadeaanvraag ${labelFor(DAMAGE_GLASS_OPTIONS, parsed.data.glass)} — ${parsed.data.kenteken}`,
        html,
        text,
        attachments: attachment ? [attachment] : undefined,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error("Resend-fout", res.status, await res.text().catch(() => ""));
      return json(502, { ok: false, error: "send_failed", message: "Verzenden is niet gelukt. Probeer het opnieuw of bel ons." });
    }
  } catch (err) {
    console.error("Resend niet bereikbaar", err);
    return json(502, { ok: false, error: "send_failed", message: "Verzenden is niet gelukt. Probeer het opnieuw of bel ons." });
  }

  return json(200, { ok: true });
}
