import type { MemoryCard, Player, Theme } from '../types/game';

/**
 * Stores the shared state of the currently active game session.
 */
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

/**
 * Invalidates pending callbacks from previous game sessions.
 */
export function invalidateSession(): void {
  state.session++;
}

/**
 * Schedules a callback that runs only if the game session is still active.
 *
 * @param callback - The function to execute after the specified delay.
 * @param delay - The delay in milliseconds before executing the callback.
 */
export function scheduleForSession(callback: () => void, delay: number): void {
  const session = state.session;
  window.setTimeout(() => {
    if (session === state.session) callback();
  }, delay);
}