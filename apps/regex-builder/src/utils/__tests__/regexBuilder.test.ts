import { describe, expect, it } from 'vitest';
import {
  buildFlagsString,
  buildRegexString,
  createBlock,
  escapeRegex,
  testRegex,
} from '../regexBuilder';

describe('createBlock', () => {
  it('creates a block with unique id', () => {
    const block1 = createBlock('literal', 'hello', 'hello');
    const block2 = createBlock('literal', 'world', 'world');
    expect(block1.id).not.toBe(block2.id);
  });

  it('sets type and value correctly', () => {
    const block = createBlock('character-class', '\\d', 'Digit');
    expect(block.type).toBe('character-class');
    expect(block.value).toBe('\\d');
    expect(block.label).toBe('Digit');
  });
});

describe('buildRegexString', () => {
  it('joins block values', () => {
    const blocks = [
      createBlock('anchor', '^', 'Start'),
      createBlock('literal', 'hello', 'hello'),
      createBlock('anchor', '$', 'End'),
    ];
    expect(buildRegexString(blocks)).toBe('^hello$');
  });

  it('returns empty string for no blocks', () => {
    expect(buildRegexString([])).toBe('');
  });
});

describe('buildFlagsString', () => {
  it('builds all flags', () => {
    const result = buildFlagsString({
      global: true,
      caseInsensitive: true,
      multiline: true,
      dotAll: true,
    });
    expect(result).toBe('gims');
  });

  it('builds partial flags', () => {
    const result = buildFlagsString({
      global: true,
      caseInsensitive: false,
      multiline: true,
      dotAll: false,
    });
    expect(result).toBe('gm');
  });

  it('returns empty for no flags', () => {
    const result = buildFlagsString({
      global: false,
      caseInsensitive: false,
      multiline: false,
      dotAll: false,
    });
    expect(result).toBe('');
  });
});

describe('testRegex', () => {
  it('finds matches with global flag', () => {
    const { matches, error } = testRegex('\\d+', 'g', 'abc 123 def 456');
    expect(error).toBeNull();
    expect(matches).toHaveLength(2);
    expect(matches[0].match).toBe('123');
    expect(matches[1].match).toBe('456');
  });

  it('finds single match without global flag', () => {
    const { matches, error } = testRegex('\\d+', '', 'abc 123 def 456');
    expect(error).toBeNull();
    expect(matches).toHaveLength(1);
    expect(matches[0].match).toBe('123');
  });

  it('returns error for invalid regex', () => {
    const { matches, error } = testRegex('[', '', 'test');
    expect(error).toBeTruthy();
    expect(matches).toHaveLength(0);
  });

  it('returns empty for no matches', () => {
    const { matches, error } = testRegex('xyz', 'g', 'abc def');
    expect(error).toBeNull();
    expect(matches).toHaveLength(0);
  });

  it('returns empty for empty pattern', () => {
    const { matches, error } = testRegex('', 'g', 'abc');
    expect(error).toBeNull();
    expect(matches).toHaveLength(0);
  });
});

describe('escapeRegex', () => {
  it('escapes special characters', () => {
    expect(escapeRegex('hello.world')).toBe('hello\\.world');
    expect(escapeRegex('a+b*c')).toBe('a\\+b\\*c');
    expect(escapeRegex('(test)')).toBe('\\(test\\)');
  });

  it('leaves normal characters unchanged', () => {
    expect(escapeRegex('hello')).toBe('hello');
  });
});
