/**
 * Smoothly ramps an <audio> element's volume from its current value to
 * `target` over `durationMs`, via requestAnimationFrame (eased, not linear,
 * so the fade feels like a gentle settle rather than a mechanical ramp).
 * Returns a cancel function so an in-flight fade can be interrupted safely.
 */
export function fadeVolume(audio: HTMLAudioElement, target: number, durationMs: number): () => void {
  const start = audio.volume;
  const clampedTarget = Math.min(1, Math.max(0, target));
  const startTime = performance.now();
  let rafId = 0;

  const step = (now: number) => {
    // `now` (the rAF frame timestamp) can land fractionally before the
    // `performance.now()` captured above, making elapsed briefly negative
    // on the first frame — clamp both ends or `eased` can overshoot past
    // [0, 1] and produce an out-of-range volume the browser throws on.
    const elapsed = now - startTime;
    const t = Math.min(1, Math.max(0, elapsed / durationMs));
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const value = start + (clampedTarget - start) * eased;
    audio.volume = Math.min(1, Math.max(0, value));
    if (t < 1) {
      rafId = requestAnimationFrame(step);
    }
  };

  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}
