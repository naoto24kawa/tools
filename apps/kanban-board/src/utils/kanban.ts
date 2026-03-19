export type ColumnId = 'todo' | 'doing' | 'done';

export interface KanbanCard {
  id: string;
  title: string;
  createdAt: number;
}

export interface KanbanColumn {
  id: ColumnId;
  label: string;
  cards: KanbanCard[];
}

export type KanbanState = KanbanColumn[];

const STORAGE_KEY = 'kanban-board-data';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function createDefaultState(): KanbanState {
  return [
    { id: 'todo', label: 'To Do', cards: [] },
    { id: 'doing', label: 'In Progress', cards: [] },
    { id: 'done', label: 'Done', cards: [] },
  ];
}

export function loadState(): KanbanState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return createDefaultState();
}

export function saveState(state: KanbanState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addCard(state: KanbanState, columnId: ColumnId, title: string): KanbanState {
  const card: KanbanCard = { id: generateId(), title, createdAt: Date.now() };
  return state.map((col) =>
    col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
  );
}

export function removeCard(state: KanbanState, cardId: string): KanbanState {
  return state.map((col) => ({
    ...col,
    cards: col.cards.filter((c) => c.id !== cardId),
  }));
}

export function moveCard(
  state: KanbanState,
  cardId: string,
  direction: 'left' | 'right'
): KanbanState {
  const columnOrder: ColumnId[] = ['todo', 'doing', 'done'];
  let sourceIdx = -1;
  let card: KanbanCard | null = null;

  for (let i = 0; i < state.length; i++) {
    const found = state[i].cards.find((c) => c.id === cardId);
    if (found) {
      sourceIdx = columnOrder.indexOf(state[i].id);
      card = found;
      break;
    }
  }

  if (!card || sourceIdx === -1) return state;

  const targetIdx = direction === 'left' ? sourceIdx - 1 : sourceIdx + 1;
  if (targetIdx < 0 || targetIdx >= columnOrder.length) return state;

  const targetId = columnOrder[targetIdx];
  const newState = removeCard(state, cardId);
  return newState.map((col) =>
    col.id === targetId ? { ...col, cards: [...col.cards, card!] } : col
  );
}

export function getColumnIndex(columnId: ColumnId): number {
  const order: ColumnId[] = ['todo', 'doing', 'done'];
  return order.indexOf(columnId);
}
