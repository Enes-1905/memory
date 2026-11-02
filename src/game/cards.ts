import type { BoardSize, MemoryCard } from '../types/game';
import { cardBacks } from '../utils/assets';
import { dom } from '../ui/dom';
import { state } from './state';

/** Shuffles a copy of the cards using Fisher-Yates. */
function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

/** Creates the requested number of paired cards. */
export function createCards(images: string[], count: BoardSize): MemoryCard[] {
  const pairCount = count / 2;
  if (images.length < pairCount) return [];
  const pairs = images.slice(0, pairCount).flatMap((image, pairId) => [
    { id: pairId * 2, image, pairId, matched: false },
    { id: pairId * 2 + 1, image, pairId, matched: false },
  ]);
  return shuffleCards(pairs);
}

/** Renders the board with the same HTML classes as the original game. */
export function renderBoard(onFlip: (index: number) => void): void {
  if (!dom.board) return;
  dom.board.replaceChildren();
  dom.board.dataset.size = String(state.cards.length);
  state.cards.forEach((card, index) => {
    dom.board?.appendChild(createCardElement(card, index, onFlip));
  });
}

/** Creates a clickable card with front and back faces. */
function createCardElement(card: MemoryCard, index: number, onFlip: (index: number) => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'game__card';
  button.dataset.index = String(index);
  button.setAttribute('aria-label', 'Verdeckte Memory-Karte');
  const inner = document.createElement('span');
  inner.className = 'game__card-inner';
  inner.append(createCardFace('back', cardBacks[state.theme]), createCardFace('front', card.image));
  button.appendChild(inner);
  button.addEventListener('click', () => onFlip(index));
  return button;
}

/** Creates one image-bearing face of a memory card. */
function createCardFace(side: 'front' | 'back', imageUrl: string): HTMLSpanElement {
  const face = document.createElement('span');
  face.className = `game__card-${side}`;
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = '';
  face.appendChild(image);
  return face;
}

/** Sets a card's revealed state and accessible label. */
export function updateCard(index: number, revealed: boolean): void {
  const button = getCardButton(index);
  if (!button) return;
  button.classList.toggle('game__card--flipped', revealed);
  button.setAttribute('aria-label', revealed ? 'Aufgedeckte Memory-Karte' : 'Verdeckte Memory-Karte');
}

/** Finds the button corresponding to a card index. */
function getCardButton(index: number): HTMLButtonElement | null {
  return dom.board?.querySelector<HTMLButtonElement>(`.game__card[data-index="${index}"]`) ?? null;
}

/** Marks both cards of a found pair as matched. */
export function markPairMatched(first: number, second: number): void {
  getCardButton(first)?.classList.add('game__card--matched');
  getCardButton(second)?.classList.add('game__card--matched');
}
