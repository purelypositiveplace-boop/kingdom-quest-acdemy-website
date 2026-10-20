"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { PRINTABLE_BY_ID } from "@/data/printables";
import { PAPER, PrintableLayout, type PaperSize } from "./PrintableLayout";
import { CREATION_DAYS } from "@/components/games/list/CreationSort";
import { SceneArt } from "@/components/bible/SceneArt";
import { AnimalArt, ANIMAL_FACTS, type AnimalKind } from "@/components/games/AnimalArt";
import { generateMaze, solveMaze } from "@/lib/games/maze";
import { generateWordSearch, WORD_LISTS } from "@/lib/games/wordsearch";
import { buildCrossword, CROSSWORD_SETS } from "@/lib/games/crossword";
import { MEMORY_VERSES } from "@/data/verses/memory-verses";
import { getVerseText } from "@/components/ui/ScriptureText";
import { BOOKS } from "@/data/bible/books";
import { LESSONS, getLesson } from "@/lib/curriculum";
import { mulberry32, shuffle } from "@/lib/games/random";
import { Mascot } from "@/components/characters/Mascot";
import { useKQ } from "@/lib/progress/store";
import { ACHIEVEMENTS } from "@/data/achievements";

/** Renders a printable with a paper-size picker and a print button. Uses the browser's print/PDF. */
export function PrintableView({ id }: { id: string }) {
  const info = PRINTABLE_BY_ID[id];
  const [paper, setPaper] = useState<PaperSize>("letter");
  const [lessonId, setLessonId] = useState("creation");
  const [verseRef, setVerseRef] = useState(MEMORY_VERSES[0].ref);
  const [answers, setAnswers] = useState(false);
  return (
    <div className="px-4 py-6 print:p-0">
      <style>{`@media print { @page { size: ${PAPER[paper].css}; margin: 0; } }`}</style>
      <div className="no-print mx-auto mb-6 max-w-4xl space-y-4">
        <Link href="/printables" className="inline-flex min-h-11 items-center gap-1 font-bold text-royal underline">
          <ArrowLeft size={18} aria-hidden /> All printables
        </Link>
        <div className="card flex flex-wrap items-center gap-3 p-4">
          <h1 className="mr-auto text-2xl font-bold text-royal-dark">{info.title}</h1>
          <label className="flex items-center gap-2 font-semibold">
            Paper
            <select value={paper} onChange={(e) => setPaper(e.target.value as PaperSize)} className="min-h-11 rounded-full border-2 border-royal-soft px-3">
              <option value="letter">US Letter</option>
              <option value="a4">A4</option>
            </select>
          </label>
          {info.perLesson && (
            <label className="flex items-center gap-2 font-semibold">
              Lesson
              <select value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="min-h-11 max-w-56 rounded-full border-2 border-royal-soft px-3">
                {LESSONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          {id === "verse-copywork" && (
            <label className="flex items-center gap-2 font-semibold">
              Verse
              <select value={verseRef} onChange={(e) => setVerseRef(e.target.value)} className="min-h-11 rounded-full border-2 border-royal-soft px-3">
                {MEMORY_VERSES.map((v) => (
                  <option key={v.ref}>{v.ref}</option>
                ))}
              </select>
            </label>
          )}
          {["birth-wordsearch", "bible-crossword", "david-maze"].includes(id) && (
            <label className="flex min-h-11 items-center gap-2 font-semibold">
              <input type="checkbox" checked={answers} onChange={(e) => setAnswers(e.target.checked)} className="h-5 w-5" /> Answer key page
            </label>
          )}
          <button type="button" onClick={() => window.print()} className="btn-toy bg-royal text-white" data-testid="print-button">
            <Printer aria-hidden /> Print
          </button>
        </div>
        <p className="text-sm text-ink-soft">Tip: to save a PDF, choose &quot;Save as PDF&quot; in the print window. Turn off headers and footers for the cleanest page.</p>
      </div>
      <div className="space-y-8 print:space-y-0" data-testid="printable-sheet">
        <Template id={id} paper={paper} lessonId={lessonId} verseRef={verseRef} answers={answers} />
      </div>
    </div>
  );
}

function Template({ id, paper, lessonId, verseRef, answers }: { id: string; paper: PaperSize; lessonId: string; verseRef: string; answers: boolean }) {
  switch (id) {
    case "creation-sequencing":
      return <CreationSequencing paper={paper} />;
    case "noah-matching":
      return <NoahMatching paper={paper} />;
    case "david-maze":
      return <DavidMaze paper={paper} answers={answers} />;
    case "birth-wordsearch":
      return <BirthWordSearch paper={paper} answers={answers} />;
    case "fruit-worksheet":
      return <FruitWorksheet paper={paper} />;
    case "bible-crossword":
      return <CrosswordSheet paper={paper} answers={answers} />;
    case "verse-cards":
      return <VerseCards paper={paper} />;
    case "books-flashcards":
      return <BookFlashcards paper={paper} />;
    case "story-sequencing":
      return <StorySequencing paper={paper} lessonId={lessonId} />;
    case "verse-copywork":
      return <Copywork paper={paper} verseRef={verseRef} />;
    case "family-discussion":
      return <FamilySheet paper={paper} lessonId={lessonId} />;
    case "coloring-leo":
      return <Coloring paper={paper} mascot="leo" verse="Joshua 1:9" />;
    case "coloring-grace":
      return <Coloring paper={paper} mascot="grace" verse="1 Peter 5:7" />;
    case "certificate":
      return <Certificate paper={paper} />;
    default:
      return null;
  }
}

const Lines = ({ n = 2 }: { n?: number }) => (
  <div className="space-y-5 pt-3">
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="border-b-2 border-dashed border-black/40" />
    ))}
  </div>
);

function CreationSequencing({ paper }: { paper: PaperSize }) {
  const cards = useMemo(() => shuffle(CREATION_DAYS, mulberry32(3)), []);
  return (
    <PrintableLayout paper={paper} title="The Seven Days of Creation" subtitle="Genesis 1:1–2:3 · Cut out the pictures and glue them in the right order.">
      <div className="grid grid-cols-4 gap-2">
        {CREATION_DAYS.map((d) => (
          <div key={d.day} className="flex h-28 flex-col rounded-lg border-2 border-black">
            <span className="border-b-2 border-black px-2 font-display font-bold">Day {d.day}</span>
            <span className="flex-1" />
          </div>
        ))}
      </div>
      <p className="my-3 text-center text-sm">✂ - - - - - - - - - - - cut along the dashed lines - - - - - - - - - - -</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c) => (
          <div key={c.day} className="overflow-hidden rounded-lg border-2 border-dashed border-black">
            <SceneArt theme={c.theme} props={c.props} alt={c.label} className="h-20 w-full" />
            <p className="p-1 text-center text-sm font-bold">{c.label}</p>
          </div>
        ))}
      </div>
    </PrintableLayout>
  );
}

const NOAH_KINDS: AnimalKind[] = ["lion", "elephant", "giraffe", "sheep", "rabbit", "zebra"];
function NoahMatching({ paper }: { paper: PaperSize }) {
  const kinds = NOAH_KINDS;
  const right = useMemo(() => shuffle(NOAH_KINDS, mulberry32(5)), []);
  return (
    <PrintableLayout paper={paper} title="Two by Two!" subtitle="Genesis 7:9 · Draw a line to match each animal with its partner.">
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-y-3">
        {kinds.map((k, i) => (
          <div key={k} className="contents">
            <div className="flex items-center gap-2">
              <AnimalArt kind={k} size={70} />
              <span className="text-sm font-bold">{ANIMAL_FACTS[k].name}</span>
              <span className="ml-auto h-3 w-3 rounded-full bg-black" />
            </div>
            <div />
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-black" />
              <AnimalArt kind={right[i]} size={70} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center font-display text-lg">God kept Noah, his family and the animals safe in the ark.</p>
    </PrintableLayout>
  );
}

function DavidMaze({ paper, answers }: { paper: PaperSize; answers: boolean }) {
  const maze = useMemo(() => generateMaze(12, 14, 17), []);
  const cell = 40;
  const draw = (showPath: boolean) => (
    <svg viewBox={`-10 -10 ${maze.w * cell + 20} ${maze.h * cell + 20}`} className="mx-auto w-[85%]">
      {maze.walls.map((row, y) =>
        row.map(([t, r, b, l], x) => (
          <g key={`${x}-${y}`} stroke="#000" strokeWidth="3" strokeLinecap="round">
            {t && !(x === 0 && y === 0) && <line x1={x * cell} y1={y * cell} x2={(x + 1) * cell} y2={y * cell} />}
            {r && <line x1={(x + 1) * cell} y1={y * cell} x2={(x + 1) * cell} y2={(y + 1) * cell} />}
            {b && !(x === maze.w - 1 && y === maze.h - 1) && <line x1={x * cell} y1={(y + 1) * cell} x2={(x + 1) * cell} y2={(y + 1) * cell} />}
            {l && <line x1={x * cell} y1={y * cell} x2={x * cell} y2={(y + 1) * cell} />}
          </g>
        )),
      )}
      {showPath && <MazePath maze={maze} cell={cell} />}
      <text x="4" y="-2" fontSize="14" fontWeight="700">START: David</text>
      <text x={maze.w * cell - 110} y={maze.h * cell + 8} fontSize="14" fontWeight="700">The stream</text>
    </svg>
  );
  return (
    <>
      <PrintableLayout paper={paper} title="David's Five Stones" subtitle="1 Samuel 17:40 · Help David reach the stream to choose five smooth stones.">
        {draw(false)}
        <p className="mt-3 text-center font-display text-lg">David said, &quot;The battle is the Lord&apos;s.&quot; Courage comes from trusting God!</p>
        <p className="text-center text-sm">Draw five smooth stones at the stream when you get there!</p>
      </PrintableLayout>
      {answers && (
        <PrintableLayout paper={paper} title="Answer key: David's Five Stones">
          {draw(true)}
        </PrintableLayout>
      )}
    </>
  );
}

function MazePath({ maze, cell }: { maze: ReturnType<typeof generateMaze>; cell: number }) {
  const path = useMemo(() => solveMaze(maze) ?? [], [maze]);
  return <polyline points={path.map(([x, y]) => `${x * cell + cell / 2},${y * cell + cell / 2}`).join(" ")} fill="none" stroke="#2a48d4" strokeWidth="6" opacity="0.6" />;
}

function BirthWordSearch({ paper, answers }: { paper: PaperSize; answers: boolean }) {
  const ws = useMemo(() => generateWordSearch(WORD_LISTS.christmas.words, 12, { diagonal: true, seed: 25 }), []);
  const found = new Set<string>();
  for (const p of ws.placements) for (let k = 0; k < p.word.length; k++) found.add(`${p.r + p.dr * k},${p.c + p.dc * k}`);
  const grid = (key: boolean) => (
    <table className="mx-auto border-collapse">
      <tbody>
        {ws.grid.map((row, r) => (
          <tr key={r}>
            {row.map((ch, c) => (
              <td key={c} className={`h-9 w-9 border border-black/30 text-center font-display text-xl font-bold ${key && found.has(`${r},${c}`) ? "bg-black/15" : ""}`}>
                {ch}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <>
      <PrintableLayout paper={paper} title="The Birth of Jesus Word Search" subtitle="Luke 2:1-20 and Matthew 2:1-12 · Words go across, down and diagonally.">
        {grid(false)}
        <div className="mt-4 grid grid-cols-3 gap-1 text-center font-display text-lg font-bold">
          {ws.placements.map((p) => (
            <span key={p.word}>☐ {p.word}</span>
          ))}
        </div>
      </PrintableLayout>
      {answers && (
        <PrintableLayout paper={paper} title="Answer key: Birth of Jesus Word Search">
          {grid(true)}
        </PrintableLayout>
      )}
    </>
  );
}

const FRUITS = ["Love", "Joy", "Peace", "Patience", "Kindness", "Goodness", "Faithfulness", "Gentleness", "Self-control"];
function FruitWorksheet({ paper }: { paper: PaperSize }) {
  return (
    <PrintableLayout paper={paper} title="The Fruit of the Spirit" subtitle="Galatians 5:22-23 · Colour each fruit. Write or draw one way you can show it this week.">
      <p className="scripture mb-3 rounded-lg border-2 border-black p-3 text-center">{getVerseText("Galatians 5:22-23")} (Galatians 5:22-23, WEB)</p>
      <div className="grid grid-cols-3 gap-3">
        {FRUITS.map((f) => (
          <div key={f} className="rounded-lg border-2 border-black p-2">
            <svg viewBox="0 0 60 60" className="mx-auto h-14 w-14" aria-hidden>
              <path d="M30 8 q4 -6 10 -4 q-4 6 -10 6" fill="none" stroke="#000" strokeWidth="2" />
              <circle cx="30" cy="34" r="20" fill="none" stroke="#000" strokeWidth="2.5" />
            </svg>
            <p className="text-center font-display font-bold">{f}</p>
            <Lines n={2} />
          </div>
        ))}
      </div>
    </PrintableLayout>
  );
}

function CrosswordSheet({ paper, answers }: { paper: PaperSize; answers: boolean }) {
  const cw = useMemo(() => buildCrossword(CROSSWORD_SETS.easy), []);
  const nums: Record<string, number> = {};
  for (const e of cw.entries) nums[`${e.row},${e.col}`] = e.number;
  const grid = (key: boolean) => (
    <div className="mx-auto inline-grid" style={{ gridTemplateColumns: `repeat(${cw.cols}, 2.2rem)` }}>
      {cw.cells.map((row, r) =>
        row.map((ch, c) => (
          <span key={`${r}-${c}`} className={`relative h-[2.2rem] w-[2.2rem] ${ch ? "border border-black" : ""}`}>
            {ch && nums[`${r},${c}`] && <span className="absolute left-0.5 top-0 text-[9px] font-bold">{nums[`${r},${c}`]}</span>}
            {ch && key && <span className="flex h-full items-center justify-center font-display font-bold">{ch}</span>}
          </span>
        )),
      )}
    </div>
  );
  return (
    <>
      <PrintableLayout paper={paper} title="Bible Crossword">
        <div className="text-center">{grid(false)}</div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          {(["across", "down"] as const).map((d) => (
            <div key={d}>
              <p className="font-display text-lg font-bold capitalize">{d}</p>
              {cw.entries
                .filter((e) => e.dir === d)
                .map((e) => (
                  <p key={e.number + d}>
                    <b>{e.number}.</b> {e.clue} ({e.answer.length})
                  </p>
                ))}
            </div>
          ))}
        </div>
      </PrintableLayout>
      {answers && (
        <PrintableLayout paper={paper} title="Answer key: Bible Crossword">
          <div className="text-center">{grid(true)}</div>
        </PrintableLayout>
      )}
    </>
  );
}

function VerseCards({ paper }: { paper: PaperSize }) {
  const pages = [MEMORY_VERSES.slice(0, 8), MEMORY_VERSES.slice(8, 16)];
  return (
    <>
      {pages.map((vs, i) => (
        <PrintableLayout key={i} paper={paper} title="Memory Verse Cards" subtitle={`Sheet ${i + 1} of ${pages.length} · Cut along the dashed lines.`}>
          <div className="grid grid-cols-2 gap-3">
            {vs.map((v) => (
              <div key={v.ref} className="flex min-h-36 flex-col justify-between rounded-lg border-2 border-dashed border-black p-3">
                <p className="scripture text-[13px] leading-snug">{getVerseText(v.ref)}</p>
                <p className="mt-2 font-display font-bold">{v.ref} (WEB)</p>
              </div>
            ))}
          </div>
        </PrintableLayout>
      ))}
    </>
  );
}

function BookFlashcards({ paper }: { paper: PaperSize }) {
  const pages = Array.from({ length: Math.ceil(BOOKS.length / 24) }, (_, i) => BOOKS.slice(i * 24, i * 24 + 24));
  return (
    <>
      {pages.map((bs, i) => (
        <PrintableLayout key={i} paper={paper} title="Books of the Bible Flashcards" subtitle={`Sheet ${i + 1} of ${pages.length}`}>
          <div className="grid grid-cols-4 gap-2">
            {bs.map((b) => (
              <div key={b.id} className="flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-black p-1 text-center">
                <span className="text-[10px]">#{BOOKS.indexOf(b) + 1}</span>
                <span className="font-display text-base font-bold leading-tight">{b.name}</span>
                <span className="text-[10px]">{b.group}</span>
              </div>
            ))}
          </div>
        </PrintableLayout>
      ))}
    </>
  );
}

function StorySequencing({ paper, lessonId }: { paper: PaperSize; lessonId: string }) {
  const l = getLesson(lessonId)!;
  const scenes = useMemo(() => shuffle(l.scenes, mulberry32(l.scenes.length * 7)), [l]);
  return (
    <PrintableLayout paper={paper} title={`${l.title}: What happened first?`} subtitle={`${l.refs[0]} · Number the pictures 1 to ${l.scenes.length} in story order.`}>
      <div className="grid grid-cols-2 gap-3">
        {scenes.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-lg border-2 border-black">
            <SceneArt theme={s.theme} props={s.props} alt={s.alt} className="h-24 w-full" />
            <div className="flex items-center gap-2 p-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black" />
              <span className="text-sm font-bold">{s.title}</span>
            </div>
          </div>
        ))}
      </div>
    </PrintableLayout>
  );
}

function Copywork({ paper, verseRef }: { paper: PaperSize; verseRef: string }) {
  const text = getVerseText(verseRef) ?? "";
  return (
    <PrintableLayout paper={paper} title="Scripture Copywork" subtitle={`${verseRef} · World English Bible`}>
      <p className="scripture rounded-lg border-2 border-black p-4 text-xl leading-relaxed">{text}</p>
      <p className="mt-4 text-sm">Copy the verse in your best handwriting:</p>
      <div className="mt-2 space-y-7">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="relative h-8 border-b-2 border-black">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-black/40" />
          </div>
        ))}
      </div>
    </PrintableLayout>
  );
}

function FamilySheet({ paper, lessonId }: { paper: PaperSize; lessonId: string }) {
  const l = getLesson(lessonId)!;
  return (
    <PrintableLayout paper={paper} title={`Family Talk: ${l.title}`} subtitle={l.refs.join(" · ")}>
      <p className="text-base">{l.summary}</p>
      <h2 className="mt-4 font-display text-xl font-bold">Three big ideas</h2>
      <ol className="list-decimal pl-6">
        {l.takeaways.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
      <h2 className="mt-4 font-display text-xl font-bold">Let&apos;s talk about it</h2>
      {[...l.parentPrompts, l.reflection].map((q) => (
        <div key={q} className="mt-2">
          <p className="font-semibold">{q}</p>
          <Lines n={2} />
        </div>
      ))}
      <h2 className="mt-4 font-display text-xl font-bold">Try this together</h2>
      <p>{l.application}</p>
      <h2 className="mt-4 font-display text-xl font-bold">Memory verse</h2>
      <p className="scripture">
        {getVerseText(l.memoryVerse)} ({l.memoryVerse}, WEB)
      </p>
      <h2 className="mt-4 font-display text-xl font-bold">A prayer you can pray</h2>
      <p className="italic">{l.prayer}</p>
    </PrintableLayout>
  );
}

function Coloring({ paper, mascot, verse }: { paper: PaperSize; mascot: "leo" | "grace"; verse: string }) {
  return (
    <PrintableLayout paper={paper} title={mascot === "leo" ? "Colour Leo the Lion!" : "Colour Grace the Dove!"} subtitle="Leo and Grace are Kingdom Quest Academy guides (not characters from the Bible).">
      <div className="flex justify-center">
        <Mascot id={mascot} size={480} outline animate="none" />
      </div>
      <p className="scripture mt-4 rounded-lg border-2 border-black p-3 text-center text-lg">
        {getVerseText(verse)} ({verse}, WEB)
      </p>
    </PrintableLayout>
  );
}

function Certificate({ paper }: { paper: PaperSize }) {
  const profile = useKQ((s) => s.profile);
  const progress = useKQ((s) => s.progress);
  const lessons = Object.keys(progress.lessons).length;
  const badges = ACHIEVEMENTS.filter((a) => progress.badges[a.id]).length;
  return (
    <PrintableLayout paper={paper} title="Certificate of Bible Learning" footer="Kingdom Quest Academy · Big faith. Big adventures. Endless discoveries.">
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border-[10px] border-double border-black p-8 text-center">
        <Mascot id="leo" size={160} outline animate="none" />
        <p className="mt-4 text-lg">This certificate is proudly given to</p>
        <p className="my-4 min-w-[60%] border-b-2 border-black pb-1 font-display text-4xl font-bold">{profile?.nickname && profile.nickname !== "Friend" ? profile.nickname : " "}</p>
        <p className="text-lg">for exploring God&apos;s Word with curiosity and courage at Kingdom Quest Academy!</p>
        <p className="mt-4 text-base">
          Bible lessons completed: <b>{lessons}</b> · Badges earned: <b>{badges}</b>
        </p>
        <div className="mt-10 grid w-full grid-cols-2 gap-10 text-sm">
          <span className="border-t-2 border-black pt-1">Signed by a grown-up</span>
          <span className="border-t-2 border-black pt-1">Date</span>
        </div>
      </div>
    </PrintableLayout>
  );
}
