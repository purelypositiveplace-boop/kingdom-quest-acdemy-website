"use client";

import { useEffect, useState } from "react";
import { useKQ } from "@/lib/progress/store";
import { Mascot } from "@/components/characters/Mascot";
import { PrimaryButton } from "@/components/ui/Button";

/** Gentle screen-time reminder set by a parent. It suggests a break; it never locks the child out. */
export function BreakReminder() {
  const minutes = useKQ((s) => s.settings.breakMinutes);
  const [show, setShow] = useState(false);
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (!minutes) return;
    const t = setTimeout(() => setShow(true), minutes * 60000);
    return () => clearTimeout(t);
  }, [minutes, round]);
  if (!show) return null;
  return (
    <div role="dialog" aria-labelledby="break-title" className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-[2rem] bg-white p-5 text-center shadow-2xl lg:bottom-8">
      <Mascot id="sunny" size={90} expression="calm" className="mx-auto" />
      <h2 id="break-title" className="text-2xl font-bold text-royal-dark">
        Time for a stretch break?
      </h2>
      <p className="text-ink-soft">You&apos;ve been learning for {minutes} minutes. Stand up, stretch, get a drink of water, or go tell someone what you learned!</p>
      <PrimaryButton
        tone="sun"
        className="mt-3"
        onClick={() => {
          setShow(false);
          setRound((r) => r + 1);
        }}
      >
        Okay!
      </PrimaryButton>
    </div>
  );
}
