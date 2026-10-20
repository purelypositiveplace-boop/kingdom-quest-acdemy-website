"use client";

import { useEffect } from "react";
import { useKQ } from "@/lib/progress/store";

/** Loads saved progress after mount, then mirrors accessibility settings onto <html> data attributes. */
export function AccessibilityApplier() {
  const s = useKQ((st) => st.settings);
  useEffect(() => {
    void useKQ.persist.rehydrate();
  }, []);
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.text = s.textSize;
    el.dataset.font = s.easyFont ? "easy" : "default";
    el.dataset.contrast = s.highContrast ? "high" : "normal";
    el.dataset.motion = s.reducedMotion ? "reduce" : "auto";
    el.dataset.minimal = s.minimalReading ? "on" : "off";
  }, [s]);
  return null;
}
