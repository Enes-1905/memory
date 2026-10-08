import './style.scss';

const home = document.querySelector<HTMLElement>('.home');

const playButton = document.querySelector<HTMLButtonElement>(
  '.home__play-button'
);

const title = document.querySelector<HTMLImageElement>(
  '.home__title'
);

const controller = document.querySelector<HTMLImageElement>(
  '.home__controller'
);

const subtitle = document.querySelector<HTMLElement>(
  '.home__subtitle'
);

if (!home) {
  console.error('Home-Element wurde nicht gefunden.');
}

if (!playButton) {
  console.error('Play-Button wurde nicht gefunden.');
}

if (!title) {
  console.error('Titel-SVG wurde nicht gefunden.');
}

if (!controller) {
  console.error('Controller-SVG wurde nicht gefunden.');
}

if (!subtitle) {
  console.error('Untertitel wurde nicht gefunden.');
}

if (playButton) {
  playButton.addEventListener('click', () => {
    console.log('Play-Button wurde geklickt.');

    // Hier wird später das Memory-Spiel gestartet.
  });
}

console.log('Memory wurde erfolgreich geladen.');