import { describe, it, expect } from 'vitest';
import { formatFileSize, formatDuration } from '../fileMetadata';

describe('formatFileSize', () => {
  it('should format 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500.00 B');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.00 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.00 GB');
  });
});

describe('formatDuration', () => {
  it('should format seconds only', () => {
    expect(formatDuration(30)).toBe('0:30');
  });

  it('should format minutes and seconds', () => {
    expect(formatDuration(90)).toBe('1:30');
  });

  it('should format hours, minutes, and seconds', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('should handle 0', () => {
    expect(formatDuration(0)).toBe('0:00');
  });
});
