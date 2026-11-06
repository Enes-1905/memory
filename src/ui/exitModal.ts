import { assetUrl } from '../utils/assets';
import { invalidateSession, state } from '../game/state';
import { dom } from './dom';
import { updateSettingsSummary } from './settings';

const EXIT_ANIMATION_DURATION = 450;
let exitAnimationTimeout: number | undefined;

/**
 * Updates the exit controls and their icons to match the selected theme.
 */
export function updateExitIcons(): void {
  const gaming = state.theme === 'gaming';
  dom.exitModal?.classList.toggle('exit-modal--gaming', gaming);
  updateExitButtonIcon();
  updateBackToGameIcon();
  const confirm = dom.confirmExit?.querySelector<HTMLImageElement>('img');
  if (confirm) confirm.src = assetUrl(gaming ? '/src/assets/game theme.svg' : '/src/assets/exit.svg');
}

/**
 * Updates the exit button icon based on the selected theme and hover state.
 *
 * @param hovered - Whether the mouse is currently hovering over the exit button.
 */
function updateExitButtonIcon(hovered = false): void {
  const icon = dom.exitButton?.querySelector<HTMLImageElement>('img');
  if (!icon) return;
  const path = state.theme !== 'gaming' ? '/src/assets/secondary button.svg'
    : hovered ? '/src/assets/Propertyexit.svg' : '/src/assets/gametheme.svg';
  icon.src = assetUrl(path);
}

/**
 * Updates the back-to-game button icon for the selected theme.
 * Removes the gaming hover image when switching to the code theme.
 */
function updateBackToGameIcon(): void {
  const button = dom.backToGame;
  const icon = button?.querySelector<HTMLImageElement>('img:not(.exit-modal__back-hover)');
  if (!button || !icon) return;
  if (state.theme === 'gaming') configureGamingBackIcon(button, icon);
  else {
    icon.className = '';
    icon.src = assetUrl('/src/assets/back1.svg');
    button.querySelector('.exit-modal__back-hover')?.remove();
  }
}

/**
 * Configures the default and hover images of the gaming back button.
 * Creates the hover image element if it does not already exist.
 *
 * @param button - The back-to-game button element.
 * @param icon - The default image element inside the button.
 */
function configureGamingBackIcon(button: HTMLButtonElement, icon: HTMLImageElement): void {
  icon.className = 'exit-modal__back-default';
  icon.src = assetUrl('/src/assets/Propertyback.svg');
  let hover = button.querySelector<HTMLImageElement>('.exit-modal__back-hover');
  if (!hover) {
    hover = document.createElement('img');
    hover.className = 'exit-modal__back-hover';
    hover.alt = '';
    hover.setAttribute('aria-hidden', 'true');
    button.appendChild(hover);
  }
  hover.src = assetUrl('/src/assets/Propertybackgame.svg');
}

/**
 * Opens the exit confirmation modal with its entrance animation.
 * Moves keyboard focus to the back-to-game button.
 */
function openExitModal(): void {
  if (!dom.exitModal || !dom.exitModal.hidden) return;
  window.clearTimeout(exitAnimationTimeout);
  dom.exitModal.classList.remove('is-leaving');
  dom.exitModal.classList.add('is-entering');
  dom.exitModal.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => dom.exitModal?.classList.remove('is-entering')));
  dom.backToGame?.focus();
}

/**
 * Closes the exit confirmation modal with an animation.
 * Optionally returns the player to the settings screen.
 *
 * @param leaveGame - Whether to leave the current game after closing the modal.
 */
export function closeExitModal(leaveGame: boolean): void {
  if (!dom.exitModal || dom.exitModal.hidden) return;
  window.clearTimeout(exitAnimationTimeout);
  dom.exitModal.classList.remove('is-entering');
  dom.exitModal.classList.add('is-leaving');
  exitAnimationTimeout = window.setTimeout(() => finishClosingModal(leaveGame), EXIT_ANIMATION_DURATION);
}

/**
 * Completes the modal closing process after the exit animation.
 *
 * @param leaveGame - Whether to return to settings or continue the current game.
 */
function finishClosingModal(leaveGame: boolean): void {
  if (!dom.exitModal) return;
  dom.exitModal.hidden = true;
  dom.exitModal.classList.remove('is-leaving');
  if (leaveGame) returnToSettings();
  else dom.exitButton?.focus();
}

/**
 * Leaves the current game and returns to the settings screen.
 * Invalidates pending callbacks from the previous game session.
 */
function returnToSettings(): void {
  if (!dom.settings || !dom.game) return;
  invalidateSession();
  dom.game.hidden = true;
  dom.settings.hidden = false;
  updateSettingsSummary();
  window.scrollTo(0, 0);
}

/**
 * Resets the exit modal to its initial hidden state.
 * Cancels any pending exit animation timeout.
 */
export function resetExitModal(): void {
  window.clearTimeout(exitAnimationTimeout);
  if (!dom.exitModal) return;
  dom.exitModal.hidden = true;
  dom.exitModal.classList.remove('is-entering', 'is-leaving');
}

/**
 * Registers event listeners for the exit modal controls.
 * Handles button clicks, hover effects, and the Escape key.
 */
export function initExitModal(): void {
  dom.exitButton?.addEventListener('click', openExitModal);
  dom.exitButton?.addEventListener('mouseenter', () => updateExitButtonIcon(true));
  dom.exitButton?.addEventListener('mouseleave', () => updateExitButtonIcon());
  dom.backToGame?.addEventListener('click', () => closeExitModal(false));
  dom.confirmExit?.addEventListener('click', () => closeExitModal(true));
  document.addEventListener('keydown', onEscape);
}

/**
 * Closes the exit confirmation modal when the Escape key is pressed.
 *
 * @param event - The keyboard event triggered by the user.
 */
function onEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && dom.exitModal && !dom.exitModal.hidden) closeExitModal(false);
}