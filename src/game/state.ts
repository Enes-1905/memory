import type { MemoryCard, Player, Theme } from '../types/game';

/** Shared state for the currently active game session. */
export const state: {
  cards: MemoryCard[];
  flipped: number[];
  player: Player;
  theme: Theme;
  scores: Record<Player, number>;
  checking: boolean;
  session: number;
} = {
  cards: [], flipped: [], player: 'blue', theme: 'code',
  scores: { blue: 0, orange: 0 }, checking: false, session: 0,
};

/** Invalidates pending card and screen transition callbacks. */
export function invalidateSession(): void {
  state.session++;
}

/** Runs a callback only if the active game has not changed. */
export function scheduleForSession(callback: () => void, delay: number): void {
  const session = state.session;
  window.setTimeout(() => {
    if (session === state.session) callback();
  }, delay);
}
