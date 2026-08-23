interface TopDividerProps {
  className?: string;
}

/** Thin line — small diamond flourish — thin line, above the subtitle. */
export function TopDivider({ className = "" }: TopDividerProps) {
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-3 ${className}`}
      style={{ width: "clamp(160px, 28vw, 220px)" }}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gold/80" />
      <svg
        width="26"
        height="14"
        viewBox="0 0 26 14"
        fill="none"
        className="shrink-0 text-gold/85"
      >
        <path d="M13 1 L18.5 7 L13 13 L7.5 7 Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="13" cy="7" r="1.3" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-gold/80" />
    </div>
  );
}
