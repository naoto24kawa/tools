import { describe, expect, test } from 'bun:test';
import { tokenize } from '../syntaxHighlight';

describe('syntaxHighlight', () => {
  describe('tokenize', () => {
    test('should highlight JavaScript keywords', () => {
      const tokens = tokenize('const x = 1;', 'javascript');
      const keywordToken = tokens.find((t) => t.className === 'keyword');
      expect(keywordToken).toBeDefined();
      expect(keywordToken?.text).toBe('const');
    });

    test('should highlight strings', () => {
      const tokens = tokenize('const msg = "hello";', 'javascript');
      const stringToken = tokens.find((t) => t.className === 'string');
      expect(stringToken).toBeDefined();
      expect(stringToken?.text).toBe('"hello"');
    });

    test('should highlight comments', () => {
      const tokens = tokenize('// this is a comment', 'javascript');
      const commentToken = tokens.find((t) => t.className === 'comment');
      expect(commentToken).toBeDefined();
      expect(commentToken?.text).toBe('// this is a comment');
    });

    test('should return empty array for empty input', () => {
      const tokens = tokenize('', 'javascript');
      expect(tokens).toEqual([]);
    });
  });
});
