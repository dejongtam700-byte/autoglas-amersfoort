/**
 * Ruitdefinities + geometrie van de auto in bovenaanzicht.
 *
 * Coördinatenstelsel (SVG-viewBox "-130 -260 260 520"):
 *   x = breedte (0 = middenlijn), y = lengte, voorkant op +y.
 *   In dit bovenaanzicht met de neus naar beneden ligt de LINKERzijde van de auto op +x.
 *
 * Elke ruit is een afzonderlijk vlak met een eigen explode-vector (dx, dy in plan, lift in hoogte).
 * De carrosserie zelf beweegt nooit.
 */

export type GlassId =
  | "voorruit"
  | "achterruit"
  | "zijruit-lv"
  | "zijruit-la"
  | "zijruit-rv"
  | "zijruit-ra"
  | "panoramadak";

export type DamageGlassId = GlassId | "overig";

export interface GlassPart {
  id: GlassId;
  label: string;
  group: "Voorruit" | "Achterruit" | "Zijruit" | "Panoramadak";
  description: string;
  path: string;
  /** Verplaatsing in volledig uitgeklapte toestand: plan-x, plan-y (eenheden) en lift (px in 3D). */
  explode: { dx: number; dy: number; lift: number };
  /** Ankerpunt voor aanwijslijnen (plan-coördinaten). */
  anchor: [number, number];
}

export const VIEWBOX = "-130 -260 260 520";

/* ── Carrosserie-omtrek: rechterhelft als kubische segmenten, gespiegeld tot een gesloten vorm ── */
type Pt = [number, number];
const halfOutline: Array<[Pt, Pt, Pt]> = [
  [[30, 239], [57, 235], [74, 225]],
  [[88, 216], [93, 200], [94, 182]],
  [[96, 166], [98, 152], [98, 138]],
  [[98, 118], [92, 100], [90, 80]],
  [[88, 42], [88, 2], [90, -40]],
  [[92, -70], [100, -100], [100, -132]],
  [[100, -162], [98, -186], [93, -202]],
  [[87, -220], [70, -231], [48, -235]],
  [[30, -238], [12, -239], [0, -239]],
];

function mirroredPath(start: Pt, segs: Array<[Pt, Pt, Pt]>): string {
  const f = (p: Pt) => `${p[0]},${p[1]}`;
  let d = `M${f(start)}`;
  for (const [c1, c2, e] of segs) d += ` C${f(c1)} ${f(c2)} ${f(e)}`;
  // terug langs de linkerhelft (gespiegeld, omgekeerd)
  const pts: Pt[] = [start];
  segs.forEach(([, , e]) => pts.push(e));
  for (let i = segs.length - 1; i >= 0; i--) {
    const [c1, c2] = segs[i];
    const from = pts[i];
    d += ` C${-c2[0]},${c2[1]} ${-c1[0]},${c1[1]} ${-from[0]},${from[1]}`;
  }
  return d + " Z";
}

export const BODY_PATH = mirroredPath([0, 239], halfOutline);

/* ── Cabine (greenhouse): het donkere vlak onder het glas ── */
export const CABIN_PATH =
  "M-70,102 C-40,109 40,109 70,102 C78,98 84,86 85,72 L86,-14 C86,-50 82,-82 72,-104 " +
  "L66,-160 C36,-168 -36,-168 -66,-160 L-72,-104 C-82,-82 -86,-50 -86,-14 L-85,72 C-84,86 -78,98 -70,102 Z";

/* ── Dakframe (carrosseriekleur rond het panoramadak) ── */
export const ROOF_PATH =
  "M-59,38 C-30,33 30,33 59,38 L61,-12 L58,-94 C30,-98 -30,-98 -58,-94 L-61,-12 Z";

/* ── Glasvlakken ── */
const sideFront = (s: 1 | -1) =>
  `M${66 * s},96 C${73 * s},93 ${79 * s},85 ${81 * s},72 L${83 * s},-9 L${62 * s},-9 L${60 * s},40 C${61 * s},62 ${63 * s},84 ${66 * s},96 Z`;
const sideRear = (s: 1 | -1) =>
  `M${62 * s},-15 L${83 * s},-15 C${83 * s},-50 ${79 * s},-80 ${70 * s},-102 C${66 * s},-104 ${62 * s},-100 ${59 * s},-93 Z`;

export const GLASS_PARTS: GlassPart[] = [
  {
    id: "voorruit",
    label: "Voorruit",
    group: "Voorruit",
    description: "Gelaagd veiligheidsglas. Sterretjes vaak te repareren, bij barsten vervangen we de ruit inclusief ADAS-kalibratie.",
    path: "M-68,101 C-40,108 40,108 68,101 C66,80 62,56 59,37 C30,32 -30,32 -59,37 C-62,56 -66,80 -68,101 Z",
    explode: { dx: 0, dy: 105, lift: 120 },
    anchor: [0, 72],
  },
  {
    id: "panoramadak",
    label: "Panoramadak",
    group: "Panoramadak",
    description: "Groot glazen dakdeel. Wij vervangen panoramadaken met de juiste afdichting en montage.",
    path: "M-48,24 C-24,21 24,21 48,24 L50,-80 C24,-84 -24,-84 -50,-80 Z",
    explode: { dx: 0, dy: -8, lift: 210 },
    anchor: [0, -28],
  },
  {
    id: "achterruit",
    label: "Achterruit",
    group: "Achterruit",
    description: "Gehard glas met verwarmingsdraden. Bij schade wordt de achterruit altijd volledig vervangen.",
    path: "M-57,-97 C-30,-100 30,-100 57,-97 C59,-118 61,-138 63,-158 C36,-165 -36,-165 -63,-158 C-61,-138 -59,-118 -57,-97 Z",
    explode: { dx: 0, dy: -100, lift: 120 },
    anchor: [0, -128],
  },
  {
    id: "zijruit-lv",
    label: "Zijruit linksvoor",
    group: "Zijruit",
    description: "Gehard zijglas. Snel vervangen, inclusief het verwijderen van glassplinters uit het deurpaneel.",
    path: sideFront(1),
    explode: { dx: 92, dy: 6, lift: 80 },
    anchor: [72, 42],
  },
  {
    id: "zijruit-la",
    label: "Zijruit linksachter",
    group: "Zijruit",
    description: "Achterportierruit of vaste zijruit. Ook getinte (privacy)ruiten leverbaar.",
    path: sideRear(1),
    explode: { dx: 92, dy: -10, lift: 80 },
    anchor: [72, -52],
  },
  {
    id: "zijruit-rv",
    label: "Zijruit rechtsvoor",
    group: "Zijruit",
    description: "Gehard zijglas. Snel vervangen, inclusief het verwijderen van glassplinters uit het deurpaneel.",
    path: sideFront(-1),
    explode: { dx: -92, dy: 6, lift: 80 },
    anchor: [-72, 42],
  },
  {
    id: "zijruit-ra",
    label: "Zijruit rechtsachter",
    group: "Zijruit",
    description: "Achterportierruit of vaste zijruit. Ook getinte (privacy)ruiten leverbaar.",
    path: sideRear(-1),
    explode: { dx: -92, dy: -10, lift: 80 },
    anchor: [-72, -52],
  },
];

export const GLASS_BY_ID = Object.fromEntries(GLASS_PARTS.map((g) => [g.id, g])) as Record<GlassId, GlassPart>;

export const DAMAGE_GLASS_OPTIONS: Array<{ id: DamageGlassId; label: string }> = [
  { id: "voorruit", label: "Voorruit" },
  { id: "achterruit", label: "Achterruit" },
  { id: "zijruit-lv", label: "Zijruit linksvoor" },
  { id: "zijruit-la", label: "Zijruit linksachter" },
  { id: "zijruit-rv", label: "Zijruit rechtsvoor" },
  { id: "zijruit-ra", label: "Zijruit rechtsachter" },
  { id: "panoramadak", label: "Panoramadak" },
  { id: "overig", label: "Overige schade" },
];

export const DAMAGE_TYPES = [
  { id: "sterretje", label: "Sterretje" },
  { id: "barst", label: "Barst" },
  { id: "gebroken", label: "Gebroken ruit" },
  { id: "anders", label: "Anders" },
  { id: "onbekend", label: "Weet ik niet" },
] as const;
