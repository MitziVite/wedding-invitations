"use client";

import { useEffect, useLayoutEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { GardenHero } from "@/components/hero/GardenHero";
import { EnvelopeIntro } from "@/components/envelope/EnvelopeIntro";
import { useEnvelopeState } from "@/components/envelope/useEnvelopeState";

const SESSION_KEY = "envelope-intro-seen";
const REPLAY_PARAM = "replay-intro";

export default function Home() {
  const [stage, dispatch] = useEnvelopeState();
  const reducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
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
    <main className="relative h-[100svh] w-full overflow-hidden">
      <GardenHero revealed={stage !== "idle"} reducedMotion={reducedMotion} />
      {stage !== "done" && (
        <EnvelopeIntro
          stage={stage}
          reducedMotion={reducedMotion}
          onOpen={() => dispatch({ type: "OPEN" })}
          onComplete={() => dispatch({ type: "COMPLETE" })}
          onSkip={() => dispatch({ type: "SKIP" })}
        />
      )}
    </main>
  );
}
