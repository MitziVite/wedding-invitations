interface OrnamentProps {
  className?: string;
}

/** A small line–diamond–line divider, echoing the hero's dividers. */
export function Ornament({ className = "" }: OrnamentProps) {
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-2.5 ${className}`}
      style={{ width: "clamp(90px, 16vw, 130px)" }}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gold/70" />
      <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
      <span className="h-px flex-1 bg-gold/70" />
    </div>
  );
}
