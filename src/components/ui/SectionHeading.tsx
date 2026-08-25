import { Ornament } from "./Ornament";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /** On dark (wine) sections, flip the ornament + eyebrow to a light tone. */
  onDark?: boolean;
  className?: string;
}

/** Eyebrow · ornament · title, centered — the standard heading for a section. */
export function SectionHeading({ eyebrow, title, onDark = false, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {eyebrow ? (
        <p
          className={`mb-3 font-body text-xs tracking-[0.22em] uppercase ${
            onDark ? "text-champagne" : "text-wine"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`font-display text-4xl sm:text-5xl ${onDark ? "text-ivory" : "text-coffee"}`}>
        {title}
      </h2>
      <Ornament className="mt-5" tone={onDark ? "ivory" : "gold"} />
    </div>
  );
}
