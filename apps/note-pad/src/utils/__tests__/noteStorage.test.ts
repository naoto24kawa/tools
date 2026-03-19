import { describe, it, expect, beforeEach } from 'vitest';
import { createNote, updateNote, deleteNote, searchNotes } from '../noteStorage';
import type { Note } from '../noteStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('createNote', () => {
  it('creates a note with default title', () => {
    const notes = createNote([], undefined);
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('Untitled');
    expect(notes[0].content).toBe('');
  });

  it('creates a note with custom title', () => {
    const notes = createNote([], 'My Note');
    expect(notes[0].title).toBe('My Note');
  });

  it('prepends new note to list', () => {
    const n1 = createNote([], 'First');
    const n2 = createNote(n1, 'Second');
    expect(n2[0].title).toBe('Second');
    expect(n2[1].title).toBe('First');
  });
});

describe('updateNote', () => {
  it('updates title', () => {
    const notes = createNote([], 'Original');
    const updated = updateNote(notes, notes[0].id, { title: 'Updated' });
    expect(updated[0].title).toBe('Updated');
  });

  it('updates content', () => {
    const notes = createNote([], 'Test');
    const updated = updateNote(notes, notes[0].id, { content: 'Hello world' });
    expect(updated[0].content).toBe('Hello world');
  });
});

describe('deleteNote', () => {
  it('removes the note', () => {
    const notes = createNote([], 'Delete me');
    const deleted = deleteNote(notes, notes[0].id);
    expect(deleted).toHaveLength(0);
  });
});

describe('searchNotes', () => {
  it('returns all notes for empty query', () => {
    const notes = createNote([], 'Test');
    expect(searchNotes(notes, '')).toHaveLength(1);
  });

  it('filters by title', () => {
    let notes = createNote([], 'Apple');
    notes = createNote(notes, 'Banana');
    expect(searchNotes(notes, 'apple')).toHaveLength(1);
    expect(searchNotes(notes, 'apple')[0].title).toBe('Apple');
  });

  it('filters by content', () => {
    const notes = createNote([], 'Test');
    const updated = updateNote(notes, notes[0].id, { content: 'unique keyword here' });
    expect(searchNotes(updated, 'unique')).toHaveLength(1);
  });
});
