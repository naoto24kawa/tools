import { describe, it, expect } from 'vitest';
import { textToNato, textToNatoString, natoToText, getReferenceTable } from '../nato';

describe('textToNato', () => {
  it('converts letters to NATO entries', () => {
    const result = textToNato('ABC');
    expect(result).toEqual([
      { char: 'A', nato: 'Alfa' },
      { char: 'B', nato: 'Bravo' },
      { char: 'C', nato: 'Charlie' },
    ]);
  });

  it('handles lowercase', () => {
    const result = textToNato('abc');
    expect(result[0].nato).toBe('Alfa');
    expect(result[1].nato).toBe('Bravo');
  });

  it('handles numbers', () => {
    const result = textToNato('123');
    expect(result[0].nato).toBe('One');
    expect(result[1].nato).toBe('Two');
    expect(result[2].nato).toBe('Three');
  });

  it('passes through special characters', () => {
    const result = textToNato('!');
    expect(result[0].nato).toBe('!');
  });
});

describe('textToNatoString', () => {
  it('converts text to NATO string', () => {
    expect(textToNatoString('SOS')).toBe('Sierra Oscar Sierra');
  });

  it('handles spaces', () => {
    expect(textToNatoString('A B')).toBe('Alfa (space) Bravo');
  });
});

describe('natoToText', () => {
  it('converts NATO words back to text', () => {
    expect(natoToText('Sierra Oscar Sierra')).toBe('SOS');
  });

  it('handles (space)', () => {
    expect(natoToText('Alfa (space) Bravo')).toBe('A B');
  });

  it('handles case insensitive', () => {
    expect(natoToText('ALFA bravo CHARLIE')).toBe('ABC');
  });
});

describe('getReferenceTable', () => {
  it('returns all 36 entries (26 letters + 10 digits)', () => {
    const table = getReferenceTable();
    expect(table.length).toBe(36);
    expect(table[0]).toEqual({ char: 'A', nato: 'Alfa' });
  });
});
