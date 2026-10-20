import type { ReactNode } from "react";
import { Mascot } from "@/components/characters/Mascot";
import type { MascotId } from "@/lib/curriculum/types";

/** Shared layout for About, Privacy, Terms, Safety and Contact. */
export function InfoPage({ title, intro, mascot = "grace", updated, children }: { title: string; intro: string; mascot?: MascotId; updated?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <header className="flex items-center gap-4">
        <Mascot id={mascot} size={90} expression="calm" animate="none" />
        <div>
          <h1 className="text-4xl font-bold text-royal-dark">{title}</h1>
          {updated && <p className="text-sm text-ink-soft">Last updated {updated}</p>}
        </div>
      </header>
      <p className="text-lg text-ink">{intro}</p>
      <div className="card space-y-6 p-6 md:p-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-royal-dark [&_li]:ml-6 [&_li]:list-disc [&_p]:text-ink [&_ul]:space-y-1 [&_ul]:text-ink">{children}</div>
    </div>
  );
}
