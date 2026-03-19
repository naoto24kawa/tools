import { describe, it, expect } from 'vitest';
import { applyRules, getExtension, getBaseName } from '../fileRename';

describe('getExtension', () => {
  it('should return extension', () => {
    expect(getExtension('photo.jpg')).toBe('jpg');
    expect(getExtension('document.pdf')).toBe('pdf');
  });

  it('should handle no extension', () => {
    expect(getExtension('README')).toBe('');
  });

  it('should handle multiple dots', () => {
    expect(getExtension('archive.tar.gz')).toBe('gz');
  });
});

describe('getBaseName', () => {
  it('should return base name', () => {
    expect(getBaseName('photo.jpg')).toBe('photo');
  });

  it('should handle no extension', () => {
    expect(getBaseName('README')).toBe('README');
  });
});

describe('applyRules', () => {
  it('should apply prefix rule', () => {
    const result = applyRules(['photo.jpg'], [{ type: 'prefix', prefix: 'new_' }]);
    expect(result[0].renamed).toBe('new_photo.jpg');
  });

  it('should apply suffix rule', () => {
    const result = applyRules(['photo.jpg'], [{ type: 'suffix', suffix: '_edited' }]);
    expect(result[0].renamed).toBe('photo_edited.jpg');
  });

  it('should apply replace rule', () => {
    const result = applyRules(
      ['old_photo.jpg'],
      [{ type: 'replace', find: 'old', replaceWith: 'new' }],
    );
    expect(result[0].renamed).toBe('new_photo.jpg');
  });

  it('should apply numbering rule', () => {
    const result = applyRules(
      ['a.jpg', 'b.jpg', 'c.jpg'],
      [{ type: 'numbering', startNumber: 1, padding: 3 }],
    );
    expect(result[0].renamed).toBe('001_a.jpg');
    expect(result[1].renamed).toBe('002_b.jpg');
    expect(result[2].renamed).toBe('003_c.jpg');
  });

  it('should apply date-prepend rule', () => {
    const result = applyRules(['photo.jpg'], [{ type: 'date-prepend' }]);
    // Should start with a date pattern
    expect(result[0].renamed).toMatch(/^\d{4}-\d{2}-\d{2}_photo\.jpg$/);
  });

  it('should apply multiple rules in sequence', () => {
    const result = applyRules(
      ['photo.jpg'],
      [
        { type: 'prefix', prefix: 'img_' },
        { type: 'suffix', suffix: '_v2' },
      ],
    );
    expect(result[0].renamed).toBe('img_photo_v2.jpg');
  });
});
