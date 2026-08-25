interface OrnamentProps {
  className?: string;
  tone?: "gold" | "ivory";
}

/** A small line–diamond–line divider, echoing the hero's dividers. */
export function Ornament({ className = "", tone = "gold" }: OrnamentProps) {
  const line = tone === "gold" ? "bg-gold/70" : "bg-ivory/50";
  const diamond = tone === "gold" ? "bg-gold" : "bg-ivory/80";
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-2.5 ${className}`}
      style={{ width: "clamp(90px, 16vw, 130px)" }}
      aria-hidden="true"
    >
      <span className={`h-px flex-1 ${line}`} />
      <span className={`h-1.5 w-1.5 shrink-0 rotate-45 ${diamond}`} />
      <span className={`h-px flex-1 ${line}`} />
    </div>
  );
}
