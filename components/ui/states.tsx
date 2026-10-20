import { Mascot } from "@/components/characters/Mascot";
import type { ReactNode } from "react";

export function LoadingState({ label = "Getting things ready..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Mascot id="leo" size={110} animate="bounce" expression="excited" />
      <p className="font-display text-xl text-royal-dark">{label}</p>
    </div>
  );
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-[1.75rem] bg-royal-soft/60" />
      ))}
    </div>
  );
}

export function ErrorState({ title = "Oops! Something went a little wobbly.", message = "Let's try that again.", action }: { title?: string; message?: string; action?: ReactNode }) {
  return (
    <div role="alert" className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-8 text-center">
      <Mascot id="oliver" size={120} expression="thinking" animate="none" />
      <h2 className="text-2xl font-bold text-royal-dark">{title}</h2>
      <p className="text-ink-soft">{message}</p>
      {action}
    </div>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 p-8 text-center">
      <Mascot id="finn" size={110} expression="thinking" animate="none" />
      <h2 className="text-xl font-bold text-royal-dark">{title}</h2>
      <p className="text-ink-soft">{message}</p>
      {action}
    </div>
  );
}

/** Page heading block with a mascot, used at the top of every section for consistency. */
export function PageHero({ title, subtitle, mascot, color = "var(--color-royal)", children }: { title: string; subtitle?: string; mascot?: ReactNode; color?: string; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] p-6 text-white shadow-[var(--shadow-card)] md:p-10" style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #1c2f8f))` }}>
      <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center">
        {mascot && <div className="shrink-0">{mascot}</div>}
        <div className="flex-1">
          <h1 className="text-3xl font-bold drop-shadow-sm md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-lg text-white/90 md:text-xl">{subtitle}</p>}
          {children}
        </div>
      </div>
      <svg className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-20" viewBox="0 0 100 100" aria-hidden>
        <path d="M50 5 l12 30 h32 l-26 19 l10 31 l-28 -19 l-28 19 l10 -31 l-26 -19 h32 z" fill="#fff" />
      </svg>
    </header>
  );
}
