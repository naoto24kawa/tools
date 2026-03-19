import { describe, it, expect } from 'vitest';
import { createDeck, createCard, getDeckStats, generateId } from '../flashcard';

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });

  it('returns unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('createDeck', () => {
  it('creates a deck with name and empty cards', () => {
    const deck = createDeck('Test');
    expect(deck.name).toBe('Test');
    expect(deck.cards).toEqual([]);
    expect(deck.id).toBeTruthy();
  });
});

describe('createCard', () => {
  it('creates a card with front and back', () => {
    const card = createCard('Q', 'A');
    expect(card.front).toBe('Q');
    expect(card.back).toBe('A');
    expect(card.known).toBe(false);
  });
});

describe('getDeckStats', () => {
  it('returns correct stats', () => {
    const deck = createDeck('Test');
    deck.cards = [
      createCard('A', 'B'),
      { ...createCard('C', 'D'), known: true },
      createCard('E', 'F'),
    ];
    const stats = getDeckStats(deck);
    expect(stats.total).toBe(3);
    expect(stats.known).toBe(1);
    expect(stats.unknown).toBe(2);
  });

  it('returns zeros for empty deck', () => {
    const deck = createDeck('Empty');
    const stats = getDeckStats(deck);
    expect(stats.total).toBe(0);
    expect(stats.known).toBe(0);
  });
});
