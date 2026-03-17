import { describe, expect, test } from 'bun:test';
import { addPrefixSuffix } from '../prefixSuffix';

describe('addPrefixSuffix', () => {
  test('adds prefix only', () => {
    expect(addPrefixSuffix('a\nb\nc', { prefix: '- ', suffix: '', skipEmpty: false })).toBe(
      '- a\n- b\n- c'
    );
  });

  test('adds suffix only', () => {
    expect(addPrefixSuffix('a\nb\nc', { prefix: '', suffix: ';', skipEmpty: false })).toBe(
      'a;\nb;\nc;'
    );
  });

  test('adds both prefix and suffix', () => {
    expect(addPrefixSuffix('a\nb', { prefix: '"', suffix: '"', skipEmpty: false })).toBe(
      '"a"\n"b"'
    );
  });

  test('skip empty lines', () => {
    expect(addPrefixSuffix('a\n\nb', { prefix: '> ', suffix: '', skipEmpty: true })).toBe(
      '> a\n\n> b'
    );
  });

  test('does not skip empty when disabled', () => {
    expect(addPrefixSuffix('a\n\nb', { prefix: '> ', suffix: '', skipEmpty: false })).toBe(
      '> a\n> \n> b'
    );
  });

  test('empty input', () => {
    expect(addPrefixSuffix('', { prefix: '-', suffix: '-', skipEmpty: false })).toBe(
      '-\u200B-'.replace('\u200B', '')
    );
  });

  test('single line', () => {
    expect(addPrefixSuffix('hello', { prefix: '<<', suffix: '>>', skipEmpty: false })).toBe(
      '<<hello>>'
    );
  });

  test('no prefix no suffix returns same', () => {
    expect(addPrefixSuffix('a\nb', { prefix: '', suffix: '', skipEmpty: false })).toBe('a\nb');
  });
});
