import { describe, expect, test } from 'vitest';
import { formatTs, minifyTs } from '../tsFormatter';

describe('TypeScript Formatter Utils', () => {
  describe('formatTs', () => {
    test('should format a simple function with braces and semicolons', () => {
      const input = 'function greet(name: string){console.log(name);return name;}';
      const result = formatTs(input, 2);
      expect(result).toContain('function greet(name: string) {');
      expect(result).toContain('  console.log(name);');
      expect(result).toContain('  return name;');
      expect(result).toContain('}');
    });

    test('should preserve string contents without formatting', () => {
      const input = "const msg = 'hello { world }; test, value';";
      const result = formatTs(input, 2);
      expect(result).toContain("'hello { world }; test, value'");
    });

    test('should handle nested braces with correct indentation', () => {
      const input = 'if(a){if(b){doSomething();}}';
      const result = formatTs(input, 2);
      const lines = result.split('\n');
      // Verify nested indentation exists
      const hasDoubleIndent = lines.some((line) => line.startsWith('    '));
      expect(hasDoubleIndent).toBe(true);
    });

    test('should return empty string for empty or whitespace-only input', () => {
      expect(formatTs('')).toBe('');
      expect(formatTs('   ')).toBe('');
      expect(formatTs('\n\n')).toBe('');
    });
  });

  describe('minifyTs', () => {
    test('should remove comments and collapse whitespace', () => {
      const input = `
// This is a comment
const x = 1;  /* inline comment */
const y = 2;
`;
      const result = minifyTs(input);
      expect(result).not.toContain('//');
      expect(result).not.toContain('/*');
      expect(result).toContain('const x=1;');
      expect(result).toContain('const y=2;');
    });

    test('should preserve string contents during minification', () => {
      const input = "const msg = 'hello   world';";
      const result = minifyTs(input);
      expect(result).toContain("'hello   world'");
    });

    test('should keep spaces between keywords and identifiers', () => {
      const input = 'const foo = 1; let bar = 2; return foo;';
      const result = minifyTs(input);
      expect(result).toContain('const foo');
      expect(result).toContain('let bar');
      expect(result).toContain('return foo');
    });

    test('should return empty string for empty input', () => {
      expect(minifyTs('')).toBe('');
      expect(minifyTs('   ')).toBe('');
    });
  });
});
