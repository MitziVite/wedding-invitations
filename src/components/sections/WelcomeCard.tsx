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

/**
 * Welcome card: a romantic photo with the couple's names in script, fading
 * softly into an ivory panel with an elegant framed date and a live
 * countdown. Content comes from weddingContent.welcome so it stays easy to
 * customize (drop in the real photo, change the target date, etc.).
 */
export function WelcomeCard() {
  const { coupleNames, weekday, welcome } = weddingContent;
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
    <section id="bienvenida" className="w-full bg-ivory">
      {/* Photo with the couple's names, fading into the ivory panel below.
          Full viewport width, height capped (not full-screen) — object-cover
          keeps the couple centered regardless of the resulting crop. */}
      <div className="relative h-[52vh] w-full overflow-hidden bg-champagne sm:h-[62vh]">
        {welcome.photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- swap-in couple photo, art-directed by the author
          <img
            src={welcome.photoSrc}
            alt={welcome.photoAlt}
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 78%" }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-champagne to-blush text-coffee/45">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21s-7.5-4.9-10-9.3C.6 8.9 2 6 4.9 6c1.9 0 3.2 1.1 4 2.2C9.7 7.1 11 6 12.9 6 15.8 6 17.2 8.9 15.9 11.7 13.5 16.1 12 21 12 21z" />
            </svg>
            <p className="mt-3 font-body text-sm tracking-wide">Agrega la foto de la pareja</p>
          </div>
        )}

        {/* Soft dark scrim at the top so the ivory names read over the sky. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 to-transparent" />

        {/* Couple names in script over the image. */}
        <div className="absolute inset-x-0 top-0 flex justify-center px-6 pt-8 sm:pt-10">
          <p
            className="text-center text-ivory"
            style={{
              fontFamily: "var(--font-allura)",
              fontSize: "clamp(2.6rem, 9vw, 4.5rem)",
              lineHeight: 1.1,
              textShadow: "0 2px 14px rgba(30,20,14,0.55)",
            }}
          >
            {coupleNames}
          </p>
        </div>

        {/* Soft fade from the photo into the ivory section. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-ivory" />
      </div>

      {/* Framed date + live countdown. */}
      <div className="mx-auto max-w-md px-6 pt-6 pb-20 text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gold/40" />
          <span className="font-body text-xs tracking-[0.3em] text-coffee/70 uppercase">
            {welcome.monthName}
          </span>
          <span className="h-px flex-1 bg-gold/40" />
        </div>

        <p className="my-2 font-display text-7xl leading-none text-coffee">{welcome.day}</p>

        <div className="flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gold/40" />
          <span className="font-body text-xs tracking-[0.3em] text-coffee/70 uppercase">
            {weekday} · {welcome.year}
          </span>
          <span className="h-px flex-1 bg-gold/40" />
        </div>

        <p className="mt-10 mb-5 font-body text-xs tracking-[0.3em] text-wine uppercase">Faltan</p>
        <div className="grid grid-cols-4 gap-2">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <span
                suppressHydrationWarning
                className="font-display text-4xl text-coffee tabular-nums sm:text-5xl"
              >
                {u.value}
              </span>
              <span className="mt-1 font-body text-[10px] tracking-[0.18em] text-coffee/60 uppercase">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
