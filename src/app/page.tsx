"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GardenHero } from "@/components/hero/GardenHero";
import { EnvelopeIntro } from "@/components/envelope/EnvelopeIntro";
import { EnvelopeControls } from "@/components/envelope/EnvelopeControls";
import { useEnvelopeState } from "@/components/envelope/useEnvelopeState";
import { FairyCursor } from "@/components/FairyCursor";
import { WeddingSections } from "@/components/sections/WeddingSections";
import { useBackgroundMusic } from "@/components/audio/BackgroundMusicProvider";
import { MuteToggle } from "@/components/audio/MuteToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

const SESSION_KEY = "envelope-intro-seen";
const REPLAY_PARAM = "replay-intro";
const DEBUG_REVEAL_PARAM = "debug-reveal";
const CALIBRATE_PARAM = "calibrate-lanterns";

function hasParam(name: string) {
  return typeof window !== "undefined" && new URLSearchParams(window.location.search).get(name) === "1";
}

export default function Home() {
  const [stage, dispatch] = useEnvelopeState();
  const reducedMotion = Boolean(useReducedMotion());
  const { startMusic } = useBackgroundMusic();
  // Lazy initializers (not effects) so these read the URL once, on the
  // client, without a synchronous setState-in-effect call. Guarded for SSR,
  // where `window` doesn't exist during the server render pass.
  const [debugReveal] = useState(() => hasParam(DEBUG_REVEAL_PARAM));
  const [calibrate] = useState(() => hasParam(CALIBRATE_PARAM));

  // `svh` is a static value computed once — it never reacts to something
  // like a browser-injected "Translate this page?" banner shrinking the
  // real visible area afterward, which left the welcome section's photo
  // peeking in under the hero. Measuring window.innerHeight ourselves and
  // reacting to `resize` (not to scroll) gives the real current height
  // without reintroducing the janky continuous-recalculation-during-drag
  // behavior `dvh` had — resize fires once a browser-chrome change has
  // settled, not on every scroll frame.
  useEffect(() => {
    let raf = 0;
    function updateHeroHeight() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--hero-vh", `${window.innerHeight}px`);
      });
    }
    updateHeroHeight();
    window.addEventListener("resize", updateHeroHeight);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateHeroHeight);
    };
  }, []);

  // Works around a real iOS Safari bug (confirmed: reproduces on an actual
  // iPhone but NOT in Chrome DevTools' mobile emulation, which doesn't run
  // Safari's real compositor) where 2D content sharing the very first
  // paint with a new 3D-transform layer — the envelope's
  // perspective/rotateY panels — can be mis-ordered until something forces
  // a fresh compositing pass. A reload naturally forces that pass; this
  // nudges the whole document's compositing the same way, right after
  // mount, without needing an actual reload. Moving the controls to be a
  // sibling (not nested) wasn't enough on its own — the bug turned out to
  // be about the 3D layer existing anywhere on the page during first
  // paint, not about DOM nesting.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.body.style.transform = "translateZ(0)";
      requestAnimationFrame(() => {
        document.body.style.transform = "";
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Calibration mode skips the envelope so the full garden is shown immediately.
    if (params.get(CALIBRATE_PARAM) === "1") {
      dispatch({ type: "SKIP" });
      return;
    }
    if (params.get(REPLAY_PARAM) === "1") {
      window.sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      dispatch({ type: "SKIP" });
    }
  }, [dispatch]);

  useEffect(() => {
    if (stage === "done") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  return (
    <>
      <main className="relative w-full">
        {/* Full-viewport hero: the envelope opens to reveal the garden. */}
        <section className="relative w-full overflow-hidden" style={{ height: "var(--hero-vh, 100svh)" }}>
          <GardenHero
            revealed={stage !== "idle"}
            reducedMotion={reducedMotion}
            debugReveal={debugReveal}
            calibrate={calibrate}
          />
          {stage !== "done" && (
            <EnvelopeIntro
              stage={stage}
              reducedMotion={reducedMotion}
              onOpen={() => {
                dispatch({ type: "OPEN" });
                // The seal click is the primary, required user gesture that
                // starts the music — never autoplayed before this.
                startMusic();
              }}
              onComplete={() => dispatch({ type: "COMPLETE" })}
            />
          )}
        </section>

        <WeddingSections />
      </main>
      {/* Rendered as a sibling of EnvelopeIntro, not nested inside it — see
          EnvelopeControls for why (an iOS Safari compositing bug with the
          envelope's 3D-transformed panels). */}
      {stage !== "done" && <EnvelopeControls onSkip={() => dispatch({ type: "SKIP" })} />}
      <FairyCursor />
      {stage === "done" && (
        <>
          <MuteToggle />
          <LanguageToggle />
        </>
      )}
    </>
  );
}
