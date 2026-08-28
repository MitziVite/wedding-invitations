import Image from "next/image";

interface ItineraryIllustrationProps {
  /** Path under /public. */
  src: string;
  alt: string;
}

/**
 * One stop's watercolor illustration — transparent-background artwork with
 * an organic (non-rectangular) silhouette, so it's shown directly with a
 * soft drop-shadow rather than boxed into a card: a box-shadow would draw a
 * hard rectangle behind the transparent PNG, but `filter: drop-shadow`
 * follows the actual alpha shape. `fill` + `object-contain` inside a fixed
 * square lets any source aspect ratio (most stops are square, the temple
 * illustration is portrait) work without per-image dimension bookkeeping —
 * swapping in a differently-shaped image later just works.
 */
export function ItineraryIllustration({ src, alt }: ItineraryIllustrationProps) {
  return (
    <span
      data-itinerary-illustration
      className="relative block h-16 w-16 shrink-0 drop-shadow-md sm:h-20 sm:w-20 md:h-24 md:w-24"
    >
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 6rem, (min-width: 640px) 5rem, 4rem" className="object-contain" />
    </span>
  );
}
