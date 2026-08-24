"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GardenHero } from "@/components/hero/GardenHero";
import { EnvelopeIntro } from "@/components/envelope/EnvelopeIntro";
import { useEnvelopeState } from "@/components/envelope/useEnvelopeState";

const SESSION_KEY = "envelope-intro-seen";
const REPLAY_PARAM = "replay-intro";
const DEBUG_REVEAL_PARAM = "debug-reveal";

export default function Home() {
  const [stage, dispatch] = useEnvelopeState();
  const reducedMotion = Boolean(useReducedMotion());
  // Lazy initializer (not an effect) so this reads the URL once, on the
  // client, without a synchronous setState-in-effect call. Guarded for SSR,
  // where `window` doesn't exist during the server render pass.
  const [debugReveal] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get(DEBUG_REVEAL_PARAM) === "1"
  );

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
      <GardenHero revealed={stage !== "idle"} reducedMotion={reducedMotion} debugReveal={debugReveal} />
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
