export interface FlashCard {
  id: string;
  front: string;
  back: string;
  known: boolean;
}

export interface Deck {
  id: string;
  name: string;
  cards: FlashCard[];
  createdAt: number;
}

const STORAGE_KEY = 'flashcard-decks';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function loadDecks(): Deck[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDecks(decks: Deck[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function createDeck(name: string): Deck {
  return {
    id: generateId(),
    name,
    cards: [],
    createdAt: Date.now(),
  };
}

export function createCard(front: string, back: string): FlashCard {
  return {
    id: generateId(),
    front,
    back,
    known: false,
  };
}

export function getDeckStats(deck: Deck): { total: number; known: number; unknown: number } {
  const total = deck.cards.length;
  const known = deck.cards.filter((c) => c.known).length;
  return { total, known, unknown: total - known };
}
