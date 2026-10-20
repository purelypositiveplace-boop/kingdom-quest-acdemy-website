"use client";

import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/Logo";

export type PaperSize = "letter" | "a4";
export const PAPER: Record<PaperSize, { w: string; h: string; css: string; label: string }> = {
  letter: { w: "8.5in", h: "11in", css: "letter", label: "US Letter" },
  a4: { w: "210mm", h: "297mm", css: "A4", label: "A4" },
};

/** One printed sheet. On screen it looks like paper; when printing, each sheet is one page. */
export function PrintableLayout({ paper, title, subtitle, children, footer }: { paper: PaperSize; title: string; subtitle?: string; children: ReactNode; footer?: string }) {
  const p = PAPER[paper];
  return (
    <section
      className="print-page mx-auto flex flex-col bg-white text-black shadow-xl print:shadow-none"
      style={{ width: "100%", maxWidth: p.w, minHeight: p.h, padding: "0.5in", boxSizing: "border-box" }}
    >
      <header className="mb-4 flex items-center justify-between border-b-2 border-black/20 pb-2">
        <div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 text-right text-xs">
          <span>
            Name: ____________
            <br />
            Kingdom Quest Academy
          </span>
          <LogoMark size={44} />
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mt-4 border-t border-black/20 pt-2 text-center text-[10px]">{footer ?? "Free from Kingdom Quest Academy · Scripture: World English Bible (public domain) · Free to copy for home, church and school."}</footer>
    </section>
  );
}
