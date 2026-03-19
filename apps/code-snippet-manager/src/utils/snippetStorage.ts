export interface Snippet {
  id: string;
  title: string;
  language: string;
  tags: string[];
  code: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'code-snippets';

let idCounter = 0;

export function generateSnippetId(): string {
  idCounter++;
  return `snippet-${Date.now()}-${idCounter}`;
}

export function getAll(): Snippet[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Snippet[];
  } catch {
    return [];
  }
}

export function save(snippets: Snippet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

export function create(snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Snippet {
  const now = new Date().toISOString();
  const newSnippet: Snippet = {
    ...snippet,
    id: generateSnippetId(),
    createdAt: now,
    updatedAt: now,
  };
  const all = getAll();
  all.unshift(newSnippet);
  save(all);
  return newSnippet;
}

export function update(id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>): Snippet | null {
  const all = getAll();
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const updated: Snippet = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  save(all);
  return updated;
}

export function remove(id: string): boolean {
  const all = getAll();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  save(filtered);
  return true;
}

export function search(query: string, snippets: Snippet[]): Snippet[] {
  if (!query.trim()) return snippets;

  const q = query.toLowerCase();
  return snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.language.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.code.toLowerCase().includes(q)
  );
}

export function filterByLanguage(language: string, snippets: Snippet[]): Snippet[] {
  if (!language) return snippets;
  return snippets.filter((s) => s.language === language);
}

export function filterByTag(tag: string, snippets: Snippet[]): Snippet[] {
  if (!tag) return snippets;
  return snippets.filter((s) => s.tags.includes(tag));
}

export function exportSnippets(snippets: Snippet[]): string {
  return JSON.stringify(snippets, null, 2);
}

export function importSnippets(json: string): Snippet[] | null {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return null;

    const valid = data.every(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        'title' in item &&
        'code' in item &&
        'language' in item
    );

    if (!valid) return null;

    return data as Snippet[];
  } catch {
    return null;
  }
}

export function getAllLanguages(snippets: Snippet[]): string[] {
  const languages = new Set(snippets.map((s) => s.language));
  return Array.from(languages).sort();
}

export function getAllTags(snippets: Snippet[]): string[] {
  const tags = new Set(snippets.flatMap((s) => s.tags));
  return Array.from(tags).sort();
}

export const COMMON_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C',
  'C++',
  'C#',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'Dart',
  'HTML',
  'CSS',
  'SQL',
  'Shell',
  'YAML',
  'JSON',
  'Markdown',
  'Other',
];
