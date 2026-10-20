import Link from "next/link";
import { Clock, Star } from "lucide-react";
import type { Lesson } from "@/lib/curriculum/types";
import type { GameInfo } from "@/data/games";
import { SceneArt } from "@/components/bible/SceneArt";
import { lessonArtProps } from "@/lib/curriculum";
import { gameArt, lessonCover } from "@/lib/art";
import { ArtImage } from "@/components/bible/ArtImage";
import { GameIcon } from "@/components/games/GameIcon";
import type { ReactNode } from "react";

/** Generic tappable learning card with an icon or picture on top. */
export function LearningCard({ href, title, text, color = "#2a48d4", art, badge }: { href: string; title: string; text?: string; color?: string; art?: ReactNode; badge?: ReactNode }) {
  return (
    <Link href={href} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-32 items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 55%, white))` }}>
        {art}
        {badge && <div className="absolute right-3 top-3">{badge}</div>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-xl font-bold text-royal-dark group-hover:text-royal">{title}</h3>
        {text && <p className="text-sm text-ink-soft">{text}</p>}
      </div>
    </Link>
  );
}

export function StoryCard({ lesson, done, minutes }: { lesson: Lesson; done?: boolean; minutes?: number }) {
  return (
    <Link href={`/lessons/${lesson.id}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl" data-testid={`story-${lesson.id}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <ArtImage src={lesson.art.image ?? lessonCover(lesson.id)} alt={lesson.art.alt} fallback={<SceneArt theme={lesson.art.theme} props={lessonArtProps(lesson)} alt={lesson.art.alt} className="h-full w-full" />} />
        {done && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald px-3 py-1 text-sm font-bold text-white shadow">
            <Star size={14} fill="#fff" aria-hidden /> Done
          </span>
        )}
        {lesson.featured && <span className="absolute left-3 top-3 rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink shadow">Storybook</span>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-xl font-bold text-royal-dark group-hover:text-royal">{lesson.title}</h3>
        <p className="line-clamp-2 text-sm text-ink-soft">{lesson.summary}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs font-bold text-ink-soft">
          <span className="rounded-full bg-royal-soft px-2 py-1 text-royal-dark">{lesson.refs[0]}</span>
          <span className="rounded-full bg-ink/5 px-2 py-1">{lesson.testament === "OT" ? "Old Testament" : "New Testament"}</span>
          {minutes && (
            <span className="flex items-center gap-1 rounded-full bg-ink/5 px-2 py-1">
              <Clock size={12} aria-hidden /> {minutes} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function GameCard({ game, wins = 0 }: { game: GameInfo; wins?: number }) {
  return (
    <Link href={`/games/${game.id}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl" data-testid={`game-${game.id}`}>
      <div className="relative flex h-32 items-center justify-center" style={{ background: `radial-gradient(circle at 30% 20%, #ffffff55, transparent 50%), ${game.color}` }}>
        <ArtImage src={gameArt(game.id)} alt="" className="h-28 w-28 object-contain" fallback={<GameIcon icon={game.icon} />} />
        {wins > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-emerald">
            <Star size={12} fill="currentColor" aria-hidden /> Played
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-lg font-bold text-royal-dark group-hover:text-royal">{game.title}</h3>
        <p className="text-sm text-ink-soft">{game.blurb}</p>
      </div>
    </Link>
  );
}
