export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'note-pad-data';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function createNote(notes: Note[], title: string = 'Untitled'): Note[] {
  const now = new Date().toISOString();
  const note: Note = {
    id: generateId(),
    title,
    content: '',
    createdAt: now,
    updatedAt: now,
  };
  const updated = [note, ...notes];
  saveNotes(updated);
  return updated;
}

export function updateNote(
  notes: Note[],
  noteId: string,
  changes: Partial<Pick<Note, 'title' | 'content'>>
): Note[] {
  const updated = notes.map((n) =>
    n.id === noteId ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
  );
  saveNotes(updated);
  return updated;
}

export function deleteNote(notes: Note[], noteId: string): Note[] {
  const updated = notes.filter((n) => n.id !== noteId);
  saveNotes(updated);
  return updated;
}

export function searchNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;
  const lower = query.toLowerCase();
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(lower) || n.content.toLowerCase().includes(lower)
  );
}

export function exportAsMarkdown(note: Note): void {
  const content = `# ${note.title}\n\n${note.content}`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importMarkdownFile(file: File): Promise<{ title: string; content: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      let title = file.name.replace(/\.md$/, '');
      let content = text;

      // Extract title from first heading
      if (lines[0]?.startsWith('# ')) {
        title = lines[0].slice(2).trim();
        content = lines.slice(1).join('\n').trimStart();
      }

      resolve({ title, content });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
