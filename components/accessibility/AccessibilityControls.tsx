"use client";

import { useKQ, type Settings } from "@/lib/progress/store";

/** Child-facing comfort settings. Parent-only settings (gamification, music) live in the parent area. */
export function AccessibilityControls({ parent = false }: { parent?: boolean }) {
  const s = useKQ((st) => st.settings);
  const set = useKQ((st) => st.setSettings);
  const toggle = (k: keyof Settings, label: string, hint: string) => (
    <label key={k} className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
      <span>
        <span className="block font-bold text-ink">{label}</span>
        <span className="block text-sm text-ink-soft">{hint}</span>
      </span>
      <input type="checkbox" className="h-7 w-7 accent-[var(--color-royal)]" checked={Boolean(s[k])} onChange={(e) => set({ [k]: e.target.checked } as Partial<Settings>)} />
    </label>
  );
  return (
    <div className="space-y-3">
      <fieldset className="rounded-2xl bg-white px-4 py-3 shadow-sm">
        <legend className="sr-only">Text size</legend>
        <span className="mb-2 block font-bold text-ink">Text size</span>
        <div className="flex gap-2">
          {(["normal", "large", "xl"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={s.textSize === v}
              onClick={() => set({ textSize: v })}
              className={`tap-target flex-1 rounded-xl border-2 font-display font-bold ${s.textSize === v ? "border-royal bg-royal text-white" : "border-royal-soft bg-white text-royal-dark"}`}
              style={{ fontSize: v === "normal" ? 16 : v === "large" ? 20 : 24 }}
            >
              A
            </button>
          ))}
        </div>
      </fieldset>
      {toggle("easyFont", "Easy-read letters", "A font designed to be easier to read (helpful for dyslexia).")}
      {toggle("highContrast", "High contrast", "Stronger colours and outlines.")}
      {toggle("reducedMotion", "Calm motion", "Turns off moving and bouncing animations.")}
      {toggle("minimalReading", "Fewer words", "Shorter text with more pictures.")}
      {toggle("sound", "Sound effects", "Gentle dings and chimes.")}
      {parent && toggle("music", "Background music", "Soft music in the Prayer Garden (off by default).")}
      {parent && toggle("gamification", "Stars and badges", "Turn off to hide stars, badges and celebrations.")}
      {parent && toggle("timers", "Game timers on by default", "Timers are always optional and can be turned off in each game.")}
    </div>
  );
}
