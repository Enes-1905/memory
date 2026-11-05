import type { BoardSize, Player, Theme } from '../types/game';
import { assetUrl } from '../utils/assets';
import { dom } from './dom';

/** Reads the currently selected value of a radio group. */
function selectedValue(name: string): string | undefined {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  )?.value;
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

/** Checks whether all required game settings have been selected. */
function areSettingsComplete(): boolean {
  return Boolean(
    selectedValue('theme') &&
    selectedValue('player') &&
    selectedValue('boardSize')
  );
}

/** Updates the theme label based on the current selection. */
function updateThemeLabel(): void {
  if (!dom.selectedTheme) return;

  const theme = selectedValue('theme');
  dom.selectedTheme.textContent = theme
    ? theme === 'gaming' ? 'Gaming' : 'Code vibes'
    : 'Select theme';
}

/** Updates the player label based on the current selection. */
function updatePlayerLabel(): void {
  if (!dom.selectedPlayer) return;

  const player = selectedValue('player');
  dom.selectedPlayer.textContent = player
    ? player === 'orange' ? 'Orange' : 'Blue'
    : 'Select player';
}

/** Updates the board-size label based on the current selection. */
function updateBoardSizeLabel(): void {
  if (!dom.selectedBoardSize) return;

  const size = selectedValue('boardSize');
  dom.selectedBoardSize.textContent = size
    ? `${size} cards`
    : 'Select cards';
}

/** Enables the start button only when all settings are complete. */
function updateStartButton(): void {
  const startButton = document.querySelector<HTMLButtonElement>(
    '.settings__start'
  );

  if (startButton) {
    startButton.disabled = !areSettingsComplete();
  }
}

/** Updates the selected settings and start-button state. */
export function updateSettingsSummary(): void {
  updateThemeLabel();
  updatePlayerLabel();
  updateBoardSizeLabel();
  updateStartButton();
}

/**
 * Displays a preview for the supplied theme.
 *
 * @param theme - Theme to display in the preview.
 */
export function showThemePreview(theme: string): void {
  if (!dom.preview) return;

  const gaming = theme === 'gaming';

  dom.preview.src = assetUrl(
    gaming ? '/src/assets/gamintheme.svg' : '/src/assets/codetheme.svg'
  );

  dom.preview.alt = gaming
    ? 'Preview: Gaming theme'
    : 'Preview: Code vibes theme';
}

/** Registers the settings interactions. */
export function initSettings(): void {
  const selector =
    'input[name="theme"], input[name="player"], input[name="boardSize"]';

  document.querySelectorAll<HTMLInputElement>(selector).forEach((input) => {
    input.addEventListener('change', updateSettingsSummary);
  });

  document
    .querySelectorAll<HTMLInputElement>('input[name="theme"]')
    .forEach(bindThemePreview);

  dom.playButton?.addEventListener('click', openSettings);

  updateSettingsSummary();
}

/**
 * Connects selection and hover previews to a theme option.
 *
 * @param input - Radio input belonging to the theme option.
 */
function bindThemePreview(input: HTMLInputElement): void {
  input.addEventListener('change', () => {
    if (input.checked) showThemePreview(input.value);
  });
  const label = input.closest('label');
  label?.addEventListener('mouseenter', () => {
    showThemePreview(input.value);
  });
  label?.addEventListener('mouseleave', () => {
    showThemePreview(selectedValue('theme') ?? 'code');
  });
}

/** Opens the settings screen from the home screen. */
function openSettings(): void {
  if (!dom.home || !dom.settings) return;

  dom.home.hidden = true;
  dom.settings.hidden = false;

  updateSettingsSummary();
  showThemePreview(selectedValue('theme') ?? 'code');

  window.scrollTo(0, 0);
}