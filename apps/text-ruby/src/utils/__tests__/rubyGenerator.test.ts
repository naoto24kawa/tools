import { describe, expect, it } from 'vitest';
import { convertToHtml, parse, toHtml } from '../rubyGenerator';

describe('parse', () => {
  it('parses simple ruby notation', () => {
    const result = parse('{漢字|かんじ}');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('ruby');
    expect(result[0].text).toBe('漢字');
    expect(result[0].reading).toBe('かんじ');
  });

  it('parses mixed text and ruby', () => {
    const result = parse('この{漢字|かんじ}は{難|むずか}しい');
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ type: 'text', text: 'この' });
    expect(result[1]).toEqual({ type: 'ruby', text: '漢字', reading: 'かんじ' });
    expect(result[2]).toEqual({ type: 'text', text: 'は' });
    expect(result[3]).toEqual({ type: 'ruby', text: '難', reading: 'むずか' });
    expect(result[4]).toEqual({ type: 'text', text: 'しい' });
  });

  it('handles plain text without ruby', () => {
    const result = parse('Hello world');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text');
    expect(result[0].text).toBe('Hello world');
  });

  it('handles empty string', () => {
    const result = parse('');
    expect(result).toHaveLength(0);
  });

  it('handles multiple consecutive ruby notations', () => {
    const result = parse('{東|ひがし}{京|きょう}');
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('東');
    expect(result[1].text).toBe('京');
  });
});

describe('toHtml', () => {
  it('converts ruby segments to HTML', () => {
    const segments = parse('{漢字|かんじ}');
    const html = toHtml(segments);
    expect(html).toBe(
      '<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>'
    );
  });

  it('preserves plain text', () => {
    const segments = parse('Hello');
    const html = toHtml(segments);
    expect(html).toBe('Hello');
  });

  it('escapes HTML special characters', () => {
    const segments = parse('{<tag>|reading}');
    const html = toHtml(segments);
    expect(html).toContain('&lt;tag&gt;');
  });
});

describe('convertToHtml', () => {
  it('converts directly from input to HTML', () => {
    const html = convertToHtml('この{漢字|かんじ}は面白い');
    expect(html).toContain('<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>');
    expect(html).toContain('この');
    expect(html).toContain('は面白い');
  });
});
