import type { AgeLevel } from "@/lib/curriculum/types";

export interface GameResult {
  won: boolean;
  /** game-specific score, higher is better */
  score: number;
  /** e.g. the books-order mode that was completed */
  mode?: string;
  /** a short educational summary shown on the completion screen */
  message?: string;
}

export interface GameProps {
  level: AgeLevel;
  paused: boolean;
  /** optional timers default from settings; games must work with timers off */
  timers: boolean;
  onFinish: (r: GameResult) => void;
}
