import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  addStroke,
  undo,
  redo,
  clearAll,
} from '../whiteboardEngine';
import type { Stroke } from '../whiteboardEngine';

const makeStroke = (tool: 'pen' | 'eraser' = 'pen'): Stroke => ({
  tool,
  points: [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
  ],
  color: '#000000',
  width: 2,
});

describe('createInitialState', () => {
  it('returns empty state', () => {
    const state = createInitialState();
    expect(state.strokes).toHaveLength(0);
    expect(state.undoneStrokes).toHaveLength(0);
  });
});

describe('addStroke', () => {
  it('adds a stroke and clears undo stack', () => {
    let state = createInitialState();
    state = addStroke(state, makeStroke());
    expect(state.strokes).toHaveLength(1);
    expect(state.undoneStrokes).toHaveLength(0);
  });
});

describe('undo', () => {
  it('undoes the last stroke', () => {
    let state = createInitialState();
    state = addStroke(state, makeStroke());
    state = addStroke(state, makeStroke());
    state = undo(state);
    expect(state.strokes).toHaveLength(1);
    expect(state.undoneStrokes).toHaveLength(1);
  });

  it('does nothing on empty state', () => {
    let state = createInitialState();
    state = undo(state);
    expect(state.strokes).toHaveLength(0);
    expect(state.undoneStrokes).toHaveLength(0);
  });
});

describe('redo', () => {
  it('redoes the last undone stroke', () => {
    let state = createInitialState();
    state = addStroke(state, makeStroke());
    state = undo(state);
    state = redo(state);
    expect(state.strokes).toHaveLength(1);
    expect(state.undoneStrokes).toHaveLength(0);
  });

  it('does nothing when nothing to redo', () => {
    let state = createInitialState();
    state = addStroke(state, makeStroke());
    state = redo(state);
    expect(state.strokes).toHaveLength(1);
  });
});

describe('clearAll', () => {
  it('resets to initial state', () => {
    let state = createInitialState();
    state = addStroke(state, makeStroke());
    state = addStroke(state, makeStroke());
    state = clearAll();
    expect(state.strokes).toHaveLength(0);
    expect(state.undoneStrokes).toHaveLength(0);
  });
});

describe('undo/redo interaction', () => {
  it('new stroke clears redo stack', () => {
    let state = createInitialState();
    state = addStroke(state, makeStroke());
    state = addStroke(state, makeStroke());
    state = undo(state);
    expect(state.undoneStrokes).toHaveLength(1);
    state = addStroke(state, makeStroke());
    expect(state.undoneStrokes).toHaveLength(0);
    expect(state.strokes).toHaveLength(2);
  });
});
