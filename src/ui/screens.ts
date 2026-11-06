import { assetUrl, playerIcons } from '../utils/assets';
import { dom } from './dom';
import { invalidateSession, scheduleForSession, state } from '../game/state';

/**
 * Updates the scoreboard values and player icons for the selected theme.
 */
export function updateScoreboard(): void {
  if (dom.blueScore) dom.blueScore.textContent = String(state.scores.blue);
  if (dom.orangeScore) dom.orangeScore.textContent = String(state.scores.orange);
  setImage('.game__score-icon--blue', playerIcons[state.theme].blue);
  setImage('.game__score-icon--orange', playerIcons[state.theme].orange);
  updateCurrentPlayerIcon();
}

/**
 * Updates the source of an image element found in the document.
 *
 * @param selector - The CSS selector used to find the image element.
 * @param url - The URL of the image to display.
 */
function setImage(selector: string, url: string): void {
  const image = document.querySelector<HTMLImageElement>(selector);
  if (image) image.src = url;
}

/**
 * Updates the icon and accessibility label of the current player.
 */
function updateCurrentPlayerIcon(): void {
  const icon = dom.currentIcon;
  if (!icon) return;
  const gaming = state.theme === 'gaming';
  icon.classList.toggle('game__current-icon--blue', gaming && state.player === 'blue');
  icon.classList.toggle('game__current-icon--orange', gaming && state.player === 'orange');
  icon.src = playerIcons[state.theme][state.player];
  icon.alt = state.player === 'blue' ? 'Blue' : 'Orange';
}

/**
 * Displays the final scores before showing the winner or draw screen.
 */
export function showGameOver(): void {
  if (!dom.game || !dom.gameOver) return;
  if (dom.finalBlueScore) dom.finalBlueScore.textContent = String(state.scores.blue);
  if (dom.finalOrangeScore) dom.finalOrangeScore.textContent = String(state.scores.orange);
  updateGameOverGraphics();
  dom.game.hidden = true;
  dom.gameOver.hidden = false;
  window.scrollTo(0, 0);
  scheduleForSession(showResult, 3000);
}

/**
 * Updates the game-over title and score icons based on the selected theme.
 */
function updateGameOverGraphics(): void {
  const screen = dom.gameOver;
  if (!screen) return;
  const gaming = state.theme === 'gaming';
  screen.classList.toggle('game-over--gaming', gaming);
  setImage('.game-over__title', assetUrl(gaming ? '/src/assets/GAME OVER (1).svg' : '/src/assets/game over.svg'));
  setImage('.game-over__score--blue img', playerIcons[state.theme].blue);
  setImage('.game-over__score--orange img', playerIcons[state.theme].orange);
}

/**
 * Determines whether the game ended with a winner or a draw.
 * Displays the corresponding result screen.
 */
function showResult(): void {
  if (state.scores.blue === state.scores.orange) showDraw();
  else showWinner();
}

/**
 * Displays the winner screen using the selected visual theme.
 */
function showWinner(): void {
  if (!dom.gameOver || !dom.winner || !dom.winnerName || !dom.winnerPlayer) return;
  const gaming = state.theme === 'gaming';
  dom.winner.classList.toggle('winner--gaming', gaming);
  updateWinnerGraphics();
  dom.winnerPlayer.hidden = false;
  dom.gameOver.hidden = true;
  revealScreen(dom.winner, 'winner--visible');
}

/**
 * Updates the winner name, player image, and home button icon.
 */
function updateWinnerGraphics(): void {
  if (!dom.winnerName || !dom.winnerPlayer) return;
  const winner = state.scores.blue > state.scores.orange ? 'blue' : 'orange';
  const gaming = state.theme === 'gaming';
  dom.winnerName.textContent = `${winner.toUpperCase()} PLAYER`;
  dom.winnerName.className = `winner__name winner__name--${winner}`;
  dom.winnerPlayer.src = assetUrl(gaming ? '/src/assets/pockal 1.svg' : `/src/assets/${winner}player.svg`);
  dom.winnerPlayer.alt = gaming ? 'Winner trophy' : `${winner === 'blue' ? 'Blue' : 'Orange'} player`;
  setImage('.winner__back img', assetUrl(gaming ? '/src/assets/home.svg' : '/src/assets/backtostart.svg'));
}

/**
 * Displays the draw screen using the selected visual theme.
 */
function showDraw(): void {
  if (!dom.gameOver || !dom.draw) return;
  dom.draw.classList.toggle('draw--gaming', state.theme === 'gaming');
  dom.gameOver.hidden = true;
  revealScreen(dom.draw, 'draw--visible');
}

/**
 * Reveals a result screen using its existing CSS transition.
 *
 * @param screen - The HTML element representing the result screen.
 * @param visibleClass - The CSS class that triggers the screen's entrance animation.
 */
function revealScreen(screen: HTMLElement, visibleClass: string): void {
  screen.classList.remove(visibleClass);
  screen.hidden = false;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => requestAnimationFrame(() => screen.classList.add(visibleClass)));
}

/**
 * Returns to the home screen and invalidates the current game session.
 */
export function backToStart(): void {
  if (!dom.home || !dom.settings || !dom.game || !dom.gameOver) return;
  invalidateSession();
  hideResultScreens();
  dom.gameOver.hidden = true;
  dom.game.hidden = true;
  dom.settings.hidden = true;
  dom.home.hidden = false;
  window.scrollTo(0, 0);
}

/**
 * Hides both result screens and removes their animation classes.
 */
export function hideResultScreens(): void {
  if (dom.winner) {
    dom.winner.hidden = true;
    dom.winner.classList.remove('winner--visible');
  }
  if (dom.draw) {
    dom.draw.hidden = true;
    dom.draw.classList.remove('draw--visible');
  }
}

/**
 * Registers click event listeners for returning home from result screens.
 */
export function initResultNavigation(): void {
  dom.winnerBack?.addEventListener('click', backToStart);
  dom.drawBack?.addEventListener('click', backToStart);
}