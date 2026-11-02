import { assetUrl, playerIcons } from '../utils/assets';
import { dom } from './dom';
import { invalidateSession, scheduleForSession, state } from '../game/state';

/** Updates score values and theme-specific player icons. */
export function updateScoreboard(): void {
  if (dom.blueScore) dom.blueScore.textContent = String(state.scores.blue);
  if (dom.orangeScore) dom.orangeScore.textContent = String(state.scores.orange);
  setImage('.game__score-icon--blue', playerIcons[state.theme].blue);
  setImage('.game__score-icon--orange', playerIcons[state.theme].orange);
  updateCurrentPlayerIcon();
}

/** Updates a single image found by its selector. */
function setImage(selector: string, url: string): void {
  const image = document.querySelector<HTMLImageElement>(selector);
  if (image) image.src = url;
}

/** Displays the icon and accessibility label of the current player. */
function updateCurrentPlayerIcon(): void {
  const icon = dom.currentIcon;
  if (!icon) return;
  const gaming = state.theme === 'gaming';
  icon.classList.toggle('game__current-icon--blue', gaming && state.player === 'blue');
  icon.classList.toggle('game__current-icon--orange', gaming && state.player === 'orange');
  icon.src = playerIcons[state.theme][state.player];
  icon.alt = state.player === 'blue' ? 'Blue' : 'Orange';
}

/** Shows final scores before displaying the winner or a draw. */
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

/** Sets the correct game-over title and score icons. */
function updateGameOverGraphics(): void {
  const screen = dom.gameOver;
  if (!screen) return;
  const gaming = state.theme === 'gaming';
  screen.classList.toggle('game-over--gaming', gaming);
  setImage('.game-over__title', assetUrl(gaming ? '/src/assets/GAME OVER (1).svg' : '/src/assets/game over.svg'));
  setImage('.game-over__score--blue img', playerIcons[state.theme].blue);
  setImage('.game-over__score--orange img', playerIcons[state.theme].orange);
}

/** Chooses the result screen after the game-over delay. */
function showResult(): void {
  if (state.scores.blue === state.scores.orange) showDraw();
  else showWinner();
}

/** Displays the winner screen using the active theme. */
function showWinner(): void {
  if (!dom.gameOver || !dom.winner || !dom.winnerName || !dom.winnerPlayer) return;
  const gaming = state.theme === 'gaming';
  dom.winner.classList.toggle('winner--gaming', gaming);
  updateWinnerGraphics();
  dom.winnerPlayer.hidden = false;
  dom.gameOver.hidden = true;
  revealScreen(dom.winner, 'winner--visible');
}

/** Selects the winner name, picture, and home button. */
function updateWinnerGraphics(): void {
  if (!dom.winnerName || !dom.winnerPlayer) return;
  const winner = state.scores.blue > state.scores.orange ? 'blue' : 'orange';
  const gaming = state.theme === 'gaming';
  dom.winnerName.textContent = `${winner.toUpperCase()} PLAYER`;
  dom.winnerName.className = `winner__name winner__name--${winner}`;
  dom.winnerPlayer.src = assetUrl(gaming ? '/src/pockal 1.svg' : `/src/assets/${winner}player.svg`);
  dom.winnerPlayer.alt = gaming ? 'Winner trophy' : `${winner === 'blue' ? 'Blue' : 'Orange'} player`;
  setImage('.winner__back img', assetUrl(gaming ? '/src/home.svg' : '/src/assets/backtostart.svg'));
}

/** Displays the draw screen using the active theme. */
function showDraw(): void {
  if (!dom.gameOver || !dom.draw) return;
  dom.draw.classList.toggle('draw--gaming', state.theme === 'gaming');
  dom.gameOver.hidden = true;
  revealScreen(dom.draw, 'draw--visible');
}

/** Reveals a result screen with its existing CSS transition. */
function revealScreen(screen: HTMLElement, visibleClass: string): void {
  screen.classList.remove(visibleClass);
  screen.hidden = false;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => requestAnimationFrame(() => screen.classList.add(visibleClass)));
}

/** Hides result screens and returns to the home screen. */
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

/** Resets visibility and animation classes on both result screens. */
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

/** Registers the home navigation buttons on result screens. */
export function initResultNavigation(): void {
  dom.winnerBack?.addEventListener('click', backToStart);
  dom.drawBack?.addEventListener('click', backToStart);
}
