interface BottomDividerProps {
  className?: string;
}

/** Thin line — tiny diamond — thin line, below the subtitle. Smaller and simpler than TopDivider. */
export function BottomDivider({ className = "" }: BottomDividerProps) {
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-2.5 ${className}`}
      style={{ width: "clamp(90px, 16vw, 130px)" }}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-ivory/80" />
      <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-ivory/85" />
      <span className="h-px flex-1 bg-ivory/80" />
    </div>
  );
}
