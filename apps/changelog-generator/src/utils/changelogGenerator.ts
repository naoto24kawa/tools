export type ChangeCategory = 'Added' | 'Changed' | 'Deprecated' | 'Removed' | 'Fixed' | 'Security';

export const CATEGORIES: ChangeCategory[] = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security',
];

export interface ChangeEntry {
  id: string;
  category: ChangeCategory;
  description: string;
}

export interface VersionRelease {
  id: string;
  version: string;
  date: string;
  entries: ChangeEntry[];
}

let nextId = 1;
export function generateId(): string {
  return `entry-${nextId++}`;
}

export function generateVersionId(): string {
  return `version-${nextId++}`;
}

export function formatDate(date: string): string {
  if (!date) return 'Unreleased';
  return date;
}

export function generateChangelog(versions: VersionRelease[], projectName?: string): string {
  const lines: string[] = [];

  lines.push('# Changelog');
  lines.push('');
  if (projectName) {
    lines.push(`All notable changes to ${projectName} will be documented in this file.`);
  } else {
    lines.push('All notable changes to this project will be documented in this file.');
  }
  lines.push('');
  lines.push(
    'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),'
  );
  lines.push(
    'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).'
  );
  lines.push('');

  for (const version of versions) {
    const dateStr = formatDate(version.date);
    if (version.version) {
      lines.push(`## [${version.version}] - ${dateStr}`);
    } else {
      lines.push('## [Unreleased]');
    }
    lines.push('');

    const grouped = groupByCategory(version.entries);

    for (const category of CATEGORIES) {
      const entries = grouped.get(category);
      if (entries && entries.length > 0) {
        lines.push(`### ${category}`);
        lines.push('');
        for (const entry of entries) {
          lines.push(`- ${entry.description}`);
        }
        lines.push('');
      }
    }
  }

  return lines.join('\n').trim() + '\n';
}

function groupByCategory(entries: ChangeEntry[]): Map<ChangeCategory, ChangeEntry[]> {
  const map = new Map<ChangeCategory, ChangeEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.category) || [];
    list.push(entry);
    map.set(entry.category, list);
  }
  return map;
}

export function createEmptyVersion(): VersionRelease {
  return {
    id: generateVersionId(),
    version: '',
    date: new Date().toISOString().split('T')[0],
    entries: [],
  };
}

export function createEmptyEntry(category: ChangeCategory = 'Added'): ChangeEntry {
  return {
    id: generateId(),
    category,
    description: '',
  };
}
