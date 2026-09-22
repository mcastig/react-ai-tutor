/**
 * Static icon JSX, hoisted to module scope so it is allocated once rather than
 * on every render.
 */

type IconProps = { className?: string };

const BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function TerminalMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 8.5 10.5 12 7 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 16h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-4.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5Z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5Z" />
    </svg>
  );
}

export function GaugeIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="M5 20V11" />
      <path d="M12 20V5" />
      <path d="M19 20v-6" />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="M12 4.5 13.7 9l4.3 1.7-4.3 1.7L12 17l-1.7-4.6L6 10.7 10.3 9Z" />
      <path d="M18.5 4v3M20 5.5h-3" />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="M12 16V5" />
      <path d="m8 9 4-4 4 4" />
      <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="m5 12 14-7-5 14-2.5-5.5Z" />
    </svg>
  );
}

export function ChipIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="M8 8h8v8H8z" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    </svg>
  );
}

export function CaretIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="m10 6 6 6-6 6" />
    </svg>
  );
}

export function DocIcon({ className }: IconProps) {
  return (
    <svg className={className} {...BASE}>
      <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9Z" />
      <path d="M13 3v6h6" />
    </svg>
  );
}
