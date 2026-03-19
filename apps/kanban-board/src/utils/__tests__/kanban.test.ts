import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addCard, deleteCard, moveCard, getColumnCards, type KanbanData } from '../kanbanStorage';

// Mock localStorage
const mockStorage: Record<string, string> = {};
beforeEach(() => {
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
  });
});

describe('addCard', () => {
  it('adds a card to the specified column', () => {
    const data: KanbanData = { cards: [] };
    const result = addCard(data, 'Test', 'Description', '#3b82f6', 'todo');
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].title).toBe('Test');
    expect(result.cards[0].columnId).toBe('todo');
  });
});

describe('deleteCard', () => {
  it('removes a card by id', () => {
    const data: KanbanData = { cards: [] };
    const withCard = addCard(data, 'Test', '', '#3b82f6', 'todo');
    const cardId = withCard.cards[0].id;
    const result = deleteCard(withCard, cardId);
    expect(result.cards).toHaveLength(0);
  });
});

describe('moveCard', () => {
  it('moves card from todo to inProgress', () => {
    const data: KanbanData = { cards: [] };
    const withCard = addCard(data, 'Test', '', '#3b82f6', 'todo');
    const cardId = withCard.cards[0].id;
    const result = moveCard(withCard, cardId, 'right');
    expect(result.cards[0].columnId).toBe('inProgress');
  });

  it('does not move beyond left boundary', () => {
    const data: KanbanData = { cards: [] };
    const withCard = addCard(data, 'Test', '', '#3b82f6', 'todo');
    const cardId = withCard.cards[0].id;
    const result = moveCard(withCard, cardId, 'left');
    expect(result.cards[0].columnId).toBe('todo');
  });

  it('does not move beyond right boundary', () => {
    const data: KanbanData = { cards: [] };
    const withCard = addCard(data, 'Test', '', '#3b82f6', 'done');
    const cardId = withCard.cards[0].id;
    const result = moveCard(withCard, cardId, 'right');
    expect(result.cards[0].columnId).toBe('done');
  });
});

describe('getColumnCards', () => {
  it('filters and sorts cards by column', () => {
    let data: KanbanData = { cards: [] };
    data = addCard(data, 'A', '', '#3b82f6', 'todo');
    data = addCard(data, 'B', '', '#3b82f6', 'todo');
    data = addCard(data, 'C', '', '#3b82f6', 'done');
    const todoCards = getColumnCards(data, 'todo');
    expect(todoCards).toHaveLength(2);
    const doneCards = getColumnCards(data, 'done');
    expect(doneCards).toHaveLength(1);
  });
});
