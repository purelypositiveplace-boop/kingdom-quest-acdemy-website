"use client";

import type { Song } from "@/data/songs";
import { NOTE_FREQ, tone } from "./sfx";

/**
 * Plays an original song's melody with a soft built-in synth and reports which lyric line is
 * being sung, for sing-along highlighting. Returns a stop function.
 */
export function playSong(song: Song, volume: number, onLine: (i: number | null) => void): () => void {
  const beat = 60 / song.bpm;
  const timers: ReturnType<typeof setTimeout>[] = [];
  let t = 0.15;
  song.lines.forEach((line, i) => {
    timers.push(setTimeout(() => onLine(i), t * 1000));
    for (const [note, beats] of line.notes) {
      const dur = beats * beat;
      if (note !== "-" && NOTE_FREQ[note]) {
        tone(NOTE_FREQ[note], t, dur * 0.95, "triangle", 0.16 * volume);
        tone(NOTE_FREQ[note] / 2, t, dur * 0.9, "sine", 0.06 * volume);
      }
      t += dur;
    }
  });
  timers.push(setTimeout(() => onLine(null), t * 1000 + 200));
  return () => {
    timers.forEach(clearTimeout);
    onLine(null);
  };
}

export function songSeconds(song: Song) {
  const beats = song.lines.reduce((n, l) => n + l.notes.reduce((m, [, b]) => m + b, 0), 0);
  return Math.round((beats * 60) / song.bpm);
}
