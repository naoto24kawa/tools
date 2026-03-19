export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
}

const STORAGE_KEY = 'bookmark-manager-data';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadBookmarks(): Bookmark[] {
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

export function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function addBookmark(
  bookmarks: Bookmark[],
  url: string,
  title: string,
  description: string,
  tags: string[]
): Bookmark[] {
  const bookmark: Bookmark = {
    id: generateId(),
    url,
    title,
    description,
    tags: tags.map((t) => t.trim()).filter(Boolean),
    createdAt: new Date().toISOString(),
  };
  const updated = [bookmark, ...bookmarks];
  saveBookmarks(updated);
  return updated;
}

export function updateBookmark(
  bookmarks: Bookmark[],
  bookmarkId: string,
  changes: Partial<Pick<Bookmark, 'url' | 'title' | 'description' | 'tags'>>
): Bookmark[] {
  const updated = bookmarks.map((b) =>
    b.id === bookmarkId
      ? {
          ...b,
          ...changes,
          tags: changes.tags
            ? changes.tags.map((t) => t.trim()).filter(Boolean)
            : b.tags,
        }
      : b
  );
  saveBookmarks(updated);
  return updated;
}

export function deleteBookmark(bookmarks: Bookmark[], bookmarkId: string): Bookmark[] {
  const updated = bookmarks.filter((b) => b.id !== bookmarkId);
  saveBookmarks(updated);
  return updated;
}

export function getAllTags(bookmarks: Bookmark[]): string[] {
  const tagSet = new Set<string>();
  bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  searchQuery: string,
  selectedTags: string[]
): Bookmark[] {
  let filtered = bookmarks;

  if (searchQuery.trim()) {
    const lower = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.url.toLowerCase().includes(lower) ||
        b.description.toLowerCase().includes(lower) ||
        b.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  if (selectedTags.length > 0) {
    filtered = filtered.filter((b) => selectedTags.some((t) => b.tags.includes(t)));
  }

  return filtered;
}

export function exportAsJson(bookmarks: Bookmark[]): string {
  return JSON.stringify(bookmarks, null, 2);
}

export function importFromJson(jsonStr: string): Bookmark[] {
  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid JSON format');
  }
  for (const item of parsed) {
    if (!item.url || !item.title) {
      throw new Error('Invalid bookmark format');
    }
  }
  return parsed;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

export function exportAsNetscapeHtml(bookmarks: Bookmark[]): string {
  const lines: string[] = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<!-- This is an automatically generated file.',
    '     It will be read and overwritten.',
    '     DO NOT EDIT! -->',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>Bookmarks</TITLE>',
    '<H1>Bookmarks</H1>',
    '<DL><p>',
  ];

  const tagGroups = new Map<string, Bookmark[]>();
  const untagged: Bookmark[] = [];

  bookmarks.forEach((b) => {
    if (b.tags.length === 0) {
      untagged.push(b);
    } else {
      b.tags.forEach((tag) => {
        if (!tagGroups.has(tag)) tagGroups.set(tag, []);
        tagGroups.get(tag)!.push(b);
      });
    }
  });

  const addDate = (b: Bookmark) => Math.floor(new Date(b.createdAt).getTime() / 1000);

  tagGroups.forEach((items, tag) => {
    lines.push(`    <DT><H3>${escapeHtml(tag)}</H3>`);
    lines.push('    <DL><p>');
    const seen = new Set<string>();
    items.forEach((b) => {
      if (seen.has(b.id)) return;
      seen.add(b.id);
      lines.push(
        `        <DT><A HREF="${escapeHtml(b.url)}" ADD_DATE="${addDate(b)}">${escapeHtml(b.title)}</A>`
      );
      if (b.description) {
        lines.push(`        <DD>${escapeHtml(b.description)}`);
      }
    });
    lines.push('    </DL><p>');
  });

  untagged.forEach((b) => {
    lines.push(
      `    <DT><A HREF="${escapeHtml(b.url)}" ADD_DATE="${addDate(b)}">${escapeHtml(b.title)}</A>`
    );
    if (b.description) {
      lines.push(`    <DD>${escapeHtml(b.description)}`);
    }
  });

  lines.push('</DL><p>');
  return lines.join('\n');
}

export function importFromNetscapeHtml(html: string): Bookmark[] {
  const bookmarks: Bookmark[] = [];
  let currentFolder = '';
  const lines = html.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const folderMatch = line.match(/<H3[^>]*>([^<]*)<\/H3>/i);
    if (folderMatch) {
      currentFolder = unescapeHtml(folderMatch[1]);
      continue;
    }

    if (line.includes('</DL>')) {
      currentFolder = '';
    }

    const linkMatch = line.match(/<A[^>]+HREF="([^"]*)"[^>]*>([^<]*)<\/A>/i);
    if (linkMatch) {
      const url = unescapeHtml(linkMatch[1]);
      const title = unescapeHtml(linkMatch[2]);
      let description = '';

      if (i + 1 < lines.length) {
        const ddMatch = lines[i + 1].match(/<DD>([^<\n]*)/i);
        if (ddMatch) {
          description = unescapeHtml(ddMatch[1].trim());
        }
      }

      bookmarks.push({
        id: generateId(),
        url,
        title,
        description,
        tags: currentFolder ? [currentFolder] : [],
        createdAt: new Date().toISOString(),
      });
    }
  }

  return bookmarks;
}
