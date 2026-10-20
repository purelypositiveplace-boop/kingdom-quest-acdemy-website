/** Animated progress bar with a text label (never colour-only). */
export function ProgressTracker({ value, max, label, color = "var(--color-emerald)" }: { value: number; max: number; label: string; color?: string }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-semibold text-ink-soft">
        <span>{label}</span>
        <span>
          {value} / {max}
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function StepDots({ count, current, label }: { count: number; current: number; label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5" role="img" aria-label={`${label}: ${current + 1} of ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`h-3 rounded-full transition-all ${i === current ? "w-8 bg-royal" : i < current ? "w-3 bg-emerald" : "w-3 bg-ink/15"}`} />
      ))}
    </div>
  );
}
