import { describe, it, expect } from 'vitest';
import {
  calculateWPM,
  calculateCPM,
  calculateAccuracy,
  getCharStatuses,
  getRandomText,
} from '../typingTest';

describe('calculateWPM', () => {
  it('returns 0 for 0 duration', () => {
    expect(calculateWPM(100, 0)).toBe(0);
  });

  it('calculates WPM correctly', () => {
    // 250 correct chars in 60 seconds = 250/5 = 50 WPM
    expect(calculateWPM(250, 60000)).toBe(50);
  });

  it('handles partial minutes', () => {
    // 125 correct chars in 30 seconds (0.5 min) = 125/5/0.5 = 50 WPM
    expect(calculateWPM(125, 30000)).toBe(50);
  });
});

describe('calculateCPM', () => {
  it('returns 0 for 0 duration', () => {
    expect(calculateCPM(100, 0)).toBe(0);
  });

  it('calculates CPM correctly', () => {
    // 300 chars in 60 seconds = 300 CPM
    expect(calculateCPM(300, 60000)).toBe(300);
  });
});

describe('calculateAccuracy', () => {
  it('returns 100 for 0 typed', () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it('calculates accuracy correctly', () => {
    expect(calculateAccuracy(90, 100)).toBe(90);
  });

  it('returns 100 for perfect typing', () => {
    expect(calculateAccuracy(50, 50)).toBe(100);
  });
});

describe('getCharStatuses', () => {
  it('marks all as pending when nothing is typed', () => {
    const statuses = getCharStatuses('hello', '', 0);
    expect(statuses[0].status).toBe('current');
    expect(statuses[1].status).toBe('pending');
  });

  it('marks correct characters', () => {
    const statuses = getCharStatuses('hello', 'hel', 3);
    expect(statuses[0].status).toBe('correct');
    expect(statuses[1].status).toBe('correct');
    expect(statuses[2].status).toBe('correct');
    expect(statuses[3].status).toBe('current');
  });

  it('marks incorrect characters', () => {
    const statuses = getCharStatuses('hello', 'hxl', 3);
    expect(statuses[0].status).toBe('correct');
    expect(statuses[1].status).toBe('incorrect');
    expect(statuses[2].status).toBe('correct');
  });
});

describe('getRandomText', () => {
  it('returns a non-empty English text', () => {
    const text = getRandomText('en');
    expect(text.length).toBeGreaterThan(0);
  });

  it('returns a non-empty Japanese text', () => {
    const text = getRandomText('ja');
    expect(text.length).toBeGreaterThan(0);
  });
});
