import { describe, it, expect, beforeEach } from 'vitest';
import {
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  getColumnCards,
} from '../kanbanStorage';
import type { KanbanData } from '../kanbanStorage';

let data: KanbanData;

beforeEach(() => {
  data = { cards: [] };
  localStorage.clear();
});

describe('addCard', () => {
  it('adds a card to the specified column', () => {
    const result = addCard(data, 'Test Task', 'Description', '#ef4444');
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].title).toBe('Test Task');
    expect(result.cards[0].columnId).toBe('todo');
  });

  it('assigns incremental order', () => {
    const d1 = addCard(data, 'First', '', '#ef4444');
    const d2 = addCard(d1, 'Second', '', '#3b82f6');
    const cards = getColumnCards(d2, 'todo');
    expect(cards[0].order).toBeLessThan(cards[1].order);
  });
});

describe('updateCard', () => {
  it('updates card properties', () => {
    const d1 = addCard(data, 'Original', 'Desc', '#ef4444');
    const cardId = d1.cards[0].id;
    const d2 = updateCard(d1, cardId, { title: 'Updated', color: '#3b82f6' });
    expect(d2.cards[0].title).toBe('Updated');
    expect(d2.cards[0].color).toBe('#3b82f6');
    expect(d2.cards[0].description).toBe('Desc');
  });
});

describe('deleteCard', () => {
  it('removes the card', () => {
    const d1 = addCard(data, 'Delete me', '', '#ef4444');
    const d2 = deleteCard(d1, d1.cards[0].id);
    expect(d2.cards).toHaveLength(0);
  });
});

describe('moveCard', () => {
  it('moves card to the right', () => {
    const d1 = addCard(data, 'Move me', '', '#ef4444', 'todo');
    const d2 = moveCard(d1, d1.cards[0].id, 'right');
    expect(d2.cards[0].columnId).toBe('inProgress');
  });

  it('moves card to the left', () => {
    const d1 = addCard(data, 'Move me', '', '#ef4444', 'inProgress');
    const d2 = moveCard(d1, d1.cards[0].id, 'left');
    expect(d2.cards[0].columnId).toBe('todo');
  });

  it('does not move past boundaries', () => {
    const d1 = addCard(data, 'Stay', '', '#ef4444', 'todo');
    const d2 = moveCard(d1, d1.cards[0].id, 'left');
    expect(d2.cards[0].columnId).toBe('todo');

    const d3 = addCard(data, 'Stay Done', '', '#ef4444', 'done');
    const d4 = moveCard(d3, d3.cards[0].id, 'right');
    expect(d4.cards[0].columnId).toBe('done');
  });
});

describe('getColumnCards', () => {
  it('returns sorted cards for a column', () => {
    const d1 = addCard(data, 'A', '', '#ef4444', 'todo');
    const d2 = addCard(d1, 'B', '', '#3b82f6', 'todo');
    const d3 = addCard(d2, 'C', '', '#22c55e', 'inProgress');
    const todoCards = getColumnCards(d3, 'todo');
    expect(todoCards).toHaveLength(2);
    expect(todoCards[0].title).toBe('A');
    const inProgressCards = getColumnCards(d3, 'inProgress');
    expect(inProgressCards).toHaveLength(1);
  });
});
