import type { BoardSize, Player, Theme } from '../types/game';
import { assetUrl } from '../utils/assets';
import { dom } from './dom';

/**
 * Reads the currently selected value of a radio button group.
 *
 * @param name - The name attribute of the radio button group.
 * @returns The selected radio button value or undefined if none is selected.
 */
function selectedValue(name: string): string | undefined {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  )?.value;
}

/**
 * Gets the selected game theme.
 *
 * @returns The selected theme or 'code' if no theme is selected.
 */
export function getTheme(): Theme {
  return selectedValue('theme') === 'gaming' ? 'gaming' : 'code';
}

/**
 * Gets the selected starting player.
 *
 * @returns The selected player or 'blue' if no player is selected.
 */
export function getStartingPlayer(): Player {
  return selectedValue('player') === 'orange' ? 'orange' : 'blue';
}

/**
 * Gets the selected board size.
 *
 * @returns The selected board size or 16 if no valid size is selected.
 */
export function getBoardSize(): BoardSize {
  const size = Number(selectedValue('boardSize') ?? '16');
  return size === 16 || size === 24 || size === 36 ? size : 16;
}

/**
 * Checks whether all required game settings have been selected.
 *
 * @returns True if theme, player, and board size are selected; otherwise false.
 */
function areSettingsComplete(): boolean {
  return Boolean(
    selectedValue('theme') &&
    selectedValue('player') &&
    selectedValue('boardSize')
  );
}

/**
 * Updates the theme label to reflect the selected theme.
 * Displays a placeholder when no theme is selected.
 */
function updateThemeLabel(): void {
  if (!dom.selectedTheme) return;

  const theme = selectedValue('theme');
  dom.selectedTheme.textContent = theme
    ? theme === 'gaming' ? 'Gaming' : 'Code vibes'
    : 'Select theme';
}

/**
 * Updates the player label to reflect the selected starting player.
 * Displays a placeholder when no player is selected.
 */
function updatePlayerLabel(): void {
  if (!dom.selectedPlayer) return;

  const player = selectedValue('player');
  dom.selectedPlayer.textContent = player
    ? player === 'orange' ? 'Orange' : 'Blue'
    : 'Select player';
}

/**
 * Updates the board-size label to reflect the selected number of cards.
 * Displays a placeholder when no board size is selected.
 */
function updateBoardSizeLabel(): void {
  if (!dom.selectedBoardSize) return;

  const size = selectedValue('boardSize');
  dom.selectedBoardSize.textContent = size
    ? `${size} cards`
    : 'Select cards';
}

/**
 * Enables the start button only when all required settings are selected.
 * Disables the button when at least one selection is missing.
 */
function updateStartButton(): void {
  const startButton = document.querySelector<HTMLButtonElement>(
    '.settings__start'
  );

  if (startButton) {
    startButton.disabled = !areSettingsComplete();
  }
}

/**
 * Updates the settings summary and the start button state.
 */
export function updateSettingsSummary(): void {
  updateThemeLabel();
  updatePlayerLabel();
  updateBoardSizeLabel();
  updateStartButton();
}

/**
 * Displays a preview image for the specified game theme.
 *
 * @param theme - The theme whose preview image should be displayed.
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

/**
 * Initializes the settings screen interactions.
 * Registers radio button changes, theme previews, and navigation events.
 */
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
 * Registers selection and hover events for a theme radio button.
 *
 * @param input - The theme radio button used to update the preview.
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

/**
 * Opens the settings screen from the home screen.
 * Updates the selected settings and displays the current theme preview.
 */
function openSettings(): void {
  if (!dom.home || !dom.settings) return;

  dom.home.hidden = true;
  dom.settings.hidden = false;

  updateSettingsSummary();
  showThemePreview(selectedValue('theme') ?? 'code');

  window.scrollTo(0, 0);
}