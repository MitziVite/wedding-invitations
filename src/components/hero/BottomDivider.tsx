interface BottomDividerProps {
  className?: string;
}

/** Same line — diamond-with-center-dot — line motif as TopDivider, just smaller, so the two read as one ornament family instead of two unrelated shapes. */
export function BottomDivider({ className = "" }: BottomDividerProps) {
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-2.5 ${className}`}
      style={{ width: "clamp(90px, 16vw, 130px)" }}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gold/80" />
      <svg width="18" height="10" viewBox="0 0 26 14" fill="none" className="shrink-0 text-gold/85">
        <path d="M13 1 L18.5 7 L13 13 L7.5 7 Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="13" cy="7" r="1.3" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-gold/80" />
    </div>
  );
}
