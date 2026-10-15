import './style.scss';

const home = document.querySelector<HTMLElement>('.home');
const settings = document.querySelector<HTMLElement>('.settings');
const game = document.querySelector<HTMLElement>('.game');

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

const board = document.querySelector<HTMLElement>('.game__board');

const blueScoreElement = document.querySelector<HTMLElement>('#score-blue');
const orangeScoreElement = document.querySelector<HTMLElement>('#score-orange');

const currentPlayerIcon = document.querySelector<HTMLImageElement>(
  '.game__current-icon'
);

const codeCards = [
  '/src/assets/Property 26.svg',  // Git
  '/src/assets/Property 19.svg',  // TypeScript
  '/src/assets/Front (2).svg',    // Angular
  '/src/assets/Front.svg',        // HTML5
  '/src/assets/Property 221.svg', // CSS3
  '/src/assets/Property 22.svg',  // Django
  '/src/assets/Property 20.svg',  // JavaScript
  '/src/assets/Property 21.svg',  // VS Code
];

const cardBack = '/src/assets/Property 18.svg';

const blueIcon = '/src/assets/label 1.svg';
const orangeIcon = '/src/assets/label.svg';

type Player = 'blue' | 'orange';

interface MemoryCard {
  id: number;
  image: string;
  pairId: number;
  matched: boolean;
}

let cards: MemoryCard[] = [];
let flippedCards: number[] = [];

let currentPlayer: Player = 'blue';

let blueScore = 0;
let orangeScore = 0;

let isChecking = false;
let gameSession = 0;

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

function getSelectedValue(name: string): string | undefined {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  )?.value;
}

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

function switchPlayer() {
  currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';

  updateScoreboard();
}

function createCards(images: string[], cardCount: number): MemoryCard[] {
  const pairCount = cardCount / 2;

  if (images.length < pairCount) {
    console.warn(
      `Für ${cardCount} Karten fehlen noch Motive. ` +
      `Vorhanden: ${images.length}, benötigt: ${pairCount}.`
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

function renderBoard() {
  if (!board) return;

  board.innerHTML = '';

  cards.forEach((card, index) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'game__card';
    button.dataset.index = String(index);
    button.setAttribute('aria-label', 'Verdeckte Memory-Karte');

    const inner = document.createElement('span');
    inner.className = 'game__card-inner';

    // Verdeckte Seite
    const back = document.createElement('span');
    back.className = 'game__card-back';

    const backImage = document.createElement('img');
    backImage.src = cardBack;
    backImage.alt = '';

    back.appendChild(backImage);

    // Aufgedeckte Seite
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
  if (!board) return;

  const button = board.querySelector<HTMLButtonElement>(
    `.game__card[data-index="${index}"]`
  );

  if (!button) return;

  button.classList.toggle('game__card--flipped', revealed);

  button.setAttribute(
    'aria-label',
    revealed ? 'Aufgedeckte Memory-Karte' : 'Verdeckte Memory-Karte'
  );
}

function flipCard(index: number) {
  if (isChecking) return;

  const card = cards[index];

  if (!card || card.matched) return;

  if (flippedCards.includes(index)) return;

 
  if (flippedCards.length >= 2) return;

  flippedCards.push(index);

  updateCard(index, true);

  if (flippedCards.length !== 2) return;

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
      setTimeout(() => {
        alert(
          `Spiel beendet!\nBlue: ${blueScore}\nOrange: ${orangeScore}`
        );
      }, 300);
    }
  } else {
   
    isChecking = true;

    const session = gameSession;

    setTimeout(() => {
      
      if (session !== gameSession) return;

      updateCard(firstIndex, false);
      updateCard(secondIndex, false);

      flippedCards = [];
      isChecking = false;

      switchPlayer();
    }, 1000);
  }
}

startButton?.addEventListener('click', () => {
  if (!settings || !game || !board) return;

  const theme = getSelectedValue('theme') ?? 'code';
  const player = getSelectedValue('player') ?? 'blue';
  const boardSize = Number(getSelectedValue('boardSize') ?? '16');

 
  if (theme !== 'code') {
    alert('Die Gaming-Karten bauen wir als Nächstes ein.');
    return;
  }

  if (boardSize !== 16) {
    alert('Für 24 und 36 Karten brauchen wir noch weitere Kartenmotive.');
    return;
  }

  gameSession++;

  cards = createCards(codeCards, boardSize);

  if (cards.length === 0) return;

  currentPlayer = player === 'orange' ? 'orange' : 'blue';

  blueScore = 0;
  orangeScore = 0;

  flippedCards = [];
  isChecking = false;

  updateScoreboard();
  renderBoard();

  settings.hidden = true;
  game.hidden = false;

  window.scrollTo(0, 0);

  console.log('Spiel gestartet:', {
    theme,
    player,
    boardSize,
  });
});

exitButton?.addEventListener('click', () => {
  if (!settings || !game) return;

  gameSession++;

  game.hidden = true;
  settings.hidden = false;

  window.scrollTo(0, 0);
});

console.log('Memory wurde erfolgreich geladen.');