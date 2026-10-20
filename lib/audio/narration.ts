import manifest from "@/data/audio-manifest.generated.json";

/**
 * Recorded narration lookup. We never use the browser's robotic text-to-speech voice:
 * a play button only appears when a real recording exists in public/audio/narration.
 * Recordings are made by `npm run record:narration` (ElevenLabs) — see README.
 */
const FILES = new Set<string>((manifest as { files: string[] }).files);

export function narrationKey(...parts: string[]) {
  return parts.join("/");
}

/** URL for a recording, or null when none has been recorded yet. */
export function narrationUrl(key: string): string | null {
  return FILES.has(key) ? `/audio/narration/${key}.mp3` : null;
}

export function hasAnyNarration() {
  return FILES.size > 0;
}
