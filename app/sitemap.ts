import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LESSONS } from "@/lib/curriculum";
import { GAMES } from "@/data/games";
import { CHARACTERS } from "@/data/characters";
import { WORLDS } from "@/data/worlds";
import { VALUES } from "@/data/values";
import { PRINTABLES } from "@/data/printables";
import { BOOKS } from "@/data/bible/books";

/** Public educational pages only. Child dashboards, parent and admin areas are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/stories", "/games", "/world", "/verses", "/bible", "/prayer", "/jesus", "/characters", "/map", "/timeline", "/values", "/music", "/printables", "/about", "/privacy", "/safety", "/terms", "/contact"];
  const urls = [
    ...pages,
    ...LESSONS.map((l) => `/lessons/${l.id}`),
    ...GAMES.map((g) => `/games/${g.id}`),
    ...CHARACTERS.map((c) => `/characters/${c.id}`),
    ...WORLDS.map((w) => `/world/${w.id}`),
    ...VALUES.map((v) => `/values/${v.id}`),
    ...PRINTABLES.map((p) => `/printables/${p.id}`),
    ...BOOKS.map((b) => `/bible/${b.id}/1`),
  ];
  return urls.map((u) => ({ url: `${SITE_URL}${u}`, changeFrequency: "weekly", priority: u === "" ? 1 : 0.7 }));
}
