import { describe, expect, test } from 'bun:test';
import { formatDuration } from '../screenRecorder';

describe('screenRecorder', () => {
  test('formatDuration seconds only', () => {
    expect(formatDuration(45)).toBe('0:45');
  });
  test('formatDuration with minutes', () => {
    expect(formatDuration(125)).toBe('2:05');
  });
  test('formatDuration with hours', () => {
    expect(formatDuration(3665)).toBe('1:01:05');
  });
  test('formatDuration zero', () => {
    expect(formatDuration(0)).toBe('0:00');
  });
});
