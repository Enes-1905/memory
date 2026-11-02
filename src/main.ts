import './style.scss';
import { initSettings } from './ui/settings';
import { initExitModal } from './ui/exitModal';
import { initResultNavigation } from './ui/screens';
import { dom } from './ui/dom';
import { startGame } from './game/logic';

/** Connects the game's existing HTML controls to their handlers. */
function initializeApp(): void {
  initSettings();
  initExitModal();
  initResultNavigation();
  dom.startButton?.addEventListener('click', startGame);
}

initializeApp();
