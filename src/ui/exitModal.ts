import { assetUrl } from '../utils/assets';
import { invalidateSession, state } from '../game/state';
import { dom } from './dom';
import { updateSettingsSummary } from './settings';

const EXIT_ANIMATION_DURATION = 450;
let exitAnimationTimeout: number | undefined;

/** Updates exit controls to match the selected theme. */
export function updateExitIcons(): void {
  const gaming = state.theme === 'gaming';
  dom.exitModal?.classList.toggle('exit-modal--gaming', gaming);
  updateExitButtonIcon();
  updateBackToGameIcon();
  const confirm = dom.confirmExit?.querySelector<HTMLImageElement>('img');
  if (confirm) confirm.src = assetUrl(gaming ? '/src/game theme.svg' : '/src/assets/exit.svg');
}

/** Switches the exit button image, including its hover variant. */
function updateExitButtonIcon(hovered = false): void {
  const icon = dom.exitButton?.querySelector<HTMLImageElement>('img');
  if (!icon) return;
  const path = state.theme !== 'gaming' ? '/src/assets/secondary button.svg'
    : hovered ? '/src/assets/Propertyexit.svg' : '/src/assets/gametheme.svg';
  icon.src = assetUrl(path);
}

/** Updates the back button and its optional gaming hover image. */
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

/** Creates or reuses the gaming back button hover image. */
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

/** Opens the animated exit confirmation modal. */
function openExitModal(): void {
  if (!dom.exitModal || !dom.exitModal.hidden) return;
  window.clearTimeout(exitAnimationTimeout);
  dom.exitModal.classList.remove('is-leaving');
  dom.exitModal.classList.add('is-entering');
  dom.exitModal.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => dom.exitModal?.classList.remove('is-entering')));
  dom.backToGame?.focus();
}

/** Closes the exit confirmation modal and optionally exits the game. */
export function closeExitModal(leaveGame: boolean): void {
  if (!dom.exitModal || dom.exitModal.hidden) return;
  window.clearTimeout(exitAnimationTimeout);
  dom.exitModal.classList.remove('is-entering');
  dom.exitModal.classList.add('is-leaving');
  exitAnimationTimeout = window.setTimeout(() => finishClosingModal(leaveGame), EXIT_ANIMATION_DURATION);
}

/** Completes the exit transition after its CSS animation. */
function finishClosingModal(leaveGame: boolean): void {
  if (!dom.exitModal) return;
  dom.exitModal.hidden = true;
  dom.exitModal.classList.remove('is-leaving');
  if (leaveGame) returnToSettings();
  else dom.exitButton?.focus();
}

/** Returns from the active game to its settings screen. */
function returnToSettings(): void {
  if (!dom.settings || !dom.game) return;
  invalidateSession();
  dom.game.hidden = true;
  dom.settings.hidden = false;
  updateSettingsSummary();
  window.scrollTo(0, 0);
}

/** Resets the exit modal before starting another game. */
export function resetExitModal(): void {
  window.clearTimeout(exitAnimationTimeout);
  if (!dom.exitModal) return;
  dom.exitModal.hidden = true;
  dom.exitModal.classList.remove('is-entering', 'is-leaving');
}

/** Registers exit, return, hover, and Escape interactions. */
export function initExitModal(): void {
  dom.exitButton?.addEventListener('click', openExitModal);
  dom.exitButton?.addEventListener('mouseenter', () => updateExitButtonIcon(true));
  dom.exitButton?.addEventListener('mouseleave', () => updateExitButtonIcon());
  dom.backToGame?.addEventListener('click', () => closeExitModal(false));
  dom.confirmExit?.addEventListener('click', () => closeExitModal(true));
  document.addEventListener('keydown', onEscape);
}

/** Closes the open exit modal when Escape is pressed. */
function onEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && dom.exitModal && !dom.exitModal.hidden) closeExitModal(false);
}
