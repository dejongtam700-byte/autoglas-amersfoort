import type { SVGProps } from "react";

/**
 * Minimalistische lijniconen (24×24, 1.5px lijn) in Lucide-stijl.
 * Bewust inline gehouden: dat scheelt een dependency en houdt de bundle klein.
 */
type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...p,
});

export const PhoneIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const WhatsAppIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 20.5l1.2-4.1A8.5 8.5 0 1 1 8 19.6z" />
    <path d="M9 8.6c0-.3.3-.6.6-.6h.6c.2 0 .4.1.5.3l.7 1.6c.1.2 0 .4-.1.6l-.5.6a5.6 5.6 0 0 0 2.6 2.6l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.2.1.3.3.3.5v.6c0 .3-.3.6-.6.6A6.4 6.4 0 0 1 9 8.6z" />
  </svg>
);

export const ArrowRightIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
);

export const MedalIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
  </svg>
);

export const HomeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9v12h14V9" />
    <path d="M10 21v-6h4v6" />
  </svg>
);

export const MapPinIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const MailIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const UploadIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 16v4h16v-4" />
  </svg>
);

export const AlertIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v4M12 17.5v.5" />
  </svg>
);

export const CoffeeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" />
    <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3" />
  </svg>
);

export const CarIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 16v-3l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5v3" />
    <path d="M3 16h18v2H3z" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
  </svg>
);

export const KeyIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="8" cy="15" r="4" />
    <path d="M11 12l9-9M17 6l3 3" />
  </svg>
);

export const ToolIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.5-.4-.4-2.5z" />
  </svg>
);

export const DocIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
);
