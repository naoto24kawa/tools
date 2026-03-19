import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDeck,
  deleteDeck,
  renameDeck,
  addCard,
  updateCard,
  deleteCard,
  shuffleCards,
  getDeckProgress,
  resetDeckProgress,
  exportData,
  importData,
} from '../flashcardStorage';
import type { FlashcardData } from '../flashcardStorage';

let data: FlashcardData;

beforeEach(() => {
  data = { decks: [] };
  localStorage.clear();
});

describe('createDeck', () => {
  it('creates a new deck', () => {
    const result = createDeck(data, 'My Deck');
    expect(result.decks).toHaveLength(1);
    expect(result.decks[0].name).toBe('My Deck');
    expect(result.decks[0].cards).toHaveLength(0);
  });
});

describe('deleteDeck', () => {
  it('removes a deck', () => {
    const d1 = createDeck(data, 'Delete me');
    const d2 = deleteDeck(d1, d1.decks[0].id);
    expect(d2.decks).toHaveLength(0);
  });
});

describe('renameDeck', () => {
  it('renames a deck', () => {
    const d1 = createDeck(data, 'Old Name');
    const d2 = renameDeck(d1, d1.decks[0].id, 'New Name');
    expect(d2.decks[0].name).toBe('New Name');
  });
});

describe('addCard', () => {
  it('adds a card to a deck', () => {
    const d1 = createDeck(data, 'Deck');
    const d2 = addCard(d1, d1.decks[0].id, 'Front', 'Back');
    expect(d2.decks[0].cards).toHaveLength(1);
    expect(d2.decks[0].cards[0].front).toBe('Front');
    expect(d2.decks[0].cards[0].back).toBe('Back');
    expect(d2.decks[0].cards[0].known).toBe(false);
  });
});

describe('updateCard', () => {
  it('updates card properties', () => {
    const d1 = createDeck(data, 'Deck');
    const d2 = addCard(d1, d1.decks[0].id, 'F', 'B');
    const cardId = d2.decks[0].cards[0].id;
    const d3 = updateCard(d2, d2.decks[0].id, cardId, { known: true });
    expect(d3.decks[0].cards[0].known).toBe(true);
  });
});

describe('deleteCard', () => {
  it('removes a card', () => {
    const d1 = createDeck(data, 'Deck');
    const d2 = addCard(d1, d1.decks[0].id, 'F', 'B');
    const cardId = d2.decks[0].cards[0].id;
    const d3 = deleteCard(d2, d2.decks[0].id, cardId);
    expect(d3.decks[0].cards).toHaveLength(0);
  });
});

describe('shuffleCards', () => {
  it('returns same length array', () => {
    const cards = [
      { id: '1', front: 'A', back: 'a', known: false },
      { id: '2', front: 'B', back: 'b', known: false },
      { id: '3', front: 'C', back: 'c', known: false },
    ];
    const shuffled = shuffleCards(cards);
    expect(shuffled).toHaveLength(3);
  });

  it('does not mutate original', () => {
    const cards = [
      { id: '1', front: 'A', back: 'a', known: false },
      { id: '2', front: 'B', back: 'b', known: false },
    ];
    const shuffled = shuffleCards(cards);
    expect(shuffled).not.toBe(cards);
  });
});

describe('getDeckProgress', () => {
  it('returns 0 for empty deck', () => {
    const d1 = createDeck(data, 'Deck');
    const progress = getDeckProgress(d1.decks[0]);
    expect(progress).toEqual({ known: 0, total: 0, percent: 0 });
  });

  it('calculates progress correctly', () => {
    const d1 = createDeck(data, 'Deck');
    let d2 = addCard(d1, d1.decks[0].id, 'F1', 'B1');
    d2 = addCard(d2, d2.decks[0].id, 'F2', 'B2');
    const cardId = d2.decks[0].cards[0].id;
    const d3 = updateCard(d2, d2.decks[0].id, cardId, { known: true });
    const progress = getDeckProgress(d3.decks[0]);
    expect(progress.known).toBe(1);
    expect(progress.total).toBe(2);
    expect(progress.percent).toBe(50);
  });
});

describe('resetDeckProgress', () => {
  it('sets all cards to unknown', () => {
    const d1 = createDeck(data, 'Deck');
    let d2 = addCard(d1, d1.decks[0].id, 'F', 'B');
    const cardId = d2.decks[0].cards[0].id;
    d2 = updateCard(d2, d2.decks[0].id, cardId, { known: true });
    const d3 = resetDeckProgress(d2, d2.decks[0].id);
    expect(d3.decks[0].cards[0].known).toBe(false);
  });
});

describe('exportData / importData', () => {
  it('round-trips data', () => {
    const d1 = createDeck(data, 'Test Deck');
    const d2 = addCard(d1, d1.decks[0].id, 'Hello', 'World');
    const json = exportData(d2);
    const imported = importData(json);
    expect(imported.decks[0].name).toBe('Test Deck');
    expect(imported.decks[0].cards[0].front).toBe('Hello');
  });

  it('throws on invalid data', () => {
    expect(() => importData('{"invalid": true}')).toThrow('Invalid data format');
  });
});
