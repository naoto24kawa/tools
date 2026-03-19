export type ColumnId = 'todo' | 'inProgress' | 'done';

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  color: string;
  columnId: ColumnId;
  order: number;
  createdAt: string;
}

export interface KanbanData {
  cards: KanbanCard[];
}

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'inProgress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

export const CARD_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
];

const STORAGE_KEY = 'kanban-board-data';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadData(): KanbanData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return { cards: [] };
}

export function saveData(data: KanbanData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getColumnCards(data: KanbanData, columnId: ColumnId): KanbanCard[] {
  return data.cards
    .filter((c) => c.columnId === columnId)
    .sort((a, b) => a.order - b.order);
}

export function addCard(
  data: KanbanData,
  title: string,
  description: string,
  color: string,
  columnId: ColumnId = 'todo'
): KanbanData {
  const columnCards = getColumnCards(data, columnId);
  const maxOrder = columnCards.length > 0 ? Math.max(...columnCards.map((c) => c.order)) : -1;
  const card: KanbanCard = {
    id: generateId(),
    title,
    description,
    color,
    columnId,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
  const updated = { cards: [...data.cards, card] };
  saveData(updated);
  return updated;
}

export function updateCard(
  data: KanbanData,
  cardId: string,
  updates: Partial<Pick<KanbanCard, 'title' | 'description' | 'color'>>
): KanbanData {
  const updated = {
    cards: data.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
  };
  saveData(updated);
  return updated;
}

export function deleteCard(data: KanbanData, cardId: string): KanbanData {
  const updated = { cards: data.cards.filter((c) => c.id !== cardId) };
  saveData(updated);
  return updated;
}

export function moveCard(
  data: KanbanData,
  cardId: string,
  direction: 'left' | 'right'
): KanbanData {
  const card = data.cards.find((c) => c.id === cardId);
  if (!card) return data;

  const columnOrder: ColumnId[] = ['todo', 'inProgress', 'done'];
  const currentIndex = columnOrder.indexOf(card.columnId);
  const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

  if (newIndex < 0 || newIndex >= columnOrder.length) return data;

  const newColumnId = columnOrder[newIndex];
  const targetCards = getColumnCards(data, newColumnId);
  const maxOrder = targetCards.length > 0 ? Math.max(...targetCards.map((c) => c.order)) : -1;

  const updated = {
    cards: data.cards.map((c) =>
      c.id === cardId ? { ...c, columnId: newColumnId, order: maxOrder + 1 } : c
    ),
  };
  saveData(updated);
  return updated;
}
