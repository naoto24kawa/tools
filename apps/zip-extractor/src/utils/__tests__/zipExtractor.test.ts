import { describe, it, expect } from 'vitest';
import { formatSize } from '../zipExtractor';

describe('formatSize', () => {
  it('should format 0 bytes', () => {
    expect(formatSize(0)).toBe('0 B');
  });

  it('should format bytes', () => {
    expect(formatSize(512)).toBe('512.0 B');
  });

  it('should format kilobytes', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
  });

  it('should format megabytes', () => {
    expect(formatSize(1048576)).toBe('1.0 MB');
  });
});
