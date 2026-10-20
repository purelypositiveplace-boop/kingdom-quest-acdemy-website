"use client";

import { useState, type ReactNode } from "react";

/**
 * Shows an illustration if one exists, otherwise the designed SVG fallback.
 * A missing or broken file silently switches to the fallback, so kids never see a broken image.
 */
export function ArtImage({ src, alt, fallback, className = "h-full w-full object-cover" }: { src?: string; alt: string; fallback: ReactNode; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback}</>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
