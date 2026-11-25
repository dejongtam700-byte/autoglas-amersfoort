/**
 * Technische glasillustraties per dienst (lichte achtergrond, dunne lijnen, rode accenten).
 * Bewust illustratief: geen stockfoto's en geen nepfoto's van werkplaats of medewerkers.
 */

const INK = "#09090B";
const MUTED = "#A1A1AA";
const RED = "#E21D2D";

// voorruit in vooraanzicht
const WS = "M-250,110 C-90,128 90,128 250,110 C236,40 214,-30 190,-96 C70,-112 -70,-112 -190,-96 C-214,-30 -236,40 -250,110 Z";

function GlassDefs() {
  return (
    <defs>
      <linearGradient id="sv-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#dfe7ee" />
        <stop offset="0.55" stopColor="#c9d4de" />
        <stop offset="1" stopColor="#b3c1cd" />
      </linearGradient>
      <linearGradient id="sv-refl" x1="0" x2="1" y1="0" y2="0.3">
        <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.38" stopColor="#fff" stopOpacity="0.75" />
        <stop offset="0.48" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="0.58" stopColor="#fff" stopOpacity="0.45" />
        <stop offset="0.68" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <pattern id="sv-check" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#fff" />
        <rect width="8" height="8" fill={INK} />
        <rect x="8" y="8" width="8" height="8" fill={INK} />
      </pattern>
    </defs>
  );
}

function Glass({ d, rear = false }: { d: string; rear?: boolean }) {
  return (
    <g>
      <path d={d} fill={INK} opacity="0.12" transform="translate(6 10)" />
      <path d={d} fill="url(#sv-glass)" />
      <path d={d} fill="url(#sv-refl)" />
      <path d={d} fill="none" stroke={INK} strokeWidth="9" strokeOpacity="0.85" strokeLinejoin="round" style={{ clipPath: "none" }} />
      <path d={d} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" transform="translate(0 -1)" />
      {rear && null}
    </g>
  );
}

function Dim({ x1, y1, x2, y2, label, vertical = false }: { x1: number; y1: number; x2: number; y2: number; label: string; vertical?: boolean }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g stroke={MUTED} strokeWidth="1" fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {vertical ? (
        <>
          <line x1={x1 - 6} y1={y1} x2={x1 + 6} y2={y1} />
          <line x1={x2 - 6} y1={y2} x2={x2 + 6} y2={y2} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - 6} x2={x1} y2={y1 + 6} />
          <line x1={x2} y1={y2 - 6} x2={x2} y2={y2 + 6} />
        </>
      )}
      <text
        x={vertical ? mx + 12 : mx}
        y={vertical ? my + 4 : my - 10}
        textAnchor={vertical ? "start" : "middle"}
        fill={MUTED}
        stroke="none"
        fontSize="11"
        letterSpacing="2"
        fontFamily="var(--font-display)"
      >
        {label}
      </text>
    </g>
  );
}

function Callout({ x, y, tx, ty, label }: { x: number; y: number; tx: number; ty: number; label: string }) {
  return (
    <g>
      <polyline points={`${x},${y} ${tx},${ty} ${tx + (tx > x ? 40 : -40)},${ty}`} fill="none" stroke={RED} strokeWidth="1.2" />
      <circle cx={x} cy={y} r="4" fill="#fff" stroke={RED} strokeWidth="1.6" />
      <text
        x={tx + (tx > x ? 48 : -48)}
        y={ty + 4}
        textAnchor={tx > x ? "start" : "end"}
        fontSize="12"
        letterSpacing="2.4"
        fill={INK}
        fontFamily="var(--font-display)"
        fontWeight="500"
      >
        {label}
      </text>
    </g>
  );
}

function Chip({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeLinecap="round" fill="none">
      <circle r="3" fill={INK} stroke="none" />
      <g strokeWidth="1.1">
        <path d="M0,0 L9,-4 L16,-3 L24,-8" />
        <path d="M0,0 L-7,-8 L-12,-17" />
        <path d="M0,0 L-11,3 L-20,1 L-27,5" />
        <path d="M0,0 L2,10 L7,16 L6,24" />
        <path d="M0,0 L7,6 L15,8" />
        <path d="M0,0 L-4,9 L-10,14" />
        <path d="M0,0 L2,-10 L-1,-16" />
      </g>
      <circle r="20" strokeWidth="0.6" strokeOpacity="0.35" />
    </g>
  );
}

export default function ServiceVisual({ id }: { id: number }) {
  return (
    <svg viewBox="-320 -240 640 480" className="h-full w-full" role="img" aria-label={LABELS[id]}>
      <GlassDefs />
      {id === 0 && (
        <g>
          <g transform="translate(-70 30) scale(0.62)">
            <Glass d={WS} />
            <circle cx="-60" cy="20" r="14" fill="none" stroke={RED} strokeWidth="3" />
          </g>
          <line x1="-107" y1="42" x2="96" y2="-30" stroke={MUTED} strokeDasharray="3 5" />
          <line x1="-107" y1="42" x2="140" y2="110" stroke={MUTED} strokeDasharray="3 5" />
          <circle cx="170" cy="40" r="110" fill="#eef2f5" stroke={INK} strokeWidth="2" />
          <circle cx="170" cy="40" r="110" fill="url(#sv-refl)" opacity="0.6" />
          <Chip x={170} y={40} s={2.1} />
          <Dim x1={140} y1={180} x2={200} y2={180} label="< 2-EUROMUNT" />
          <Callout x={170} y={40} tx={60} ty={-150} label="STERRETJE" />
        </g>
      )}
      {id === 1 && (
        <g>
          <Glass d={WS} />
          <rect x="-26" y="-104" width="52" height="34" fill={INK} />
          <circle cx="0" cy="-87" r="7" fill="#27272a" stroke="#52525b" />
          <Dim x1={-250} y1={170} x2={250} y2={170} label="BREEDTE OP MAAT" />
          <Dim x1={292} y1={-96} x2={292} y2={110} label="HOOGTE" vertical />
          <Callout x={0} y={-87} tx={-120} ty={-180} label="CAMERA / SENSOR" />
          <Callout x={150} y={60} tx={190} ty={-170} label="GELAAGD GLAS" />
        </g>
      )}
      {id === 2 && (
        <g>
          <g transform="translate(-140 20)">
            <Glass d="M-120,80 L120,80 C126,20 110,-40 70,-90 C20,-100 -60,-96 -110,-60 C-120,-20 -122,30 -120,80 Z" />
            <Callout x={-30} y={0} tx={-60} ty={-170} label="ZIJRUIT" />
          </g>
          <g transform="translate(150 30)">
            <Glass d="M-140,70 C-50,84 50,84 140,70 C128,10 112,-40 96,-80 C30,-92 -30,-92 -96,-80 C-112,-40 -128,10 -140,70 Z" />
            <g stroke="#b7793e" strokeOpacity="0.8" strokeWidth="1" fill="none">
              {Array.from({ length: 9 }, (_, i) => -56 + i * 14).map((y) => (
                <path key={y} d={`M${-118 + (y + 60) * 0.25},${y} C-40,${y + 6} 40,${y + 6} ${118 - (y + 60) * 0.25},${y}`} />
              ))}
            </g>
            <Callout x={60} y={0} tx={90} ty={-170} label="ACHTERRUIT" />
          </g>
        </g>
      )}
      {id === 3 && (
        <g>
          <g transform="translate(-130 20) scale(0.62)">
            <Glass d={WS} />
            <rect x="-30" y="-108" width="60" height="40" fill={INK} />
            <circle cx="0" cy="-88" r="9" fill="#27272a" stroke={RED} strokeWidth="3" />
          </g>
          <g stroke={RED} strokeWidth="1.2" strokeDasharray="5 5" fill="none">
            <line x1="-130" y1="-35" x2="190" y2="-150" />
            <line x1="-130" y1="-35" x2="190" y2="110" />
          </g>
          <rect x="190" y="-150" width="80" height="260" fill="url(#sv-check)" stroke={INK} strokeWidth="2" />
          <line x1="230" y1="110" x2="230" y2="170" stroke={INK} strokeWidth="2" />
          <line x1="200" y1="170" x2="260" y2="170" stroke={INK} strokeWidth="2" />
          <Callout x={-130} y={-35} tx={-190} ty={-170} label="ADAS-CAMERA" />
          <text x="230" y="200" textAnchor="middle" fontSize="12" letterSpacing="2.4" fill={INK} fontFamily="var(--font-display)" fontWeight="500">
            KALIBRATIEBORD
          </text>
        </g>
      )}
      {id === 4 && (
        <g>
          <Glass d="M-230,150 C-80,160 80,160 230,150 C232,40 228,-60 214,-150 C80,-162 -80,-162 -214,-150 C-228,-60 -232,40 -230,150 Z" />
          <line x1="-228" y1="20" x2="228" y2="20" stroke={INK} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 6" />
          <Dim x1={-230} y1={196} x2={230} y2={196} label="GROOT FORMAAT" />
          <Callout x={120} y={-80} tx={200} ty={-205} label="CAMPERRUIT" />
        </g>
      )}
      {id === 5 && (
        <g>
          <g transform="translate(-60 0)">
            <rect x="-150" y="-180" width="250" height="330" fill="#fff" stroke={INK} strokeWidth="2" />
            <rect x="-150" y="-180" width="250" height="44" fill={INK} />
            <text x="-128" y="-152" fontSize="12" letterSpacing="2.4" fill="#fff" fontFamily="var(--font-display)" fontWeight="500">
              SCHADEMELDING
            </text>
            {[-100, -50, 0, 50, 100].map((y, i) => (
              <g key={y}>
                <rect x="-126" y={y - 12} width="20" height="20" fill="none" stroke={INK} strokeWidth="1.6" />
                <path d={`M-121,${y - 2} l5,5 l9,-11`} fill="none" stroke={RED} strokeWidth="2.4" strokeLinecap="round" opacity={i < 4 ? 1 : 0} />
                <line x1="-90" y1={y - 2} x2={i % 2 ? 40 : 70} y2={y - 2} stroke={MUTED} strokeWidth="6" strokeLinecap="round" />
              </g>
            ))}
          </g>
          <g transform="translate(170 40) scale(0.4)">
            <Glass d={WS} />
          </g>
          <Callout x={170} y={20} tx={200} ty={-170} label="WIJ REGELEN HET" />
        </g>
      )}
    </svg>
  );
}

const LABELS = [
  "Illustratie: sterretje in de voorruit, vergroot weergegeven",
  "Illustratie: voorruit met camera- en sensorpositie",
  "Illustratie: zijruit en achterruit met verwarmingsdraden",
  "Illustratie: ADAS-camera achter de voorruit gericht op een kalibratiebord",
  "Illustratie: grote camperruit",
  "Illustratie: schademeldingsformulier dat wij voor je afhandelen",
];
