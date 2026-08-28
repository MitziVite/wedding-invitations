import { Ornament } from "./Ornament";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
}

/** Eyebrow · ornament · title, centered — the standard heading for a section. */
export function SectionHeading({ eyebrow, title, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {eyebrow ? <p className="mb-3 font-body text-xs tracking-[0.22em] text-espresso/70 uppercase">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl text-espresso sm:text-5xl">{title}</h2>
      <Ornament className="mt-5" />
    </div>
  );
}
