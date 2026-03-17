import { describe, expect, test } from 'bun:test';
import { generateLoremIpsum } from '../loremIpsum';

describe('generateLoremIpsum', () => {
  describe('paragraphs', () => {
    test('generates specified number of paragraphs', () => {
      const result = generateLoremIpsum({ count: 3, unit: 'paragraphs', startWithLorem: false });
      const paragraphs = result.split('\n\n');
      expect(paragraphs.length).toBe(3);
    });

    test('starts with Lorem ipsum when enabled', () => {
      const result = generateLoremIpsum({ count: 1, unit: 'paragraphs', startWithLorem: true });
      expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
    });

    test('does not start with Lorem ipsum when disabled', () => {
      let startsWithLorem = true;
      for (let i = 0; i < 10; i++) {
        const result = generateLoremIpsum({ count: 1, unit: 'paragraphs', startWithLorem: false });
        if (!result.startsWith('Lorem ipsum')) {
          startsWithLorem = false;
          break;
        }
      }
      expect(startsWithLorem).toBe(false);
    });

    test('each paragraph contains sentences ending with period', () => {
      const result = generateLoremIpsum({ count: 2, unit: 'paragraphs', startWithLorem: false });
      const paragraphs = result.split('\n\n');
      for (const p of paragraphs) {
        expect(p.endsWith('.')).toBe(true);
      }
    });
  });

  describe('sentences', () => {
    test('generates specified number of sentences', () => {
      const result = generateLoremIpsum({ count: 5, unit: 'sentences', startWithLorem: false });
      const sentences = result.split('. ').length;
      expect(sentences).toBe(5);
    });

    test('starts with Lorem ipsum when enabled', () => {
      const result = generateLoremIpsum({ count: 3, unit: 'sentences', startWithLorem: true });
      expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
    });

    test('single sentence works', () => {
      const result = generateLoremIpsum({ count: 1, unit: 'sentences', startWithLorem: false });
      expect(result.endsWith('.')).toBe(true);
      expect(result.length).toBeGreaterThan(5);
    });
  });

  describe('words', () => {
    test('generates specified number of words', () => {
      const result = generateLoremIpsum({ count: 10, unit: 'words', startWithLorem: false });
      const words = result.split(' ');
      expect(words.length).toBe(10);
    });

    test('starts with Lorem ipsum words when enabled', () => {
      const result = generateLoremIpsum({ count: 5, unit: 'words', startWithLorem: true });
      expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
    });

    test('single word works', () => {
      const result = generateLoremIpsum({ count: 1, unit: 'words', startWithLorem: false });
      expect(result.split(' ').length).toBe(1);
      expect(result.length).toBeGreaterThan(0);
    });

    test('startWithLorem with fewer words than first sentence', () => {
      const result = generateLoremIpsum({ count: 3, unit: 'words', startWithLorem: true });
      expect(result).toBe('Lorem ipsum dolor');
    });

    test('startWithLorem words do not contain punctuation', () => {
      const result = generateLoremIpsum({ count: 6, unit: 'words', startWithLorem: true });
      expect(result).not.toContain(',');
      expect(result).not.toContain('.');
      expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('count 0 returns empty string', () => {
      expect(generateLoremIpsum({ count: 0, unit: 'paragraphs', startWithLorem: false })).toBe('');
    });

    test('negative count returns empty string', () => {
      expect(generateLoremIpsum({ count: -1, unit: 'words', startWithLorem: false })).toBe('');
    });

    test('large word count works', () => {
      const result = generateLoremIpsum({ count: 100, unit: 'words', startWithLorem: false });
      expect(result.split(' ').length).toBe(100);
    });
  });
});
