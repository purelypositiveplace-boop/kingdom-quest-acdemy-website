"use client";

/**
 * Gentle sound effects made with the Web Audio API, so there are no audio files to license.
 * Every call checks the child's sound setting first.
 */
import { useKQ } from "@/lib/progress/store";

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export const NOTE_FREQ: Record<string, number> = (() => {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const out: Record<string, number> = {};
  for (let oct = 2; oct <= 6; oct++) names.forEach((n, i) => (out[`${n}${oct}`] = 440 * Math.pow(2, (i - 9 + (oct - 4) * 12) / 12)));
  return out;
})();

export function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.18) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

const SOUNDS = {
  tap: () => tone(660, 0, 0.08, "triangle", 0.1),
  flip: () => { tone(520, 0, 0.06, "triangle", 0.08); tone(780, 0.05, 0.06, "triangle", 0.08); },
  correct: () => [523, 659, 784].forEach((f, i) => tone(f, i * 0.08, 0.25, "sine", 0.16)),
  gentle: () => { tone(392, 0, 0.18, "sine", 0.1); tone(349, 0.12, 0.22, "sine", 0.08); },
  star: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.3, "triangle", 0.12)),
  win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, "sine", 0.15)),
  grow: () => [440, 554, 659].forEach((f, i) => tone(f, i * 0.09, 0.22, "sine", 0.12)),
  bubble: () => tone(900 + Math.random() * 300, 0, 0.1, "sine", 0.08),
};

export type SoundName = keyof typeof SOUNDS;

export function play(name: SoundName) {
  if (!useKQ.getState().settings.sound) return;
  SOUNDS[name]();
}
