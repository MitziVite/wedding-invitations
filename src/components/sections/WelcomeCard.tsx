"use client";

import { useEffect, useState } from "react";
import { weddingContent } from "@/content/copy/es";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetMs: number): TimeLeft {
  const diff = Math.max(0, targetMs - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/** A small gold heart — one on its own, or two interlocking, as a delicate divider. */
function HeartOrnament({ double = false, className = "" }: { double?: boolean; className?: string }) {
  const heart =
    "M12 21c-.4 0-.8-.15-1.1-.42C6.13 16.38 3 13.5 3 9.9 3 7.13 5.05 5 7.7 5c1.6 0 3.13.79 4.3 2.14C13.17 5.79 14.7 5 16.3 5 18.95 5 21 7.13 21 9.9c0 3.6-3.13 6.48-7.9 10.68-.3.27-.7.42-1.1.42Z";
  return (
    <svg
      viewBox={double ? "0 0 40 24" : "0 0 24 24"}
      className={`text-gold ${double ? "h-3.5 w-6" : "h-2.5 w-2.5"} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={double ? 1.4 : 0}
      aria-hidden="true"
    >
      {double ? (
        <>
          <path d={heart} transform="translate(0 0) scale(0.82)" />
          <path d={heart} transform="translate(20 0) scale(0.82)" />
        </>
      ) : (
        <path d={heart} fill="currentColor" />
      )}
    </svg>
  );
}

/**
 * Welcome section: the date + live countdown are shared, but the photo
 * treatment differs deliberately by breakpoint rather than being one
 * responsive layout —
 *
 * - Mobile: the photo goes full-bleed edge to edge (object-cover), with
 *   the couple's names stacked in script directly over it. A wide-and-
 *   short desktop container would crop away most of a portrait photo this
 *   way, but on a phone the container is already close to the photo's own
 *   aspect ratio, so the crop stays gentle.
 * - Desktop (sm+): names sit above on plain ivory, and the (portrait)
 *   photo shows in its own contained, framed card instead of being
 *   stretched edge to edge.
 *
 * Content comes from weddingContent.welcome so it stays easy to customize
 * (drop in the real photo, change the target date, etc.).
 */
export function WelcomeCard() {
  const { coupleNames, names, weekday, welcome } = weddingContent;
  const targetMs = new Date(welcome.countdownTargetISO).getTime();

  // Seeded from a lazy initializer (real value on the client) and ticked by an
  // interval. suppressHydrationWarning covers the expected server/client time
  // difference on the digits.
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetMs));

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(getTimeLeft(targetMs)), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const units = [
    { label: "Días", value: timeLeft.days.toString() },
    { label: "Horas", value: pad(timeLeft.hours) },
    { label: "Min", value: pad(timeLeft.minutes) },
    { label: "Seg", value: pad(timeLeft.seconds) },
  ];

  return (
    <section id="bienvenida" className="w-full bg-ivory sm:flex sm:min-h-screen sm:flex-col sm:justify-center sm:gap-8 lg:gap-12">
      {/* Mobile only: full-bleed photo with the couple's names overlaid in script. */}
      <div className="relative h-[52vh] w-full overflow-hidden bg-sage sm:hidden">
        {welcome.photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- swap-in couple photo, art-directed by the author
          <img
            src={welcome.photoSrc}
            alt={welcome.photoAlt}
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 78%" }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sage to-petal-blush text-espresso/45">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21s-7.5-4.9-10-9.3C.6 8.9 2 6 4.9 6c1.9 0 3.2 1.1 4 2.2C9.7 7.1 11 6 12.9 6 15.8 6 17.2 8.9 15.9 11.7 13.5 16.1 12 21 12 21z" />
            </svg>
            <p className="mt-3 font-body text-sm tracking-wide">Agrega la foto de la pareja</p>
          </div>
        )}

        {/* Soft dark scrim at the top so the ivory names read over the sky. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 to-transparent" />

        {/* Couple names as a two-line script lockup — top name, then
            "& bottom name" together on the second line. Fewer lines than a
            full three-way stack keeps it from feeling tall/cramped, and
            pairing the ampersand with the second name (rather than giving
            it its own line) gives that row enough width to match the first
            — the earlier three-line version read as narrow and empty at the
            sides. aria-hidden on the visual lines + aria-label on the
            wrapper keeps it announced as one clean "Mitzi & Josh" for
            screen readers instead of fragments. */}
        <div className="absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-8" aria-label={coupleNames}>
          <p
            aria-hidden="true"
            className="text-center text-ivory"
            style={{
              fontFamily: "var(--font-allura)",
              fontSize: "clamp(3rem, 11vw, 5.5rem)",
              lineHeight: 1,
              textShadow: "0 2px 16px rgba(30,20,14,0.55)",
              transform: "translateX(-0.4em)",
            }}
          >
            {names.top}
          </p>
          <p
            aria-hidden="true"
            className="mt-1 flex items-baseline justify-center text-ivory"
            style={{
              fontFamily: "var(--font-allura)",
              fontSize: "clamp(3rem, 11vw, 5.5rem)",
              lineHeight: 1,
              textShadow: "0 2px 16px rgba(30,20,14,0.55)",
              transform: "translateX(0.4em)",
            }}
          >
            <span style={{ fontSize: "0.5em", opacity: 0.85, marginRight: "0.15em", top: "-0.04em", position: "relative" }}>
              &amp;
            </span>
            <span>{names.bottom}</span>
          </p>
        </div>

        {/* Soft fade from the photo into the ivory section. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-ivory" />
      </div>

      {/* Desktop only (sm+): names in script above, photo in its own framed
          card. Sized in vh (not a fixed px/rem width), and scaled up again
          at lg — the section now fills the full viewport height (see the
          section's sm:min-h-screen above), so on a large monitor there's
          real vertical room to let the photo and names grow into instead
          of everything huddling into a small clump in the middle. */}
      <div className="hidden w-full px-6 sm:flex sm:flex-col sm:items-center">
        <p
          className="text-espresso"
          style={{ fontFamily: "var(--font-allura)", fontSize: "clamp(2.25rem, 4.5vw, 4.25rem)", lineHeight: 1.1 }}
        >
          {coupleNames}
        </p>
        <HeartOrnament double className="mt-3" />

        {/* object-cover inside a fixed portrait aspect, so swapping in a
            differently-proportioned photo still fills the frame cleanly.
            Nudge objectPosition to re-center the crop. */}
        <div className="mx-auto mt-6 aspect-[3/4] h-[36vh] max-h-[420px] min-h-[240px] overflow-hidden rounded-xl shadow-lg shadow-espresso/15 lg:h-[42vh] lg:max-h-[540px]">
          {welcome.photoSrc ? (
            // Plain <img>, not next/image — this points at the exact same
            // URL as the mobile full-bleed photo above, so the browser's
            // HTTP cache dedupes the request between the two hidden/shown
            // variants. next/image would instead request its own resized
            // optimizer URL, a genuine second download of the same photo.
            // eslint-disable-next-line @next/next/no-img-element -- swap-in couple photo, art-directed by the author
            <img
              src={welcome.photoSrc}
              alt={welcome.photoAlt}
              className="h-full w-full object-cover"
              style={{ objectPosition: "50% 22%" }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sage to-petal-blush text-espresso/45">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21s-7.5-4.9-10-9.3C.6 8.9 2 6 4.9 6c1.9 0 3.2 1.1 4 2.2C9.7 7.1 11 6 12.9 6 15.8 6 17.2 8.9 15.9 11.7 13.5 16.1 12 21 12 21z" />
              </svg>
              <p className="mt-3 font-body text-sm tracking-wide">Agrega la foto de la pareja</p>
            </div>
          )}
        </div>
      </div>

      {/* Framed date + live countdown — shared by both breakpoints.
          All three rows (month / day number / weekday) share ONE grid with
          identical 1fr-auto-1fr column tracks, so the flanking space is
          computed once for the whole block — not per-row — guaranteeing the
          day number sits in exactly the same center column as both label
          rows. The day number also uses lining figures: Cormorant
          Garamond's default numerals are oldstyle figures, whose glyph ink
          isn't symmetric within its own advance box (that asymmetry, not
          any layout issue, was what made the "7" look off-center). */}
      <div className="mx-auto max-w-sm px-6 pt-6 pb-16 text-center sm:max-w-md sm:pt-0 sm:pb-12 lg:max-w-lg">
        <div
          className="grid items-center gap-x-4 gap-y-2 sm:gap-y-4"
          style={{ gridTemplateColumns: "1fr auto 1fr" }}
        >
          <span className="h-px bg-gold/40" aria-hidden="true" />
          <span className="justify-self-center font-body text-xs tracking-[0.3em] text-espresso/70 uppercase">
            {welcome.monthName}
          </span>
          <span className="h-px bg-gold/40" aria-hidden="true" />

          <span aria-hidden="true" />
          <p className="lining-nums justify-self-center font-display text-7xl leading-none text-espresso sm:text-6xl">
            {welcome.day}
          </p>
          <span aria-hidden="true" />

          <span className="h-px bg-gold/40" aria-hidden="true" />
          <span className="justify-self-center font-body text-xs tracking-[0.3em] text-espresso/70 uppercase">
            {weekday} · {welcome.year}
          </span>
          <span className="h-px bg-gold/40" aria-hidden="true" />
        </div>

        {/* No connecting heart here on either breakpoint — the flow runs
            straight from the weekday row into "Faltan" with generous
            whitespace instead of an ornament. */}
        <p className="mt-10 mb-5 font-body text-xs tracking-[0.3em] text-espresso/70 uppercase sm:mt-8 sm:mb-5">Faltan</p>
        <div className="grid grid-cols-4 sm:gap-x-2">
          {units.map((u, i) => (
            <div
              key={u.label}
              className={`flex flex-col items-center px-1 sm:px-3 ${i > 0 ? "border-l border-gold/30" : ""}`}
            >
              <span suppressHydrationWarning className="font-display text-4xl text-espresso tabular-nums sm:text-5xl lg:text-6xl">
                {u.value}
              </span>
              <span className="mt-1 font-body text-[10px] tracking-[0.18em] text-espresso/60 uppercase sm:mt-2">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
