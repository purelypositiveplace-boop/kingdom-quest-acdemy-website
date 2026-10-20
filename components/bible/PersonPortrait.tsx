import { personArt } from "@/lib/art";
/**
 * A deliberately simple, symbolic portrait (initial on a robed silhouette) so we never invent
 * what a real Bible person looked like. Replace with commissioned art via ArtImage later.
 */
export function PersonPortrait({ name, color, size = 96, id }: { name: string; color: string; size?: number; id?: string }) {
  const img = id ? personArt(id) : undefined;
  if (img)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={img} width={size} height={size} alt={`Artist's picture of ${name}`} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`Symbol for ${name}`}>
      <circle cx="50" cy="50" r="48" fill={color} opacity="0.25" />
      <path d="M22 96 q28 -50 56 0 z" fill={color} />
      <circle cx="50" cy="36" r="17" fill="#f3d9bf" />
      <path d="M32 36 q18 -26 36 0 v6 q-18 -10 -36 0 z" fill="#fffaf0" />
      <text x="50" y="84" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">
        {name[0]}
      </text>
    </svg>
  );
}
