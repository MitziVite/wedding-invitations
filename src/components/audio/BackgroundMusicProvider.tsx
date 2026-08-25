"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fadeVolume } from "@/lib/audio/fadeVolume";

const TRACK_SRC = "/audio/wedding-theme.mp3";

const TARGET_VOLUME = 0.3; // 25–35% comfortable range
const FADE_IN_MS = 1800; // ~1.5–2s gentle fade-in
const START_OFFSET_SECONDS = 16.5; // skip the track's intro, start mid-track
const MUTE_STORAGE_KEY = "bg-music-muted";

interface BackgroundMusicContextValue {
  isMuted: boolean;
  hasStarted: boolean;
  /** Idempotent — only the first call (the wax seal click) actually starts playback. */
  startMusic: () => void;
  toggleMute: () => void;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(null);

/**
 * Owns the single, stable <audio> element for the whole visit — mounted once
 * in RootLayout, above the page's own conditional rendering, so it's never
 * torn down (and never restarts) when the envelope intro unmounts or the
 * page tree re-renders. Music never autoplays; `startMusic()` must be
 * called from a real user gesture (the wax seal's click handler).
 */
export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const cancelFadeRef = useRef<(() => void) | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Lazy initializer reads the remembered choice once, on the client only.
  const [isMuted, setIsMuted] = useState(
    () => typeof window !== "undefined" && window.sessionStorage.getItem(MUTE_STORAGE_KEY) === "1"
  );

  // <audio> is treated as an uncontrolled element throughout (React's own
  // guidance for media elements) — this effect is the single place that
  // pushes mute state onto it, rather than a reactive `muted` prop.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const startMusic = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setHasStarted(true);

    const audio = audioRef.current;
    if (!audio) return;

    const seekAndPlay = () => {
      // Only seek if the offset is actually inside the track — guards
      // against a shorter file than expected leaving playback silent.
      if (!audio.duration || START_OFFSET_SECONDS < audio.duration) {
        audio.currentTime = START_OFFSET_SECONDS;
      }
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            cancelFadeRef.current?.();
            cancelFadeRef.current = fadeVolume(audio, TARGET_VOLUME, FADE_IN_MS);
          })
          .catch(() => {
            // Blocked by autoplay policy, or the file doesn't exist —
            // music is decorative, never critical, fail silently.
            hasStartedRef.current = false;
            setHasStarted(false);
          });
      }
    };

    // currentTime is only reliably seekable once metadata (duration, in
    // particular) has loaded; on a slow connection that may not have
    // happened yet even with preload="auto", so wait for it once if needed.
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      seekAndPlay();
    } else {
      audio.addEventListener("loadedmetadata", seekAndPlay, { once: true });
    }
  }, []);

  const toggleMute = useCallback(() => {
    // A returning-within-session guest can land with the envelope
    // auto-skipped, so the seal's click (the primary start trigger) never
    // fires. Treat a deliberate click on the audio control itself as a
    // valid first gesture too, rather than leaving a dead button.
    if (!hasStartedRef.current) {
      setIsMuted(false);
      window.sessionStorage.setItem(MUTE_STORAGE_KEY, "0");
      startMusic();
      return;
    }
    setIsMuted((prev) => {
      const next = !prev;
      window.sessionStorage.setItem(MUTE_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }, [startMusic]);

  const value = useMemo(
    () => ({ isMuted, hasStarted, startMusic, toggleMute }),
    [isMuted, hasStarted, startMusic, toggleMute]
  );

  return (
    <BackgroundMusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" onError={() => undefined} />
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const ctx = useContext(BackgroundMusicContext);
  if (!ctx) {
    throw new Error("useBackgroundMusic must be used within a BackgroundMusicProvider");
  }
  return ctx;
}
