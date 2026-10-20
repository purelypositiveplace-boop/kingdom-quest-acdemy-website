"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Music, Pause, Play, Volume1, Volume2 } from "lucide-react";
import { SONGS, SONG_CATEGORIES, type Song } from "@/data/songs";
import { playSong, songSeconds } from "@/lib/audio/song-player";
import { useKQ } from "@/lib/progress/store";
import { refHref } from "@/lib/bible/reference";
import Link from "next/link";

/**
 * Song player. Songs are original. Until studio recordings exist (`audio` in data/songs.ts),
 * melodies play on a gentle built-in synth — we never pretend a missing recording exists.
 */
export function MusicCenter() {
  const [cat, setCat] = useState<string>("All");
  const [song, setSong] = useState<Song>(SONGS[0]);
  const [line, setLine] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const stopRef = useRef<(() => void) | null>(null);
  const favorites = useKQ((s) => s.progress.favorites);
  const toggleFavorite = useKQ((s) => s.toggleFavorite);
  const list = SONGS.filter((s) => (cat === "All" ? true : cat === "Favourites" ? favorites.includes(`song:${s.id}`) : s.category === cat));

  useEffect(() => () => stopRef.current?.(), []);

  function toggle() {
    if (playing) {
      stopRef.current?.();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    stopRef.current = playSong(song, volume, (i) => {
      setLine(i);
      if (i === null) setPlaying(false);
    });
  }

  function choose(s: Song) {
    stopRef.current?.();
    setPlaying(false);
    setLine(null);
    setSong(s);
  }

  const fav = favorites.includes(`song:${song.id}`);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {["All", "Favourites", ...SONG_CATEGORIES].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`min-h-10 rounded-full px-3 text-sm font-semibold ${cat === c ? "bg-royal text-white" : "bg-white text-royal-dark shadow-sm"}`}>
              {c}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {list.length === 0 && <li className="text-ink-soft">No songs here yet.</li>}
          {list.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => choose(s)} aria-current={song.id === s.id} className={`flex min-h-16 w-full items-center gap-3 rounded-2xl p-3 text-left ${song.id === s.id ? "bg-white shadow-md ring-4 ring-lavender" : "bg-white/70 hover:bg-white"}`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: s.color }}>
                  <Music color="#fff" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-lg font-bold text-royal-dark">{s.title}</span>
                  <span className="text-xs text-ink-soft">
                    {s.category} · {songSeconds(s)}s
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <section className="card overflow-hidden" aria-labelledby="now-playing">
        <div className="flex items-center gap-4 p-5 text-white" style={{ background: `linear-gradient(135deg, ${song.color}, #1c2f8f)` }}>
          <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden>
            <rect width="80" height="80" rx="18" fill="#ffffff33" />
            <path d="M30 56 V22 l28 -6 v34" stroke="#fff" strokeWidth="5" fill="none" />
            <circle cx="24" cy="56" r="8" fill="#fff" />
            <circle cx="52" cy="50" r="8" fill="#fff" />
          </svg>
          <div className="flex-1">
            <h2 id="now-playing" className="text-2xl font-bold">
              {song.title}
            </h2>
            <p className="text-white/90">{song.about}</p>
            {song.ref && (
              <Link href={refHref(song.ref)} className="text-sm font-bold underline">
                Inspired by {song.ref}
              </Link>
            )}
          </div>
          <button type="button" onClick={() => toggleFavorite(`song:${song.id}`)} aria-pressed={fav} aria-label={fav ? "Remove from favourites" : "Add to favourites"} className="tap-target flex items-center justify-center rounded-full bg-white/20">
            <Heart className={fav ? "fill-white" : ""} aria-hidden />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={toggle} className="btn-toy bg-sun text-ink" data-testid="song-play">
              {playing ? <Pause aria-hidden /> : <Play aria-hidden />} {playing ? "Stop" : "Play"}
            </button>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Volume1 size={18} aria-hidden />
              <input type="range" min={0} max={1} step={0.1} value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume" className="w-32" />
              <Volume2 size={18} aria-hidden />
            </label>
          </div>
          <ol className="space-y-2" aria-label="Lyrics">
            {song.lines.map((l, i) => (
              <li key={i} className={`rounded-2xl px-4 py-2 font-display text-xl transition md:text-2xl ${line === i ? "scale-[1.02] bg-sun font-bold text-ink" : "text-ink-soft"}`} aria-current={line === i}>
                {l.words}
              </li>
            ))}
          </ol>
          <p className="text-xs text-ink-soft">
            {song.audio ? "Recorded version." : "Studio recordings coming later. For now the melody plays on a gentle built-in piano, and you sing the words!"} Lyrics are original to Kingdom Quest Academy.
          </p>
        </div>
      </section>
    </div>
  );
}
