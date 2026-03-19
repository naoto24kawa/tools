import { describe, expect, it } from 'vitest';
import {
  generateChangelog,
  createEmptyVersion,
  createEmptyEntry,
  CATEGORIES,
  type VersionRelease,
} from '../changelogGenerator';

describe('generateChangelog', () => {
  it('generates header', () => {
    const result = generateChangelog([]);
    expect(result).toContain('# Changelog');
    expect(result).toContain('Keep a Changelog');
    expect(result).toContain('Semantic Versioning');
  });

  it('includes project name', () => {
    const result = generateChangelog([], 'My Project');
    expect(result).toContain('All notable changes to My Project');
  });

  it('generates version section', () => {
    const versions: VersionRelease[] = [
      {
        id: 'v1',
        version: '1.0.0',
        date: '2024-01-01',
        entries: [
          { id: 'e1', category: 'Added', description: 'Initial release' },
        ],
      },
    ];
    const result = generateChangelog(versions);
    expect(result).toContain('## [1.0.0] - 2024-01-01');
    expect(result).toContain('### Added');
    expect(result).toContain('- Initial release');
  });

  it('groups entries by category', () => {
    const versions: VersionRelease[] = [
      {
        id: 'v1',
        version: '1.0.0',
        date: '2024-01-01',
        entries: [
          { id: 'e1', category: 'Added', description: 'new feature' },
          { id: 'e2', category: 'Fixed', description: 'bug fix' },
          { id: 'e3', category: 'Added', description: 'another feature' },
        ],
      },
    ];
    const result = generateChangelog(versions);
    expect(result).toContain('### Added');
    expect(result).toContain('### Fixed');
    expect(result).toContain('- new feature');
    expect(result).toContain('- another feature');
    expect(result).toContain('- bug fix');
  });

  it('handles unreleased version', () => {
    const versions: VersionRelease[] = [
      {
        id: 'v1',
        version: '',
        date: '',
        entries: [
          { id: 'e1', category: 'Added', description: 'work in progress' },
        ],
      },
    ];
    const result = generateChangelog(versions);
    expect(result).toContain('## [Unreleased]');
  });

  it('generates multiple versions', () => {
    const versions: VersionRelease[] = [
      {
        id: 'v2',
        version: '2.0.0',
        date: '2024-06-01',
        entries: [{ id: 'e1', category: 'Changed', description: 'major update' }],
      },
      {
        id: 'v1',
        version: '1.0.0',
        date: '2024-01-01',
        entries: [{ id: 'e2', category: 'Added', description: 'initial' }],
      },
    ];
    const result = generateChangelog(versions);
    expect(result).toContain('## [2.0.0] - 2024-06-01');
    expect(result).toContain('## [1.0.0] - 2024-01-01');
  });

  it('ends with newline', () => {
    const result = generateChangelog([]);
    expect(result.endsWith('\n')).toBe(true);
  });
});

describe('CATEGORIES', () => {
  it('has 6 categories', () => {
    expect(CATEGORIES).toHaveLength(6);
  });

  it('includes expected categories', () => {
    expect(CATEGORIES).toContain('Added');
    expect(CATEGORIES).toContain('Changed');
    expect(CATEGORIES).toContain('Fixed');
    expect(CATEGORIES).toContain('Security');
  });
});

describe('createEmptyVersion', () => {
  it('creates a version with today date', () => {
    const version = createEmptyVersion();
    expect(version.version).toBe('');
    expect(version.date).toBeTruthy();
    expect(version.entries).toEqual([]);
    expect(version.id).toBeTruthy();
  });
});

describe('createEmptyEntry', () => {
  it('creates an entry with default category', () => {
    const entry = createEmptyEntry();
    expect(entry.category).toBe('Added');
    expect(entry.description).toBe('');
    expect(entry.id).toBeTruthy();
  });

  it('creates an entry with specified category', () => {
    const entry = createEmptyEntry('Fixed');
    expect(entry.category).toBe('Fixed');
  });
});
