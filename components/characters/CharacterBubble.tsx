import type { MascotId } from "@/lib/curriculum/types";
import { MASCOTS } from "@/data/mascots";
import { Mascot, type Expression } from "./Mascot";
import type { ReactNode } from "react";

/** A mascot with a speech bubble. Used for guidance and feedback across the site. */
export function CharacterBubble({
  id,
  children,
  expression = "happy",
  size = 96,
  side = "left",
  className = "",
}: {
  id: MascotId;
  children: ReactNode;
  expression?: Expression;
  size?: number;
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col items-center gap-3 sm:items-end ${side === "right" ? "sm:flex-row-reverse" : "sm:flex-row"} ${className}`}>
      <Mascot id={id} size={size} expression={expression} animate="idle" />
      <div className="relative min-w-0 max-w-md break-words rounded-3xl sm:mb-4 bg-white px-5 py-4 text-lg font-semibold text-ink shadow-[var(--shadow-card)]" aria-live="polite">
        <span className="sr-only">{MASCOTS[id].name} says: </span>
        {children}
      </div>
    </div>
  );
}

export function MascotCard({ id }: { id: MascotId }) {
  const m = MASCOTS[id];
  return (
    <div className="card flex flex-col items-center gap-2 p-5 text-center">
      <Mascot id={id} size={120} />
      <h3 className="text-xl font-bold text-royal-dark">{m.name}</h3>
      <p className="text-sm text-ink-soft">{m.role}</p>
    </div>
  );
}
