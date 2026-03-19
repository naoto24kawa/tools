import { describe, it, expect } from 'vitest';
import {
  calculateWPM,
  calculateCPM,
  calculateAccuracy,
  getCharStatuses,
  getRandomText,
  SAMPLE_TEXTS_EN,
} from '../typingTest';

describe('calculateWPM', () => {
  it('returns 0 for zero duration', () => {
    expect(calculateWPM(50, 0)).toBe(0);
  });

  it('calculates correctly for 1 minute', () => {
    // 50 correct chars / 5 = 10 words / 1 min = 10 WPM
    expect(calculateWPM(50, 60000)).toBe(10);
  });
});

describe('calculateCPM', () => {
  it('returns 0 for zero duration', () => {
    expect(calculateCPM(50, 0)).toBe(0);
  });

  it('calculates correctly for 1 minute', () => {
    expect(calculateCPM(120, 60000)).toBe(120);
  });
});

describe('calculateAccuracy', () => {
  it('returns 100 for no typed chars', () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it('calculates 100% for perfect typing', () => {
    expect(calculateAccuracy(10, 10)).toBe(100);
  });

  it('calculates partial accuracy', () => {
    expect(calculateAccuracy(8, 10)).toBe(80);
  });
});

describe('getCharStatuses', () => {
  it('returns all pending for empty typed', () => {
    const statuses = getCharStatuses('abc', '', 0);
    expect(statuses[0].status).toBe('current');
    expect(statuses[1].status).toBe('pending');
    expect(statuses[2].status).toBe('pending');
  });

  it('marks correct and incorrect chars', () => {
    const statuses = getCharStatuses('abc', 'axc', 3);
    expect(statuses[0].status).toBe('correct');
    expect(statuses[1].status).toBe('incorrect');
    expect(statuses[2].status).toBe('correct');
  });
});

describe('getRandomText', () => {
  it('returns a text from the sample list', () => {
    const text = getRandomText('en');
    expect(SAMPLE_TEXTS_EN).toContain(text);
  });
});
