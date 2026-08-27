export type TimelineIconKey =
  | "rings"
  | "camera"
  | "plate"
  | "ring"
  | "wineGlass"
  | "musicNote"
  | "maracas"
  | "carTrail";

interface TimelineIconProps {
  icon: TimelineIconKey;
  className?: string;
}

/**
 * Small, thin-stroke placeholder drawings for each itinerary stop — light
 * and delicate on purpose, standing in until real hand-drawn illustrations
 * are dropped in per-event via `iconSrc` (see TimelineSection).
 */
export function TimelineIcon({ icon, className = "" }: TimelineIconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (icon) {
    case "rings":
      return (
        <svg {...common}>
          <circle cx="9" cy="14" r="5" />
          <circle cx="15" cy="14" r="5" />
          <path d="M9 9.3V6l1.6-2 1.6 2v3.3" strokeWidth={1} opacity={0.7} />
        </svg>
      );
    case "ring":
      return (
        <svg {...common}>
          <circle cx="12" cy="15" r="5.5" />
          <path d="M12 9.5V6l-1.8-2.6h3.6L12 6" strokeWidth={1} opacity={0.7} />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <rect x="3.5" y="7.5" width="17" height="12" rx="2.2" />
          <path d="M8.5 7.5 10 5h4l1.5 2.5" />
          <circle cx="12" cy="13.5" r="3.2" />
        </svg>
      );
    case "plate":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.6" strokeWidth={1} opacity={0.7} />
        </svg>
      );
    case "wineGlass":
      return (
        <svg {...common}>
          <path d="M8 3.5h8l-1 6.5a3 3 0 0 1-6 0Z" />
          <path d="M12 13v6.5" />
          <path d="M8.5 19.5h7" />
        </svg>
      );
    case "musicNote":
      return (
        <svg {...common}>
          <path d="M9 16.5V5.5l9-2v11" />
          <circle cx="7" cy="17.5" r="2.3" />
          <circle cx="16" cy="15.5" r="2.3" />
        </svg>
      );
    case "maracas":
      return (
        <svg {...common}>
          <ellipse cx="8.5" cy="9" rx="3.4" ry="4.6" transform="rotate(-25 8.5 9)" />
          <path d="M10.7 12.6 6.5 19" />
          <ellipse cx="16" cy="10.5" rx="3.4" ry="4.6" transform="rotate(25 16 10.5)" />
          <path d="M14 14 17.8 19.5" />
        </svg>
      );
    case "carTrail":
      return (
        <svg {...common}>
          <path d="M4.5 15.5h13l-1.3-4.2a2 2 0 0 0-1.9-1.3H8.4a2 2 0 0 0-1.9 1.4l-1 4.1Z" />
          <circle cx="8" cy="17.3" r="1.4" />
          <circle cx="16" cy="17.3" r="1.4" />
          <path d="M2 8.5 4 7M2.8 11.2 5 10.5M3.6 5 5.4 4.2" strokeWidth={1} opacity={0.7} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}
