import artFiles from "@/data/art-files.generated.json";

const FILES = new Set((artFiles as { files: string[] }).files);

/**
 * Returns an artwork path only if that file has been generated and listed in data/art-files.generated.json
 * (built from public/art by scripts/build-art-manifest.ts; data/art-manifest.ts documents the paths).
 * Components fall back to their drawn SVG art otherwise, so missing art never shows as broken.
 */
export function art(path: string): string | undefined {
  return FILES.has(path) ? path : undefined;
}

export const lessonCover = (lessonId: string) => art(`/art/lessons/${lessonId}/cover.webp`);
export const sceneArt = (lessonId: string, sceneId: string) => art(`/art/lessons/${lessonId}/${sceneId}.webp`);
export const mascotArt = (id: string) => art(`/art/mascots/${id}.webp`);
export const gameArt = (id: string) => art(`/art/games/${id}.webp`);
export const personArt = (id: string) => art(`/art/people/${id}.webp`);
export const worldArt = (id: string) => art(`/art/world/lands/${id}.webp`);
export const badgeArt = (id: string) => art(`/art/badges/${id}.webp`);
export const brandArt = { hero: () => art("/art/brand/hero.webp"), logo: () => art("/art/brand/logo.webp") };
export const worldMapArt = () => art("/art/world/map.webp");
