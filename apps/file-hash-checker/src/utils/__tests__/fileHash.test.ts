import { describe, it, expect } from 'vitest';
import { compareHashes } from '../fileHash';

describe('compareHashes', () => {
  it('should match identical hashes', () => {
    expect(compareHashes('abc123', 'abc123')).toBe(true);
  });

  it('should match case-insensitively', () => {
    expect(compareHashes('ABC123', 'abc123')).toBe(true);
  });

  it('should trim whitespace', () => {
    expect(compareHashes('  abc123  ', 'abc123')).toBe(true);
  });

  it('should not match different hashes', () => {
    expect(compareHashes('abc123', 'def456')).toBe(false);
  });

  it('should not match partial hashes', () => {
    expect(compareHashes('abc', 'abc123')).toBe(false);
  });
});
