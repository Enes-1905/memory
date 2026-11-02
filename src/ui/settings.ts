import type { BoardSize, Player, Theme } from '../types/game';
import { assetUrl } from '../utils/assets';
import { dom } from './dom';

/** Reads the currently selected value of a radio group. */
function selectedValue(name: string): string | undefined {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value;
}

/** Returns the selected theme, defaulting to the code theme. */
export function getTheme(): Theme {
  return selectedValue('theme') === 'gaming' ? 'gaming' : 'code';
}

/** Returns the selected player, defaulting to blue. */
export function getStartingPlayer(): Player {
  return selectedValue('player') === 'orange' ? 'orange' : 'blue';
}

/** Returns the selected supported board size. */
export function getBoardSize(): BoardSize {
  const size = Number(selectedValue('boardSize') ?? '16');
  return size === 16 || size === 24 || size === 36 ? size : 16;
}

/** Updates the selected theme, player, and board-size labels. */
export function updateSettingsSummary(): void {
  if (dom.selectedTheme) dom.selectedTheme.textContent = getTheme() === 'gaming' ? 'Gaming' : 'Code vibes';
  if (dom.selectedPlayer) dom.selectedPlayer.textContent = getStartingPlayer() === 'orange' ? 'Orange' : 'Blue';
  if (dom.selectedBoardSize) dom.selectedBoardSize.textContent = `${getBoardSize()} cards`;
}

/** Displays a preview for the supplied theme. */
export function showThemePreview(theme: string): void {
  if (!dom.preview) return;
  const gaming = theme === 'gaming';
  dom.preview.src = assetUrl(gaming ? '/src/assets/gamintheme.svg' : '/src/assets/codetheme.svg');
  dom.preview.alt = gaming ? 'Vorschau: Gaming theme' : 'Vorschau: Code vibes theme';
}

/** Registers the existing settings interactions. */
export function initSettings(): void {
  const selector = 'input[name="theme"], input[name="player"], input[name="boardSize"]';
  document.querySelectorAll<HTMLInputElement>(selector).forEach((input) => {
    input.addEventListener('change', updateSettingsSummary);
  });
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(bindThemePreview);
  dom.playButton?.addEventListener('click', openSettings);
  updateSettingsSummary();
}

/** Connects selection and hover previews to one theme option. */
function bindThemePreview(input: HTMLInputElement): void {
  input.addEventListener('change', () => {
    if (input.checked) showThemePreview(input.value);
  });
  const label = input.closest('label');
  label?.addEventListener('mouseenter', () => showThemePreview(input.value));
  label?.addEventListener('mouseleave', () => showThemePreview(getTheme()));
}

/** Opens the settings screen from the home screen. */
function openSettings(): void {
  if (!dom.home || !dom.settings) return;
  dom.home.hidden = true;
  dom.settings.hidden = false;
  updateSettingsSummary();
  showThemePreview(getTheme());
  window.scrollTo(0, 0);
}
