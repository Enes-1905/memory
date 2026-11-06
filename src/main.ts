import './style.scss';
import { initSettings } from './ui/settings';
import { initExitModal } from './ui/exitModal';
import { initResultNavigation } from './ui/screens';
import { dom } from './ui/dom';
import { startGame } from './game/logic';

/**
 * Initializes the memory game application.
 * Registers settings, exit modal, and result screen interactions.
 * Connects the start button to the game initialization handler.
 */
function initializeApp(): void {
  initSettings();
  initExitModal();
  initResultNavigation();
  dom.startButton?.addEventListener('click', startGame);
}

initializeApp();