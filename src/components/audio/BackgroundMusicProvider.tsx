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

// <audio>.volume is linear amplitude, not perceived loudness (which scales
// closer to a cube law) — 0.3 here already read as noticeably louder than
// "30%" to the ear, so the constant (and the slider built on it) sit well
// below the on-screen target.
const TARGET_VOLUME = 0.02;
/** Slider ceiling — a few times the default, never anywhere near harsh. */
const MAX_VOLUME = 0.08;
const FADE_IN_MS = 1800; // ~1.5–2s gentle fade-in
const START_OFFSET_SECONDS = 16.5; // skip the track's intro, start mid-track
const MUTE_STORAGE_KEY = "bg-music-muted";
const VOLUME_STORAGE_KEY = "bg-music-volume";

function readStoredVolume(): number {
  if (typeof window === "undefined") return TARGET_VOLUME;
  const raw = Number(window.sessionStorage.getItem(VOLUME_STORAGE_KEY));
  return Number.isFinite(raw) && raw >= 0 ? Math.min(MAX_VOLUME, raw) : TARGET_VOLUME;
}

interface BackgroundMusicContextValue {
  isMuted: boolean;
  hasStarted: boolean;
  /** Idempotent — only the first call (the wax seal click) actually starts playback. */
  startMusic: () => void;
  toggleMute: () => void;
  /** Current linear volume (0..maxVolume) — drives the slider directly. */
  volume: number;
  maxVolume: number;
  /** Sets volume immediately (no fade) — meant for live slider dragging. 0 also marks the track as muted. */
  setVolume: (value: number) => void;
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

  // Lazy initializers read the remembered choices once, on the client only.
  const [isMuted, setIsMuted] = useState(
    () => typeof window !== "undefined" && window.sessionStorage.getItem(MUTE_STORAGE_KEY) === "1"
  );
  const [volume, setVolumeState] = useState(readStoredVolume);
  // The fade-in below runs asynchronously (after `play()` resolves), so it
  // needs the latest volume without a stale closure — a ref mirrors state.
  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // <audio> is treated as an uncontrolled element throughout (React's own
  // guidance for media elements) — these effects are the only places that
  // push mute/volume state onto it, rather than reactive props.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Locking the phone or switching away from the tab fires
  // `visibilitychange` — pause there so the music doesn't keep playing
  // behind the lock screen, and pick back up automatically on return
  // (still muted if it was muted before).
  useEffect(() => {
    function handleVisibilityChange() {
      const audio = audioRef.current;
      if (!audio || !hasStartedRef.current) return;
      if (document.hidden) {
        audio.pause();
      } else {
        audio.play().catch(() => undefined);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
            cancelFadeRef.current = fadeVolume(audio, volumeRef.current, FADE_IN_MS);
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

  const setVolume = useCallback(
    (value: number) => {
      const clamped = Math.min(MAX_VOLUME, Math.max(0, value));
      setVolumeState(clamped);
      window.sessionStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
      setIsMuted(clamped === 0);
      window.sessionStorage.setItem(MUTE_STORAGE_KEY, clamped === 0 ? "1" : "0");
      // Same first-gesture handling as toggleMute — dragging the slider on
      // a returning guest (envelope auto-skipped) is just as valid a first
      // gesture as clicking the seal.
      if (!hasStartedRef.current && clamped > 0) startMusic();
    },
    [startMusic]
  );

  const value = useMemo(
    () => ({ isMuted, hasStarted, startMusic, toggleMute, volume, maxVolume: MAX_VOLUME, setVolume }),
    [isMuted, hasStarted, startMusic, toggleMute, volume, setVolume]
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
