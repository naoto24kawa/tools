import { describe, expect, test } from 'bun:test';
import { formatMs } from '../stopwatch';

describe('formatMs', () => {
  test('zero', () => {
    expect(formatMs(0)).toBe('00:00.00');
  });
  test('seconds', () => {
    expect(formatMs(5000)).toBe('00:05.00');
  });
  test('minutes', () => {
    expect(formatMs(65000)).toBe('01:05.00');
  });
  test('hours', () => {
    expect(formatMs(3661000)).toBe('01:01:01.00');
  });
  test('centiseconds', () => {
    expect(formatMs(1230)).toBe('00:01.23');
  });
});
