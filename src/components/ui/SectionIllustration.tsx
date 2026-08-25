interface SectionIllustrationProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * A centered illustration — no gradient/fade, no box shadow (these sketches
 * have a transparent background, so they sit directly on the section's own
 * tone rather than inside a visible photo frame).
 */
export function SectionIllustration({ src, alt, className = "" }: SectionIllustrationProps) {
  return (
    <div className={`mx-auto mt-8 max-w-md ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static illustration, no responsive sizing needed */}
      <img src={src} alt={alt} className="h-auto w-full" />
    </div>
  );
}
