# Background music

Drop the final, licensed/authorized instrumental track here as:

```
wedding-theme.mp3
```

No audio file is committed to this repo — `src/components/audio/BackgroundMusicProvider.tsx`
references this path as a placeholder and fails silently if the file is missing.

**Intended style:** an elegant, magical instrumental — the atmosphere of
*Barbie in the 12 Dancing Princesses* — mid-length and loopable (the site
plays it on `loop`), since it plays continuously from when the guest opens
the envelope through the rest of the page.

Once the real file is added here, no code changes are needed — playback,
fade-in, and the mute toggle already reference this exact path.
