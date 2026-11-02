import { codeCards, gamingCards } from '../utils/assets';
import { dom } from '../ui/dom';
import { getBoardSize, getStartingPlayer, getTheme } from '../ui/settings';
import { resetExitModal, updateExitIcons } from '../ui/exitModal';
import { hideResultScreens, showGameOver, updateScoreboard } from '../ui/screens';
import { createCards, markPairMatched, renderBoard, updateCard } from './cards';
import { invalidateSession, scheduleForSession, state } from './state';

/** Starts a game with the selected settings. */
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

/** Applies the selected theme and starting player. */
function applyGameSettings(): void {
  state.theme = getTheme();
  state.player = getStartingPlayer();
  const gaming = state.theme === 'gaming';
  dom.game?.classList.toggle('game--gaming', gaming);
  updateExitIcons();
}

/** Creates a shuffled deck and reports missing card images. */
function prepareGameCards(): boolean {
  const images = state.theme === 'gaming' ? gamingCards : codeCards;
  invalidateSession();
  state.cards = createCards(images, getBoardSize());
  if (state.cards.length) return true;
  alert('Für diese Spielfeldgröße fehlen Kartenmotive.');
  return false;
}

/** Clears the previous game state and renders the new board. */
function resetScoresAndCards(): void {
  state.scores.blue = 0;
  state.scores.orange = 0;
  state.flipped = [];
  state.checking = false;
  updateScoreboard();
  renderBoard(flipCard);
}

/** Reveals a card and checks whether a pair was selected. */
function flipCard(index: number): void {
  if (!canFlip(index)) return;
  state.flipped.push(index);
  updateCard(index, true);
  if (state.flipped.length !== 2) return;
  checkPair();
}

/** Validates whether the chosen card may be revealed. */
function canFlip(index: number): boolean {
  if (state.checking || (dom.exitModal && !dom.exitModal.hidden)) return false;
  const card = state.cards[index];
  if (!card || card.matched || state.flipped.includes(index)) return false;
  return state.flipped.length < 2;
}

/** Resolves the two selected cards as a match or mismatch. */
function checkPair(): void {
  const [first, second] = state.flipped;
  if (state.cards[first].pairId === state.cards[second].pairId) {
    resolveMatch(first, second);
  } else {
    state.checking = true;
    scheduleForSession(() => resolveMismatch(first, second), 1000);
  }
}

/** Awards a point and checks whether the game is finished. */
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

/** Turns unmatched cards back and switches the active player. */
function resolveMismatch(first: number, second: number): void {
  updateCard(first, false);
  updateCard(second, false);
  state.flipped = [];
  state.checking = false;
  state.player = state.player === 'blue' ? 'orange' : 'blue';
  updateScoreboard();
}
