/**
 * Illustrations made in ChatGPT for Kingdom Quest Academy, saved under /public/art.
 * Components should render these through <ArtImage> and keep their SVG drawing as the fallback,
 * so a missing file never shows a broken image. Paths are only listed once the file exists.
 */
export const ART = {
  brand: {
    logo: "/art/brand/logo.webp",
    hero: "/art/brand/hero.webp",
  },
  world: {
    map: "/art/world/map.webp",
    land: (worldId: string) => `/art/world/lands/${worldId}.webp`,
  },
  game: (gameId: string) => `/art/games/${gameId}.webp`,
  person: (characterId: string) => `/art/people/${characterId}.webp`,
  mascot: (mascotId: string) => `/art/mascots/${mascotId}.webp`,
  lessonCover: (lessonId: string) => `/art/lessons/${lessonId}/cover.webp`,
  scene: (lessonId: string, sceneId: string) => `/art/lessons/${lessonId}/${sceneId}.webp`,
  page: {
    prayerGarden: "/art/pages/prayer-garden.webp",
    bibleReader: "/art/pages/bible-reader.webp",
    music: "/art/pages/music.webp",
    reading: "/art/pages/reading.webp",
  },
} as const;

/** Which sets are complete so far (update as batches land). */
export const ART_READY = {
  brand: true,
  worldMap: true,
  /** all 10 lands */
  lands: true,
  /** all 16 games */
  games: true,
  /** every character in data/characters.ts (plus an extra "aaron") */
  people: true,
  /** leo, sunny, oliver, grace, finn */
  mascots: true,
  /** all 30 lessons (960x640) */
  lessonCovers: true,
  /** story scenes per lesson (1024x683, named by scene id) */
  scenes: {
    creation: ["beginning", "day1", "day2", "day3", "day4", "day5", "day6", "day7", "care"],
    noah: ["noah-walked", "build", "animals", "rain", "safe", "dove", "out", "rainbow"],
    "jesus-born": ["gabriel", "joseph-dream", "journey", "born", "shepherds", "glory", "share", "star", "gifts"],
  } as Record<string, string[]>,
};

export const ART_NOTE =
  "Pictures of Bible people are an artist's imagination. The Bible doesn't tell us exactly what they looked like.";
