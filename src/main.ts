import './style.scss';

const home = document.querySelector<HTMLElement>('.home');

const settings = document.querySelector<HTMLElement>('.settings');

const playButton = document.querySelector<HTMLButtonElement>(
  '.home__play-button'
);

const preview = document.querySelector<HTMLImageElement>(
  '.settings__preview'
);

const startButton = document.querySelector<HTMLButtonElement>(
  '.settings__start'
);

playButton?.addEventListener('click', () => {
  if (!home || !settings) return;

  home.hidden = true;
  settings.hidden = false;

  window.scrollTo(0, 0);
});

function showThemePreview(theme: string) {
  if (!preview) return;

  if (theme === 'code') {
    preview.src = '/src/assets/codetheme.svg';
    preview.alt = 'Vorschau: Code vibes theme';
  }

  if (theme === 'gaming') {
    preview.src = '/src/assets/gamintheme.svg';
    preview.alt = 'Vorschau: Gaming theme';
  }
}


const themeInputs = document.querySelectorAll<HTMLInputElement>(
  'input[name="theme"]'
);

themeInputs.forEach((input) => {
  
  input.addEventListener('change', () => {
    if (input.checked) {
      showThemePreview(input.value);
    }
  });

  const label = input.closest('label');

  label?.addEventListener('mouseenter', () => {
    showThemePreview(input.value);
  });

  label?.addEventListener('mouseleave', () => {
    const selectedTheme = document.querySelector<HTMLInputElement>(
      'input[name="theme"]:checked'
    );

    if (selectedTheme) {
      showThemePreview(selectedTheme.value);
    }
  });
});

startButton?.addEventListener('click', () => {
  const theme = document.querySelector<HTMLInputElement>(
    'input[name="theme"]:checked'
  )?.value;

  const player = document.querySelector<HTMLInputElement>(
    'input[name="player"]:checked'
  )?.value;

  const boardSize = document.querySelector<HTMLInputElement>(
    'input[name="boardSize"]:checked'
  )?.value;

  console.log('Spiel starten mit:', {
    theme,
    player,
    boardSize,
  });

  // Hier kommt später unser Memory-Spiel hin.
});

console.log('Memory wurde erfolgreich geladen.');