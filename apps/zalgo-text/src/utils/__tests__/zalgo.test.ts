import { describe, it, expect } from 'vitest';
import { addZalgo, removeZalgo, countCombiningChars } from '../zalgo';

describe('addZalgo', () => {
  it('adds combining characters to text', () => {
    const result = addZalgo('Hello', { intensity: 50 });
    expect(result.length).toBeGreaterThan('Hello'.length);
  });

  it('preserves original characters', () => {
    const result = addZalgo('ABC', { intensity: 30 });
    const cleaned = removeZalgo(result);
    expect(cleaned).toBe('ABC');
  });

  it('respects intensity', () => {
    const low = addZalgo('A', { intensity: 10 });
    const high = addZalgo('A', { intensity: 100 });
    expect(high.length).toBeGreaterThanOrEqual(low.length);
  });

  it('respects above/middle/below options', () => {
    const aboveOnly = addZalgo('A', { intensity: 50, above: true, middle: false, below: false });
    expect(aboveOnly.length).toBeGreaterThan(1);
  });

  it('handles empty string', () => {
    expect(addZalgo('')).toBe('');
  });
});

describe('removeZalgo', () => {
  it('removes combining characters', () => {
    const zalgoText = addZalgo('Hello World', { intensity: 80 });
    expect(removeZalgo(zalgoText)).toBe('Hello World');
  });

  it('returns clean text as-is', () => {
    expect(removeZalgo('Hello')).toBe('Hello');
  });
});

describe('countCombiningChars', () => {
  it('counts combining characters', () => {
    expect(countCombiningChars('Hello')).toBe(0);
    const zalgo = addZalgo('A', { intensity: 50 });
    expect(countCombiningChars(zalgo)).toBeGreaterThan(0);
  });
});
