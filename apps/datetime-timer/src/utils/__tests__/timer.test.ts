import { describe, expect, test } from 'vitest';
import { formatTime, parseMinutesToSeconds } from '../timer';

describe('timer', () => {
  test('formatTime seconds only', () => {
    expect(formatTime(45)).toBe('00:45');
  });
  test('formatTime minutes', () => {
    expect(formatTime(125)).toBe('02:05');
  });
  test('formatTime hours', () => {
    expect(formatTime(3661)).toBe('01:01:01');
  });
  test('formatTime zero', () => {
    expect(formatTime(0)).toBe('00:00');
  });
  test('parseMinutesToSeconds', () => {
    expect(parseMinutesToSeconds(5)).toBe(300);
  });
  test('parseMinutesToSeconds negative', () => {
    expect(parseMinutesToSeconds(-1)).toBe(0);
  });
  test('parseMinutesToSeconds decimal', () => {
    expect(parseMinutesToSeconds(1.5)).toBe(90);
  });
});
