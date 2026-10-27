import './style.scss';

/* ==========================================
   HTML-ELEMENTE
========================================== */

const home = document.querySelector<HTMLElement>('.home');
const settings = document.querySelector<HTMLElement>('.settings');
const game = document.querySelector<HTMLElement>('.game');
const gameOver = document.querySelector<HTMLElement>('.game-over');
const winnerScreen = document.querySelector<HTMLElement>('.winner');
const drawScreen = document.querySelector<HTMLElement>('.draw');

const playButton = document.querySelector<HTMLButtonElement>(
  '.home__play-button'
);
const startButton = document.querySelector<HTMLButtonElement>(
  '.settings__start'
);
const preview = document.querySelector<HTMLImageElement>(
  '.settings__preview'
);

const selectedThemeElement = document.querySelector<HTMLElement>(
  '#selected-theme'
);
const selectedPlayerElement = document.querySelector<HTMLElement>(
  '#selected-player'
);
const selectedBoardSizeElement = document.querySelector<HTMLElement>(
  '#selected-board-size'
);

const board = document.querySelector<HTMLElement>('.game__board');

const blueScoreElement = document.querySelector<HTMLElement>('#score-blue');
const orangeScoreElement = document.querySelector<HTMLElement>(
  '#score-orange'
);
const currentPlayerIcon = document.querySelector<HTMLImageElement>(
  '.game__current-icon'
);

const finalBlueScoreElement = document.querySelector<HTMLElement>(
  '#final-score-blue'
);
const finalOrangeScoreElement = document.querySelector<HTMLElement>(
  '#final-score-orange'
);

const winnerName = document.querySelector<HTMLElement>('#winner-name');
const winnerPlayer = document.querySelector<HTMLImageElement>(
  '#winner-player'
);
const winnerBackButton = document.querySelector<HTMLButtonElement>(
  '.winner__back'
);
const drawBackButton = document.querySelector<HTMLButtonElement>(
  '.draw__back'
);

const exitButton = document.querySelector<HTMLButtonElement>('.game__exit');
const exitModal = document.querySelector<HTMLElement>('#exit-modal');
const backToGameButton = document.querySelector<HTMLButtonElement>(
  '.exit-modal__back'
);
const confirmExitButton = document.querySelector<HTMLButtonElement>(
  '.exit-modal__confirm'
);

/* ==========================================
   KARTENMOTIVE
========================================== */

const codeCards = [
  '/src/assets/Property 26.svg',
  '/src/assets/Property 19.svg',
  '/src/assets/Front (2).svg',
  '/src/assets/Front.svg',
  '/src/assets/Property 221.svg',
  '/src/assets/Property 22.svg',
  '/src/assets/Property 20.svg',
  '/src/assets/Property 21.svg',
  '/src/assets/Property 23.svg',
  '/src/assets/Property 24.svg',
  '/src/assets/Property 25.svg',
  '/src/assets/Front (1).svg',
  '/src/assets/Front (3).svg',
  '/src/assets/Front (4).svg',
  '/src/assets/Front (5).svg',
  '/src/assets/Front (6).svg',
  '/src/assets/Front (7).svg',
  '/src/assets/Front (8).svg',
];

const gamingCards = [
  '/src/assets/Component 2.svg',
  '/src/assets/Property 1=Component 2 (17).svg',
  '/src/assets/Property 2.svg',
  '/src/assets/Property 3.svg',
  '/src/assets/Property 4.svg',
  '/src/assets/Property 5.svg',
  '/src/assets/Front (11).svg',
  '/src/assets/Property 6.svg',
  '/src/assets/Property 7.svg',
  '/src/assets/Property 8.svg',
  '/src/assets/Property 9.svg',
  '/src/assets/Property 10.svg',
  '/src/assets/Property 11.svg',
  '/src/assets/Property 12.svg',
  '/src/assets/Property 13.svg',
  '/src/assets/Property 14.svg',
  '/src/assets/Property 15.svg',
  '/src/assets/Property 16.svg',
];

const codeCardBack = '/src/assets/Property 18.svg';
const gamingCardBack = '/src/assets/Property 1.svg';

const blueIcon = '/src/assets/label 1.svg';
const orangeIcon = '/src/assets/label.svg';

const gamingBlueIcon = '/src/assets/chess_pawnblue.svg';
const gamingOrangeIcon = '/src/assets/chesspawn.svg';

/* ==========================================
   TYPEN UND SPIELVARIABLEN
========================================== */

type Player = 'blue' | 'orange';
type Theme = 'code' | 'gaming';
type BoardSize = 16 | 24 | 36;

interface MemoryCard {
  id: number;
  image: string;
  pairId: number;
  matched: boolean;
}

let cards: MemoryCard[] = [];
let flippedCards: number[] = [];

let currentPlayer: Player = 'blue';
let currentTheme: Theme = 'code';

let blueScore = 0;
let orangeScore = 0;

let isChecking = false;
let gameSession = 0;

const EXIT_ANIMATION_DURATION = 450;
let exitAnimationTimeout: number | undefined;

/* ==========================================
   GAMING THEME – EXIT-BUTTON-SYMBOLE
========================================== */

const exitButtonIcon = exitButton?.querySelector<HTMLImageElement>('img');
const confirmExitIcon = confirmExitButton?.querySelector<HTMLImageElement>('img');
function setupBackToGameButton() {
  if (!backToGameButton) return;

  const icon = backToGameButton.querySelector<HTMLImageElement>(
    'img:not(.exit-modal__back-hover)'
  );

  if (!icon) return;

  if (currentTheme === 'gaming') {
    icon.className = 'exit-modal__back-default';
    icon.src = '/src/assets/Propertyback.svg';

    let hoverIcon =
      backToGameButton.querySelector<HTMLImageElement>(
        '.exit-modal__back-hover'
      );

    if (!hoverIcon) {
      hoverIcon = document.createElement('img');
      hoverIcon.className = 'exit-modal__back-hover';
      hoverIcon.alt = '';
      hoverIcon.setAttribute('aria-hidden', 'true');

      backToGameButton.appendChild(hoverIcon);
    }

    hoverIcon.src = '/src/assets/Propertybackgame.svg';
  } else {
    icon.className = '';
    icon.src = '/src/assets/back1.svg';

    backToGameButton
      .querySelector('.exit-modal__back-hover')
      ?.remove();
  }
}

function updateExitButtonIcon(isHovered = false) {
  if (!exitButtonIcon) return;

  if (currentTheme === 'gaming') {
    exitButtonIcon.src = isHovered
      ? '/src/assets/Propertyexit.svg'
      : '/src/assets/gametheme.svg';
  } else {
    exitButtonIcon.src = '/src/assets/secondary button.svg';
  }
}

function updateConfirmExitIcon() {
  if (!confirmExitIcon) return;

  confirmExitIcon.src =
    currentTheme === 'gaming'
      ? '/src/game theme.svg'
      : '/src/assets/exit.svg';
}
/* ==========================================
   EINSTELLUNGEN AUSLESEN
========================================== */

function getSelectedValue(name: string): string | undefined {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  )?.value;
}

function getBoardSize(): BoardSize {
  const size = Number(getSelectedValue('boardSize') ?? '16');

  return size === 16 || size === 24 || size === 36 ? size : 16;
}

function getTheme(): Theme {
  return getSelectedValue('theme') === 'gaming' ? 'gaming' : 'code';
}

function getStartingPlayer(): Player {
  return getSelectedValue('player') === 'orange' ? 'orange' : 'blue';
}

/* ==========================================
   DYNAMISCHE SETTINGS-LEISTE
========================================== */

function updateSettingsSummary() {
  const theme = getTheme();
  const player = getStartingPlayer();
  const boardSize = getBoardSize();

  if (selectedThemeElement) {
    selectedThemeElement.textContent =
      theme === 'gaming' ? 'Gaming' : 'Code vibes';
  }

  if (selectedPlayerElement) {
    selectedPlayerElement.textContent =
      player === 'orange' ? 'Orange' : 'Blue';
  }

  if (selectedBoardSizeElement) {
    selectedBoardSizeElement.textContent = `${boardSize} cards`;
  }
}

document
  .querySelectorAll<HTMLInputElement>(
    'input[name="theme"], input[name="player"], input[name="boardSize"]'
  )
  .forEach((input) => {
    input.addEventListener('change', updateSettingsSummary);
  });

updateSettingsSummary();

/* ==========================================
   THEME-VORSCHAU
========================================== */

function showThemePreview(theme: string) {
  if (!preview) {
    return;
  }

  if (theme === 'gaming') {
    preview.src = '/src/assets/gamintheme.svg';
    preview.alt = 'Vorschau: Gaming theme';
  } else {
    preview.src = '/src/assets/codetheme.svg';
    preview.alt = 'Vorschau: Code vibes theme';
  }
}

document
  .querySelectorAll<HTMLInputElement>('input[name="theme"]')
  .forEach((input) => {
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
      showThemePreview(getTheme());
    });
  });

/* ==========================================
   HOME UND SETTINGS
========================================== */

playButton?.addEventListener('click', () => {
  if (!home || !settings) {
    return;
  }

  home.hidden = true;
  settings.hidden = false;

  updateSettingsSummary();
  showThemePreview(getTheme());

  window.scrollTo(0, 0);
});

/* ==========================================
   KARTEN MISCHEN UND ERSTELLEN
========================================== */

function shuffleCards(cardList: MemoryCard[]): MemoryCard[] {
  const shuffled = [...cardList];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

function createCards(
  images: string[],
  cardCount: BoardSize
): MemoryCard[] {
  const pairCount = cardCount / 2;

  if (images.length < pairCount) {
    console.warn(
      `Benötigt: ${pairCount} Motive. Vorhanden: ${images.length}.`
    );

    return [];
  }

  const selectedImages = images.slice(0, pairCount);
  const cardPairs: MemoryCard[] = [];

  selectedImages.forEach((image, pairId) => {
    cardPairs.push({
      id: pairId * 2,
      image,
      pairId,
      matched: false,
    });

    cardPairs.push({
      id: pairId * 2 + 1,
      image,
      pairId,
      matched: false,
    });
  });

  return shuffleCards(cardPairs);
}

/* ==========================================
   PUNKTE UND SPIELERWECHSEL
========================================== */

function updateScoreboard() {
  if (blueScoreElement) {
    blueScoreElement.textContent = String(blueScore);
  }

  if (orangeScoreElement) {
    orangeScoreElement.textContent = String(orangeScore);
  }

  const isGamingTheme = currentTheme === 'gaming';

  // Symbole in der Punkteanzeige
  const blueScoreIcon = document.querySelector<HTMLImageElement>(
    '.game__score-icon--blue'
  );

  const orangeScoreIcon = document.querySelector<HTMLImageElement>(
    '.game__score-icon--orange'
  );

  if (blueScoreIcon) {
    blueScoreIcon.src = isGamingTheme
      ? gamingBlueIcon
      : blueIcon;
  }

  if (orangeScoreIcon) {
    orangeScoreIcon.src = isGamingTheme
      ? gamingOrangeIcon
      : orangeIcon;
  }

  // Symbol des aktuellen Spielers
  if (currentPlayerIcon) {
    currentPlayerIcon.classList.toggle(
      'game__current-icon--blue',
      isGamingTheme && currentPlayer === 'blue'
    );

    currentPlayerIcon.classList.toggle(
      'game__current-icon--orange',
      isGamingTheme && currentPlayer === 'orange'
    );

    if (currentPlayer === 'blue') {
      currentPlayerIcon.src = isGamingTheme
        ? gamingBlueIcon
        : blueIcon;

      currentPlayerIcon.alt = 'Blue';
    } else {
      currentPlayerIcon.src = isGamingTheme
        ? gamingOrangeIcon
        : orangeIcon;

      currentPlayerIcon.alt = 'Orange';
    }
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';

  updateScoreboard();
}

/* ==========================================
   SPIELFELD ERSTELLEN
========================================== */

function renderBoard() {
  if (!board) {
    return;
  }

  board.innerHTML = '';
  board.dataset.size = String(cards.length);

  const cardBack =
    currentTheme === 'gaming' ? gamingCardBack : codeCardBack;

  cards.forEach((card, index) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'game__card';
    button.dataset.index = String(index);

    button.setAttribute(
      'aria-label',
      'Verdeckte Memory-Karte'
    );

    const inner = document.createElement('span');
    inner.className = 'game__card-inner';

    const back = document.createElement('span');
    back.className = 'game__card-back';

    const backImage = document.createElement('img');
    backImage.src = cardBack;
    backImage.alt = '';

    back.appendChild(backImage);

    const front = document.createElement('span');
    front.className = 'game__card-front';

    const frontImage = document.createElement('img');
    frontImage.src = card.image;
    frontImage.alt = '';

    front.appendChild(frontImage);

    inner.appendChild(back);
    inner.appendChild(front);
    button.appendChild(inner);

    button.addEventListener('click', () => {
      flipCard(index);
    });

    board.appendChild(button);
  });
}

function updateCard(index: number, revealed: boolean) {
  const button = board?.querySelector<HTMLButtonElement>(
    `.game__card[data-index="${index}"]`
  );

  if (!button) {
    return;
  }

  button.classList.toggle('game__card--flipped', revealed);

  button.setAttribute(
    'aria-label',
    revealed
      ? 'Aufgedeckte Memory-Karte'
      : 'Verdeckte Memory-Karte'
  );
}

/* ==========================================
   MEMORY-SPIELLOGIK
========================================== */

function flipCard(index: number) {
  if (
    isChecking ||
    (exitModal && !exitModal.hidden)
  ) {
    return;
  }

  const card = cards[index];

  if (
    !card ||
    card.matched ||
    flippedCards.includes(index)
  ) {
    return;
  }

  if (flippedCards.length >= 2) {
    return;
  }

  flippedCards.push(index);
  updateCard(index, true);

  if (flippedCards.length !== 2) {
    return;
  }

  const [firstIndex, secondIndex] = flippedCards;

  const firstCard = cards[firstIndex];
  const secondCard = cards[secondIndex];

  if (firstCard.pairId === secondCard.pairId) {
    firstCard.matched = true;
    secondCard.matched = true;

    const firstButton = board?.querySelector<HTMLButtonElement>(
      `.game__card[data-index="${firstIndex}"]`
    );

    const secondButton = board?.querySelector<HTMLButtonElement>(
      `.game__card[data-index="${secondIndex}"]`
    );

    firstButton?.classList.add('game__card--matched');
    secondButton?.classList.add('game__card--matched');

    if (currentPlayer === 'blue') {
      blueScore++;
    } else {
      orangeScore++;
    }

    updateScoreboard();

    flippedCards = [];

    if (cards.every((item) => item.matched)) {
      isChecking = true;

      const session = gameSession;

      window.setTimeout(() => {
        if (session !== gameSession) {
          return;
        }

        showGameOver();
      }, 300);
    }
  } else {
    isChecking = true;

    const session = gameSession;

    window.setTimeout(() => {
      if (session !== gameSession) {
        return;
      }

      updateCard(firstIndex, false);
      updateCard(secondIndex, false);

      flippedCards = [];
      isChecking = false;

      switchPlayer();
    }, 1000);
  }
}
/* ==========================================
   GAME OVER
========================================== */

function showGameOver() {
  if (!game || !gameOver) {
    return;
  }

  // Finale Punkte anzeigen
  if (finalBlueScoreElement) {
    finalBlueScoreElement.textContent = String(blueScore);
  }

  if (finalOrangeScoreElement) {
    finalOrangeScoreElement.textContent = String(orangeScore);
  }

  // Gaming-Design nur beim Gaming-Theme aktivieren
  gameOver.classList.toggle(
    'game-over--gaming',
    currentTheme === 'gaming'
  );

  // Passende GAME-OVER-Grafik auswählen
  const gameOverTitle =
    gameOver.querySelector<HTMLImageElement>('.game-over__title');

  if (gameOverTitle) {
    gameOverTitle.src =
      currentTheme === 'gaming'
        ? '/src/assets/GAME OVER (1).svg'
        : '/src/assets/game over.svg';
  }
  // Passende Spieler-Icons für das jeweilige Theme
const blueIcon = gameOver.querySelector<HTMLImageElement>(
  '.game-over__score--blue img'
);

const orangeIcon = gameOver.querySelector<HTMLImageElement>(
  '.game-over__score--orange img'
);

if (blueIcon) {
  blueIcon.src =
    currentTheme === 'gaming'
      ? '/src/assets/chess_pawnblue.svg'
      : '/src/assets/label 1.svg';
}

if (orangeIcon) {
  orangeIcon.src =
    currentTheme === 'gaming'
      ? '/src/assets/chesspawn.svg'
      : '/src/assets/label.svg';
}

  // Spielfeld ausblenden und GAME OVER anzeigen
  game.hidden = true;
  gameOver.hidden = false;

  window.scrollTo(0, 0);

  // Aktuelle Spielrunde merken
  const session = gameSession;

  // Nach 3 Sekunden Gewinner oder Unentschieden anzeigen
  window.setTimeout(() => {
    if (session !== gameSession) {
      return;
    }

    if (blueScore === orangeScore) {
      showDraw();
    } else {
      showWinner();
    }
  }, 3000);
}
/* ==========================================
   WINNER-SCREEN
========================================== */

function showWinner() {
  if (
    !gameOver ||
    !winnerScreen ||
    !winnerName ||
    !winnerPlayer
  ) {
    return;
  }

  const isGaming = currentTheme === 'gaming';

  // Gaming-Design nur beim Gaming-Theme aktivieren
  winnerScreen.classList.toggle('winner--gaming', isGaming);

  if (blueScore > orangeScore) {
    winnerName.textContent = 'BLUE PLAYER';
    winnerName.className =
      'winner__name winner__name--blue';

    winnerPlayer.src = isGaming
      ? '/src/pockal 1.svg'
      : '/src/assets/blueplayer.svg';

    winnerPlayer.alt = isGaming
      ? 'Winner trophy'
      : 'Blue player';
  } else {
    winnerName.textContent = 'ORANGE PLAYER';
    winnerName.className =
      'winner__name winner__name--orange';

    winnerPlayer.src = isGaming
      ? '/src/pockal 1.svg'
      : '/src/assets/orangeplayer.svg';

    winnerPlayer.alt = isGaming
      ? 'Winner trophy'
      : 'Orange player';
  }

  // Home-Button je nach Theme auswählen
  const homeButtonIcon =
    winnerScreen.querySelector<HTMLImageElement>('.winner__back img');

  if (homeButtonIcon) {
    homeButtonIcon.src = isGaming
      ? '/src/home.svg'
      : '/src/assets/backtostart.svg';
  }

  winnerPlayer.hidden = false;
  gameOver.hidden = true;

  winnerScreen.classList.remove('winner--visible');
  winnerScreen.hidden = false;

  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      winnerScreen.classList.add('winner--visible');
    });
  });
}
/* ==========================================
   DRAW-SCREEN
========================================== */

function showDraw() {
  if (!gameOver || !drawScreen) {
    return;
  }

  // Gaming-Design nur beim Gaming-Theme aktivieren
  drawScreen.classList.toggle(
    'draw--gaming',
    currentTheme === 'gaming'
  );

  gameOver.hidden = true;

  drawScreen.classList.remove('draw--visible');
  drawScreen.hidden = false;

  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      drawScreen.classList.add('draw--visible');
    });
  });
}
/* ==========================================
   ZURÜCK ZUM START
========================================== */

function backToStart() {
  if (!home || !settings || !game || !gameOver) {
    return;
  }

  gameSession++;

  if (winnerScreen) {
    winnerScreen.hidden = true;
    winnerScreen.classList.remove('winner--visible');
  }

  if (drawScreen) {
    drawScreen.hidden = true;
    drawScreen.classList.remove('draw--visible');
  }

  gameOver.hidden = true;
  game.hidden = true;
  settings.hidden = true;
  home.hidden = false;

  window.scrollTo(0, 0);
}

winnerBackButton?.addEventListener('click', backToStart);
drawBackButton?.addEventListener('click', backToStart);

/* ==========================================
   SPIEL STARTEN
========================================== */

startButton?.addEventListener('click', () => {
  if (!settings || !game || !board) {
    return;
  }

  const theme = getTheme();
  const player = getStartingPlayer();
  const boardSize = getBoardSize();

  currentTheme = theme;
  currentPlayer = player;

  // Gaming Theme nur beim Gaming-Spiel aktivieren
  game.classList.toggle(
    'game--gaming',
    currentTheme === 'gaming'
  );

  // Exit-Popup liegt außerhalb des Game-Containers.
  // Deshalb bekommt es eine eigene Gaming-Klasse.
  exitModal?.classList.toggle(
    'exit-modal--gaming',
    currentTheme === 'gaming'
  );

  // Richtige SVGs für die Buttons setzen
  updateExitButtonIcon();
  setupBackToGameButton();
  updateConfirmExitIcon();



  const selectedCards =
    currentTheme === 'gaming' ? gamingCards : codeCards;

  gameSession++;

  cards = createCards(selectedCards, boardSize);

  if (cards.length === 0) {
    alert('Für diese Spielfeldgröße fehlen Kartenmotive.');
    return;
  }

  blueScore = 0;
  orangeScore = 0;

  flippedCards = [];
  isChecking = false;

  updateScoreboard();
  renderBoard();

  window.clearTimeout(exitAnimationTimeout);

  if (exitModal) {
    exitModal.hidden = true;

    exitModal.classList.remove(
      'is-entering',
      'is-leaving'
    );
  }

  if (gameOver) {
    gameOver.hidden = true;
  }

  if (winnerScreen) {
    winnerScreen.hidden = true;
    winnerScreen.classList.remove('winner--visible');
  }

  if (drawScreen) {
    drawScreen.hidden = true;
    drawScreen.classList.remove('draw--visible');
  }

  settings.hidden = true;
  game.hidden = false;

  window.scrollTo(0, 0);

  console.log('Spiel gestartet:', {
    theme,
    player,
    boardSize,
    cardCount: cards.length,
    pairCount: cards.length / 2,
  });
});

/* ==========================================
   EXIT-POPUP
========================================== */

function openExitModal() {
  if (!exitModal || !exitModal.hidden) {
    return;
  }

  window.clearTimeout(exitAnimationTimeout);

  exitModal.classList.remove('is-leaving');
  exitModal.classList.add('is-entering');
  exitModal.hidden = false;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      exitModal.classList.remove('is-entering');
    });
  });

  backToGameButton?.focus();
}

function closeExitModal(leaveGame: boolean) {
  if (!exitModal || exitModal.hidden) {
    return;
  }

  window.clearTimeout(exitAnimationTimeout);

  exitModal.classList.remove('is-entering');
  exitModal.classList.add('is-leaving');

  exitAnimationTimeout = window.setTimeout(() => {
    exitModal.hidden = true;
    exitModal.classList.remove('is-leaving');

    if (leaveGame) {
      if (!settings || !game) {
        return;
      }

      gameSession++;

      game.hidden = true;
      settings.hidden = false;

      updateSettingsSummary();

      window.scrollTo(0, 0);
    } else {
      exitButton?.focus();
    }
  }, EXIT_ANIMATION_DURATION);
}

exitButton?.addEventListener('click', openExitModal);

backToGameButton?.addEventListener('click', () => {
  closeExitModal(false);
});

confirmExitButton?.addEventListener('click', () => {
  closeExitModal(true);
});

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    exitModal &&
    !exitModal.hidden
  ) {
    closeExitModal(false);
  }
});