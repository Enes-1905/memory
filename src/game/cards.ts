import type { BoardSize, MemoryCard } from '../types/game';
import { cardBacks } from '../utils/assets';
import { dom } from '../ui/dom';
import { state } from './state';

/**
 * Shuffles a copy of the cards using the Fisher-Yates algorithm.
 *
 * @param cards - The array of memory cards to shuffle.
 * @returns A new array containing the shuffled cards.
 */
function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

/**
 * Creates the requested number of paired memory cards.
 *
 * @param images - The image URLs used for the card pairs.
 * @param count - The total number of cards on the board.
 * @returns An array of shuffled memory cards or an empty array if there are not enough images.
 */
export function createCards(images: string[], count: BoardSize): MemoryCard[] {
  const pairCount = count / 2;
  if (images.length < pairCount) return [];
  const pairs = images.slice(0, pairCount).flatMap((image, pairId) => [
    { id: pairId * 2, image, pairId, matched: false },
    { id: pairId * 2 + 1, image, pairId, matched: false },
  ]);
  return shuffleCards(pairs);
}

/**
 * Renders the memory board using the existing HTML classes.
 *
 * @param onFlip - Callback executed with the card index when a card is clicked.
 */
export function renderBoard(onFlip: (index: number) => void): void {
  if (!dom.board) return;
  dom.board.replaceChildren();
  dom.board.dataset.size = String(state.cards.length);
  state.cards.forEach((card, index) => {
    dom.board?.appendChild(createCardElement(card, index, onFlip));
  });
}

/**
 * Creates a clickable memory card with front and back faces.
 *
 * @param card - The memory card data used to create the element.
 * @param index - The position of the card on the board.
 * @param onFlip - Callback executed with the card index when the card is clicked.
 * @returns The button element representing the memory card.
 */
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

/**
 * Creates an image-bearing face for a memory card.
 *
 * @param side - Specifies whether the face is the front or back of the card.
 * @param imageUrl - The URL of the image displayed on the card face.
 * @returns The span element containing the card face image.
 */
function createCardFace(side: 'front' | 'back', imageUrl: string): HTMLSpanElement {
  const face = document.createElement('span');
  face.className = `game__card-${side}`;
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = '';
  face.appendChild(image);
  return face;
}

/**
 * Updates the revealed state and accessible label of a memory card.
 *
 * @param index - The position of the card on the board.
 * @param revealed - Whether the card should be displayed face up.
 */
export function updateCard(index: number, revealed: boolean): void {
  const button = getCardButton(index);
  if (!button) return;
  button.classList.toggle('game__card--flipped', revealed);
  button.setAttribute('aria-label', revealed ? 'Aufgedeckte Memory-Karte' : 'Verdeckte Memory-Karte');
}

/**
 * Finds the button element associated with a memory card index.
 *
 * @param index - The position of the card on the board.
 * @returns The matching card button or null if it does not exist.
 */
function getCardButton(index: number): HTMLButtonElement | null {
  return dom.board?.querySelector<HTMLButtonElement>(`.game__card[data-index="${index}"]`) ?? null;
}

/**
 * Marks two memory cards as a successfully matched pair.
 *
 * @param first - The index of the first matching card.
 * @param second - The index of the second matching card.
 */
export function markPairMatched(first: number, second: number): void {
  getCardButton(first)?.classList.add('game__card--matched');
  getCardButton(second)?.classList.add('game__card--matched');
}