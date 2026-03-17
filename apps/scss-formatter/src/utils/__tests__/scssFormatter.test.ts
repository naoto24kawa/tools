import { describe, expect, test } from 'bun:test';
import { formatScss, minifyScss } from '../scssFormatter';

describe('formatScss', () => {
  test('formats basic SCSS with nesting', () => {
    const input = '.parent{color:red;.child{font-size:14px;}}';
    const result = formatScss(input);
    expect(result).toContain('.parent {');
    expect(result).toContain('  color: red;');
    expect(result).toContain('  .child {');
    expect(result).toContain('    font-size: 14px;');
  });

  test('formats SCSS variables and mixins', () => {
    const input =
      '$primary: #333;@mixin flex-center{display:flex;justify-content:center;}.container{@include flex-center;color:$primary;}';
    const result = formatScss(input);
    expect(result).toContain('$primary: #333;');
    expect(result).toContain('@mixin flex-center {');
    expect(result).toContain('  display: flex;');
    expect(result).toContain('@include flex-center;');
    expect(result).toContain('color: $primary;');
  });

  test('returns empty string for empty input', () => {
    expect(formatScss('')).toBe('');
    expect(formatScss('   ')).toBe('');
  });

  test('respects custom indent size', () => {
    const input = '.parent{color:red;}';
    const result = formatScss(input, 4);
    expect(result).toContain('    color: red;');
  });
});

describe('minifyScss', () => {
  test('minifies SCSS by removing whitespace and comments', () => {
    const input = `
      // This is a comment
      .parent {
        color: red;
        /* multi-line
           comment */
        .child {
          font-size: 14px;
        }
      }
    `;
    const result = minifyScss(input);
    expect(result).not.toContain('// This is a comment');
    expect(result).not.toContain('multi-line');
    expect(result).toContain('.parent');
    expect(result).toContain('color:red');
    expect(result).toContain('.child');
    expect(result).toContain('font-size:14px');
  });

  test('preserves string contents during minification', () => {
    const input = `.icon { content: "  spaces  "; }`;
    const result = minifyScss(input);
    expect(result).toContain('"  spaces  "');
  });

  test('returns empty string for empty input', () => {
    expect(minifyScss('')).toBe('');
    expect(minifyScss('   ')).toBe('');
  });

  test('minifies SCSS variables and mixins', () => {
    const input = `
      $color: #fff;

      @mixin box($size) {
        width: $size;
        height: $size;
      }

      .box {
        @include box(100px);
        color: $color;
      }
    `;
    const result = minifyScss(input);
    expect(result).toContain('$color:#fff');
    expect(result).toContain('@mixin box($size)');
    expect(result).toContain('@include box(100px)');
  });
});
