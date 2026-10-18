import './style.scss';

/* ==========================================
   HTML-ELEMENTE
========================================== */

const home = document.querySelector<HTMLElement>('.home');
const settings = document.querySelector<HTMLElement>('.settings');
const game = document.querySelector<HTMLElement>('.game');
const gameOver = document.querySelector<HTMLElement>('.game-over');

const winnerScreen = document.querySelector<HTMLElement>('.winner');
const winnerName = document.querySelector<HTMLElement>('#winner-name');
const winnerPlayer = document.querySelector<HTMLImageElement>('#winner-player');

const backToStartButton = document.querySelector<HTMLButtonElement>(
  '.winner__back'
);

// DRAW-Screen bei einem Unentschieden
const drawScreen = document.querySelector<HTMLElement>('.draw');

const drawBackButton = document.querySelector<HTMLButtonElement>(
  '.draw__back'
);

const playButton = document.querySelector<HTMLButtonElement>(
  '.home__play-button'
);

const preview = document.querySelector<HTMLImageElement>(
  '.settings__preview'
);

const startButton = document.querySelector<HTMLButtonElement>(
  '.settings__start'
);

const exitButton = document.querySelector<HTMLButtonElement>(
  '.game__exit'
);

const exitModal = document.querySelector<HTMLElement>('#exit-modal');

const backToGameButton = document.querySelector<HTMLButtonElement>(
  '.exit-modal__back'
);

const confirmExitButton = document.querySelector<HTMLButtonElement>(
  '.exit-modal__confirm'
);

const board = document.querySelector<HTMLElement>('.game__board');

const blueScoreElement = document.querySelector<HTMLElement>(
  '#score-blue'
);

const orangeScoreElement = document.querySelector<HTMLElement>(
  '#score-orange'
);

const finalBlueScoreElement = document.querySelector<HTMLElement>(
  '#final-score-blue'
);

const finalOrangeScoreElement = document.querySelector<HTMLElement>(
  '#final-score-orange'
);

const currentPlayerIcon = document.querySelector<HTMLImageElement>(
  '.game__current-icon'
);

/* ==========================================
   KARTEN – CODE THEME
========================================== */

// Insgesamt 18 verschiedene SVG-Dateien.
//
// 16 Karten: Die ersten 8 Motive.
// 24 Karten: Die ersten 12 Motive.
// 36 Karten: Alle 18 Motive.
//
// Die bisherigen 8 Motive bleiben unverändert.
// Die zusätzlichen 10 SVGs stammen aus deinem
// vorhandenen src/assets-Ordner.

const codeCards = [
  // Bisherige 8 Kartenmotive
  '/src/assets/Property 26.svg',  // Git
  '/src/assets/Property 19.svg',  // TypeScript
  '/src/assets/Front (2).svg',    // Angular
  '/src/assets/Front.svg',        // HTML5
  '/src/assets/Property 221.svg', // CSS3
  '/src/assets/Property 22.svg',  // Django
  '/src/assets/Property 20.svg',  // JavaScript
  '/src/assets/Property 21.svg',  // VS Code

  // Weitere 4 Motive für 24 Karten
  '/src/assets/Property 23.svg',
  '/src/assets/Property 24.svg',
  '/src/assets/Property 25.svg',
  '/src/assets/Front (1).svg',

  // Weitere 6 Motive für 36 Karten
  '/src/assets/Front (3).svg',
  '/src/assets/Front (4).svg',
  '/src/assets/Front (5).svg',
  '/src/assets/Front (6).svg',
  '/src/assets/Front (7).svg',
  '/src/assets/Front (8).svg',
];

// Rückseite aller Memory-Karten
const cardBack = '/src/assets/Property 18.svg';

// Spielersymbole
const blueIcon = '/src/assets/label 1.svg';
const orangeIcon = '/src/assets/label.svg';

/* ==========================================
   TYPEN
========================================== */

type Player = 'blue' | 'orange';

type BoardSize = 16 | 24 | 36;

interface MemoryCard {
  id: number;
  image: string;
  pairId: number;
  matched: boolean;
}

/* ==========================================
   SPIELVARIABLEN
========================================== */

let cards: MemoryCard[] = [];
let flippedCards: number[] = [];

let currentPlayer: Player = 'blue';

let blueScore = 0;
let orangeScore = 0;

let isChecking = false;

// Verhindert, dass alte Timer ein neues Spiel verändern.
let gameSession = 0;

/* ==========================================
   HOME → SETTINGS
========================================== */

playButton?.addEventListener('click', () => {
  if (!home || !settings) return;

  home.hidden = true;
  settings.hidden = false;

  window.scrollTo(0, 0);
});

/* ==========================================
   THEME-VORSCHAU
========================================== */

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

/* ==========================================
   AUSGEWÄHLTE EINSTELLUNG AUSLESEN
========================================== */

function getSelectedValue(name: string): string | undefined {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  )?.value;
}

/* ==========================================
   SPIELFELDGRÖSSE PRÜFEN
========================================== */

// Nur die drei vorgesehenen Kartenzahlen erlauben.

function getBoardSize(): BoardSize {
  const selectedValue = Number(
    getSelectedValue('boardSize') ?? '16'
  );

  if (
    selectedValue === 16 ||
    selectedValue === 24 ||
    selectedValue === 36
  ) {
    return selectedValue;
  }

  return 16;
}

/* ==========================================
   KARTEN MISCHEN
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

/* ==========================================
   PUNKTETAFEL
========================================== */

function updateScoreboard() {
  if (blueScoreElement) {
    blueScoreElement.textContent = String(blueScore);
  }

  if (orangeScoreElement) {
    orangeScoreElement.textContent = String(orangeScore);
  }

  if (currentPlayerIcon) {
    currentPlayerIcon.src =
      currentPlayer === 'blue' ? blueIcon : orangeIcon;

    currentPlayerIcon.alt =
      currentPlayer === 'blue' ? 'Blue' : 'Orange';
  }
}

/* ==========================================
   SPIELER WECHSELN
========================================== */

function switchPlayer() {
  currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';

  updateScoreboard();
}

/* ==========================================
   MEMORY-KARTEN ERSTELLEN
========================================== */

function createCards(
  images: string[],
  cardCount: BoardSize
): MemoryCard[] {
  // 16 Karten = 8 Paare
  // 24 Karten = 12 Paare
  // 36 Karten = 18 Paare

  const pairCount = cardCount / 2;

  // Prüfen, ob genügend Motive vorhanden sind.
  if (images.length < pairCount) {
    console.warn(
      `Für ${cardCount} Karten fehlen noch Motive. ` +
      `Vorhanden: ${images.length}, benötigt: ${pairCount}.`
    );

    return [];
  }

  // Nur die benötigte Anzahl an Motiven verwenden.
  const selectedImages = images.slice(0, pairCount);

  const cardPairs: MemoryCard[] = [];

  selectedImages.forEach((image, pairId) => {
    // Erste Karte eines Paares
    cardPairs.push({
      id: pairId * 2,
      image,
      pairId,
      matched: false,
    });

    // Zweite Karte desselben Paares
    cardPairs.push({
      id: pairId * 2 + 1,
      image,
      pairId,
      matched: false,
    });
  });

  // Alle Karten zufällig mischen.
  return shuffleCards(cardPairs);
}

/* ==========================================
   SPIELFELD RENDERN
========================================== */

function renderBoard() {
  if (!board) return;

  // Altes Spielfeld entfernen.
  board.innerHTML = '';

  // Kartenzahl an SCSS übergeben.
  //
  // 16 Karten: data-size="16"
  // 24 Karten: data-size="24"
  // 36 Karten: data-size="36"

  board.dataset.size = String(cards.length);

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

    /* ------------------------------------------
       KARTENRÜCKSEITE
    ------------------------------------------ */

    const back = document.createElement('span');
    back.className = 'game__card-back';

    const backImage = document.createElement('img');
    backImage.src = cardBack;
    backImage.alt = '';

    back.appendChild(backImage);

    /* ------------------------------------------
       KARTENVORDERSEITE
    ------------------------------------------ */

    const front = document.createElement('span');
    front.className = 'game__card-front';

    const frontImage = document.createElement('img');
    frontImage.src = card.image;
    frontImage.alt = '';

    front.appendChild(frontImage);

    /* ------------------------------------------
       KARTE ZUSAMMENBAUEN
    ------------------------------------------ */

    inner.appendChild(back);
    inner.appendChild(front);

    button.appendChild(inner);

    // Karte beim Anklicken umdrehen.
    button.addEventListener('click', () => {
      flipCard(index);
    });

    board.appendChild(button);
  });
}

/* ==========================================
   KARTE AKTUALISIEREN
========================================== */

function updateCard(index: number, revealed: boolean) {
  if (!board) return;

  const button = board.querySelector<HTMLButtonElement>(
    `.game__card[data-index="${index}"]`
  );

  if (!button) return;

  button.classList.toggle(
    'game__card--flipped',
    revealed
  );

  button.setAttribute(
    'aria-label',
    revealed
      ? 'Aufgedeckte Memory-Karte'
      : 'Verdeckte Memory-Karte'
  );
}

/* ==========================================
   SPIELLOGIK
========================================== */

function flipCard(index: number) {
  // Während der Prüfung oder bei geöffnetem Popup
  // dürfen keine weiteren Karten aufgedeckt werden.

  if (
    isChecking ||
    (exitModal && !exitModal.hidden)
  ) {
    return;
  }

  const card = cards[index];

  // Ungültige oder bereits gefundene Karte ignorieren.
  if (!card || card.matched) return;

  // Dieselbe Karte darf nicht zweimal ausgewählt werden.
  if (flippedCards.includes(index)) return;

  // Maximal zwei Karten gleichzeitig aufdecken.
  if (flippedCards.length >= 2) return;

  flippedCards.push(index);

  updateCard(index, true);

  // Auf die zweite Karte warten.
  if (flippedCards.length !== 2) return;

  const [firstIndex, secondIndex] = flippedCards;

  const firstCard = cards[firstIndex];
  const secondCard = cards[secondIndex];

  /* ------------------------------------------
     RICHTIGES PAAR
  ------------------------------------------ */

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

    // Punkt für den aktuellen Spieler.
    if (currentPlayer === 'blue') {
      blueScore++;
    } else {
      orangeScore++;
    }

    updateScoreboard();

    flippedCards = [];

    /* ------------------------------------------
       PRÜFEN, OB DAS SPIEL BEENDET IST
    ------------------------------------------ */

    // Funktioniert automatisch für:
    // 8, 12 und 18 gefundene Paare.

    if (cards.every((item) => item.matched)) {
      isChecking = true;

      const session = gameSession;

      setTimeout(() => {
        if (session !== gameSession) return;

        showGameOver();
      }, 300);
    }
  } else {
    /* ------------------------------------------
       FALSCHES PAAR
    ------------------------------------------ */

    isChecking = true;

    const session = gameSession;

    setTimeout(() => {
      if (session !== gameSession) return;

      // Beide Karten wieder umdrehen.
      updateCard(firstIndex, false);
      updateCard(secondIndex, false);

      flippedCards = [];
      isChecking = false;

      // Spieler wechseln.
      switchPlayer();
    }, 1000);
  }
}

/* ==========================================
   GAME OVER ANZEIGEN
========================================== */

function showGameOver() {
  if (!game || !gameOver) return;

  // Finalen Punktestand übertragen.
  if (finalBlueScoreElement) {
    finalBlueScoreElement.textContent = String(blueScore);
  }

  if (finalOrangeScoreElement) {
    finalOrangeScoreElement.textContent = String(orangeScore);
  }

  // Spielfeld ausblenden.
  game.hidden = true;

  // Game-Over-Screen anzeigen.
  gameOver.hidden = false;

  window.scrollTo(0, 0);

  // Finalen Punktestand 3 Sekunden anzeigen.
  const session = gameSession;

  window.setTimeout(() => {
    if (session !== gameSession) return;

    // Bei Gleichstand DRAW anzeigen.
    if (blueScore === orangeScore) {
      showDraw();
    } else {
      // Sonst Gewinner anzeigen.
      showWinner();
    }
  }, 3000);
}

/* ==========================================
   GEWINNER ANZEIGEN
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

  /* ------------------------------------------
     BLUE PLAYER GEWINNT
  ------------------------------------------ */

  if (blueScore > orangeScore) {
    winnerName.textContent = 'BLUE PLAYER';

    winnerName.className =
      'winner__name winner__name--blue';

    winnerPlayer.src = '/src/assets/blueplayer.svg';
    winnerPlayer.alt = 'Blue player';
    winnerPlayer.hidden = false;
  } else {
    /* ------------------------------------------
       ORANGE PLAYER GEWINNT
    ------------------------------------------ */

    winnerName.textContent = 'ORANGE PLAYER';

    winnerName.className =
      'winner__name winner__name--orange';

    winnerPlayer.src = '/src/assets/orangeplayer.svg';
    winnerPlayer.alt = 'Orange player';
    winnerPlayer.hidden = false;
  }

  // Game Over ausblenden.
  gameOver.hidden = true;

  // Winner-Screen vorbereiten.
  winnerScreen.classList.remove('winner--visible');
  winnerScreen.hidden = false;

  window.scrollTo(0, 0);

  // Slide-in-Animation starten.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      winnerScreen.classList.add('winner--visible');
    });
  });
}

/* ==========================================
   DRAW-SCREEN ANZEIGEN
========================================== */

function showDraw() {
  if (!gameOver || !drawScreen) return;

  // Game Over ausblenden.
  gameOver.hidden = true;

  // DRAW-Screen für die Animation vorbereiten.
  drawScreen.classList.remove('draw--visible');
  drawScreen.hidden = false;

  window.scrollTo(0, 0);

  // Slide-in-Animation starten.
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
  if (!home || !settings || !game || !gameOver) return;

  // Alte Timer dürfen keine neue Ansicht mehr öffnen.
  gameSession++;

  /* ------------------------------------------
     WINNER ZURÜCKSETZEN
  ------------------------------------------ */

  if (winnerScreen) {
    winnerScreen.hidden = true;
    winnerScreen.classList.remove('winner--visible');
  }

  /* ------------------------------------------
     DRAW ZURÜCKSETZEN
  ------------------------------------------ */

  if (drawScreen) {
    drawScreen.hidden = true;
    drawScreen.classList.remove('draw--visible');
  }

  /* ------------------------------------------
     ANDERE SCREENS AUSBLENDEN
  ------------------------------------------ */

  gameOver.hidden = true;
  game.hidden = true;
  settings.hidden = true;

  // Home-Screen anzeigen.
  home.hidden = false;

  window.scrollTo(0, 0);
}

// Back-to-start auf dem Winner-Screen.
backToStartButton?.addEventListener(
  'click',
  backToStart
);

// Back-to-start auf dem DRAW-Screen.
drawBackButton?.addEventListener(
  'click',
  backToStart
);

/* ==========================================
   SPIEL STARTEN
========================================== */

startButton?.addEventListener('click', () => {
  if (!settings || !game || !board) return;

  /* ------------------------------------------
     EINSTELLUNGEN AUSLESEN
  ------------------------------------------ */

  const theme = getSelectedValue('theme') ?? 'code';

  const player = getSelectedValue('player') ?? 'blue';

  const boardSize = getBoardSize();

  /* ------------------------------------------
     THEME PRÜFEN
  ------------------------------------------ */

  // Aktuell ist nur das Code-Theme fertig.
  if (theme !== 'code') {
    alert('Die Gaming-Karten bauen wir als Nächstes ein.');
    return;
  }

  /* ------------------------------------------
     NEUES SPIEL VORBEREITEN
  ------------------------------------------ */

  gameSession++;

  // Karten passend zur ausgewählten Größe erstellen.
  cards = createCards(codeCards, boardSize);

  if (cards.length === 0) {
    alert('Für diese Spielfeldgröße fehlen Kartenmotive.');
    return;
  }

  // Startspieler festlegen.
  currentPlayer = player === 'orange' ? 'orange' : 'blue';

  // Punktestand zurücksetzen.
  blueScore = 0;
  orangeScore = 0;

  // Aufgedeckte Karten zurücksetzen.
  flippedCards = [];

  // Kartenprüfung zurücksetzen.
  isChecking = false;

  /* ------------------------------------------
     SPIELFELD AUFBAUEN
  ------------------------------------------ */

  updateScoreboard();

  renderBoard();

  /* ------------------------------------------
     ALTE SCREENS ZURÜCKSETZEN
  ------------------------------------------ */

  // Exit-Popup schließen.
  if (exitModal) {
    exitModal.hidden = true;
    exitModal.classList.remove(
      'is-entering',
      'is-leaving'
    );
  }

  // Settings ausblenden.
  settings.hidden = true;

  // Game Over ausblenden.
  if (gameOver) {
    gameOver.hidden = true;
  }

  // Winner-Screen zurücksetzen.
  if (winnerScreen) {
    winnerScreen.hidden = true;
    winnerScreen.classList.remove('winner--visible');
  }

  // DRAW-Screen zurücksetzen.
  if (drawScreen) {
    drawScreen.hidden = true;
    drawScreen.classList.remove('draw--visible');
  }

  /* ------------------------------------------
     SPIEL ANZEIGEN
  ------------------------------------------ */

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
   EXIT-POPUP MIT SLIDE-ANIMATION
========================================== */

const EXIT_ANIMATION_DURATION = 450;

let exitAnimationTimeout: number | undefined;

/* ==========================================
   EXIT-POPUP ÖFFNEN
========================================== */

function openExitModal() {
  if (!exitModal || !exitModal.hidden) return;

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

/* ==========================================
   EXIT-POPUP SCHLIESSEN
========================================== */

function closeExitModal(leaveGame: boolean) {
  if (!exitModal || exitModal.hidden) return;

  window.clearTimeout(exitAnimationTimeout);

  exitModal.classList.remove('is-entering');
  exitModal.classList.add('is-leaving');

  exitAnimationTimeout = window.setTimeout(() => {
    exitModal.hidden = true;
    exitModal.classList.remove('is-leaving');

    /* ------------------------------------------
       SPIEL VERLASSEN
    ------------------------------------------ */

    if (leaveGame) {
      if (!settings || !game) return;

      // Alte Timer stoppen.
      gameSession++;

      // Spiel ausblenden.
      game.hidden = true;

      // Zurück zu den Einstellungen.
      settings.hidden = false;

      window.scrollTo(0, 0);
    } else {
      /* ------------------------------------------
         ZURÜCK ZUM SPIEL
      ------------------------------------------ */

      exitButton?.focus();
    }
  }, EXIT_ANIMATION_DURATION);
}

/* ==========================================
   EXIT-BUTTONS
========================================== */

// Popup öffnen.
exitButton?.addEventListener('click', () => {
  openExitModal();
});

// Zurück zum Spiel.
backToGameButton?.addEventListener('click', () => {
  closeExitModal(false);
});

// Spiel verlassen.
confirmExitButton?.addEventListener('click', () => {
  closeExitModal(true);
});

/* ==========================================
   ESCAPE SCHLIESST DAS POPUP
========================================== */

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    exitModal &&
    !exitModal.hidden
  ) {
    closeExitModal(false);
  }
});