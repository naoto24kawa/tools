import { describe, it, expect } from 'vitest';
import { applyRename, splitFilename, applyBatchRename } from '../rename';

describe('splitFilename', () => {
  it('splits name and extension', () => {
    expect(splitFilename('photo.jpg')).toEqual({ base: 'photo', ext: '.jpg' });
    expect(splitFilename('file.tar.gz')).toEqual({ base: 'file.tar', ext: '.gz' });
    expect(splitFilename('noext')).toEqual({ base: 'noext', ext: '' });
  });

  it('handles dot at beginning', () => {
    expect(splitFilename('.gitignore')).toEqual({ base: '.gitignore', ext: '' });
  });
});

describe('applyRename', () => {
  it('adds prefix', () => {
    expect(applyRename('photo.jpg', 0, 'prefix', 'new_', '', 1)).toBe('new_photo.jpg');
  });

  it('adds suffix', () => {
    expect(applyRename('photo.jpg', 0, 'suffix', '_copy', '', 1)).toBe('photo_copy.jpg');
  });

  it('replaces text', () => {
    expect(applyRename('old_photo.jpg', 0, 'replace', 'new', 'old', 1)).toBe('new_photo.jpg');
  });

  it('replaces all occurrences', () => {
    expect(applyRename('a-b-c.txt', 0, 'replace', '_', '-', 1)).toBe('a_b_c.txt');
  });

  it('applies sequential numbering', () => {
    expect(applyRename('photo.jpg', 0, 'numbering', 'img_', '', 1)).toBe('img_001.jpg');
    expect(applyRename('photo.jpg', 1, 'numbering', 'img_', '', 1)).toBe('img_002.jpg');
  });

  it('respects start number', () => {
    expect(applyRename('photo.jpg', 0, 'numbering', 'img_', '', 10)).toBe('img_010.jpg');
  });

  it('handles files without extension', () => {
    expect(applyRename('Makefile', 0, 'prefix', 'new_', '', 1)).toBe('new_Makefile');
    expect(applyRename('Makefile', 0, 'suffix', '_old', '', 1)).toBe('Makefile_old');
  });
});

describe('applyBatchRename', () => {
  it('renames multiple files', () => {
    const result = applyBatchRename(
      ['a.txt', 'b.txt', 'c.txt'],
      'prefix',
      'doc_',
    );
    expect(result).toEqual([
      { original: 'a.txt', renamed: 'doc_a.txt' },
      { original: 'b.txt', renamed: 'doc_b.txt' },
      { original: 'c.txt', renamed: 'doc_c.txt' },
    ]);
  });

  it('applies numbering to batch', () => {
    const result = applyBatchRename(
      ['a.jpg', 'b.jpg'],
      'numbering',
      'photo_',
      '',
      1,
    );
    expect(result).toEqual([
      { original: 'a.jpg', renamed: 'photo_000001.jpg' },
      { original: 'b.jpg', renamed: 'photo_000002.jpg' },
    ]);
  });
});
