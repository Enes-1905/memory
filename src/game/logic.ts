import { codeCards, gamingCards } from '../utils/assets';
import { dom } from '../ui/dom';
import { getBoardSize, getStartingPlayer, getTheme } from '../ui/settings';
import { resetExitModal, updateExitIcons } from '../ui/exitModal';
import { hideResultScreens, showGameOver, updateScoreboard } from '../ui/screens';
import { createCards, markPairMatched, renderBoard, updateCard } from './cards';
import { invalidateSession, scheduleForSession, state } from './state';

/**
 * Starts a new memory game using the selected settings.
 */
export function startGame(): void {
  if (!dom.settings || !dom.game || !dom.board) return;
  applyGameSettings();
  if (!prepareGameCards()) return;
  resetScoresAndCards();
  resetExitModal();
  hideResultScreens();
  if (dom.gameOver) dom.gameOver.hidden = true;
  dom.settings.hidden = true;
  dom.game.hidden = false;
  window.scrollTo(0, 0);
}

/**
 * Applies the selected theme and starting player to the game state.
 */
function applyGameSettings(): void {
  state.theme = getTheme();
  state.player = getStartingPlayer();
  const gaming = state.theme === 'gaming';
  dom.game?.classList.toggle('game--gaming', gaming);
  updateExitIcons();
}

/**
 * Creates a shuffled deck of memory cards for the selected board size.
 * Displays an alert if there are not enough card images available.
 *
 * @returns True if the cards were created successfully, otherwise false.
 */
function prepareGameCards(): boolean {
  const images = state.theme === 'gaming' ? gamingCards : codeCards;
  invalidateSession();
  state.cards = createCards(images, getBoardSize());
  if (state.cards.length) return true;
  alert('Für diese Spielfeldgröße fehlen Kartenmotive.');
  return false;
}

/**
 * Resets player scores and card states before rendering a new board.
 */
function resetScoresAndCards(): void {
  state.scores.blue = 0;
  state.scores.orange = 0;
  state.flipped = [];
  state.checking = false;
  updateScoreboard();
  renderBoard(flipCard);
}

/**
 * Reveals the selected card and checks whether two cards are flipped.
 *
 * @param index - The index of the card selected by the player.
 */
function flipCard(index: number): void {
  if (!canFlip(index)) return;
  state.flipped.push(index);
  updateCard(index, true);
  if (state.flipped.length !== 2) return;
  checkPair();
}

/**
 * Checks whether a selected card is allowed to be revealed.
 *
 * @param index - The index of the card to validate.
 * @returns True if the card can be flipped, otherwise false.
 */
function canFlip(index: number): boolean {
  if (state.checking || (dom.exitModal && !dom.exitModal.hidden)) return false;
  const card = state.cards[index];
  if (!card || card.matched || state.flipped.includes(index)) return false;
  return state.flipped.length < 2;
}

/**
 * Compares the two flipped cards and handles a match or mismatch.
 */
function checkPair(): void {
  const [first, second] = state.flipped;
  if (state.cards[first].pairId === state.cards[second].pairId) {
    resolveMatch(first, second);
  } else {
    state.checking = true;
    scheduleForSession(() => resolveMismatch(first, second), 1000);
  }
}

/**
 * Marks a matching pair, awards a point, and checks for game completion.
 *
 * @param first - The index of the first matching card.
 * @param second - The index of the second matching card.
 */
function resolveMatch(first: number, second: number): void {
  state.cards[first].matched = true;
  state.cards[second].matched = true;
  markPairMatched(first, second);
  state.scores[state.player]++;
  updateScoreboard();
  state.flipped = [];
  if (state.cards.every((card) => card.matched)) {
    state.checking = true;
    scheduleForSession(showGameOver, 300);
  }
}

/**
 * Hides two unmatched cards and switches to the other player.
 *
 * @param first - The index of the first unmatched card.
 * @param second - The index of the second unmatched card.
 */
function resolveMismatch(first: number, second: number): void {
  updateCard(first, false);
  updateCard(second, false);
  state.flipped = [];
  state.checking = false;
  state.player = state.player === 'blue' ? 'orange' : 'blue';
  updateScoreboard();
}