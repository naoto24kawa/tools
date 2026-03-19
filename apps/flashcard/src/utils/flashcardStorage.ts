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
  createdAt: string;
}

export interface FlashcardData {
  decks: Deck[];
}

const STORAGE_KEY = 'flashcard-data';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadData(): FlashcardData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return { decks: [] };
}

export function saveData(data: FlashcardData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createDeck(data: FlashcardData, name: string): FlashcardData {
  const deck: Deck = {
    id: generateId(),
    name,
    cards: [],
    createdAt: new Date().toISOString(),
  };
  const updated = { decks: [...data.decks, deck] };
  saveData(updated);
  return updated;
}

export function deleteDeck(data: FlashcardData, deckId: string): FlashcardData {
  const updated = { decks: data.decks.filter((d) => d.id !== deckId) };
  saveData(updated);
  return updated;
}

export function renameDeck(
  data: FlashcardData,
  deckId: string,
  name: string
): FlashcardData {
  const updated = {
    decks: data.decks.map((d) => (d.id === deckId ? { ...d, name } : d)),
  };
  saveData(updated);
  return updated;
}

export function addCard(
  data: FlashcardData,
  deckId: string,
  front: string,
  back: string
): FlashcardData {
  const card: FlashCard = {
    id: generateId(),
    front,
    back,
    known: false,
  };
  const updated = {
    decks: data.decks.map((d) =>
      d.id === deckId ? { ...d, cards: [...d.cards, card] } : d
    ),
  };
  saveData(updated);
  return updated;
}

export function updateCard(
  data: FlashcardData,
  deckId: string,
  cardId: string,
  changes: Partial<Pick<FlashCard, 'front' | 'back' | 'known'>>
): FlashcardData {
  const updated = {
    decks: data.decks.map((d) =>
      d.id === deckId
        ? {
            ...d,
            cards: d.cards.map((c) => (c.id === cardId ? { ...c, ...changes } : c)),
          }
        : d
    ),
  };
  saveData(updated);
  return updated;
}

export function deleteCard(
  data: FlashcardData,
  deckId: string,
  cardId: string
): FlashcardData {
  const updated = {
    decks: data.decks.map((d) =>
      d.id === deckId
        ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
        : d
    ),
  };
  saveData(updated);
  return updated;
}

export function shuffleCards(cards: FlashCard[]): FlashCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getDeckProgress(deck: Deck): { known: number; total: number; percent: number } {
  const total = deck.cards.length;
  const known = deck.cards.filter((c) => c.known).length;
  return {
    known,
    total,
    percent: total > 0 ? Math.round((known / total) * 100) : 0,
  };
}

export function resetDeckProgress(
  data: FlashcardData,
  deckId: string
): FlashcardData {
  const updated = {
    decks: data.decks.map((d) =>
      d.id === deckId
        ? { ...d, cards: d.cards.map((c) => ({ ...c, known: false })) }
        : d
    ),
  };
  saveData(updated);
  return updated;
}

export function exportData(data: FlashcardData): string {
  return JSON.stringify(data, null, 2);
}

export function importData(jsonStr: string): FlashcardData {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.decks || !Array.isArray(parsed.decks)) {
    throw new Error('Invalid data format');
  }
  saveData(parsed);
  return parsed;
}
