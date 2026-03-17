import { describe, expect, test } from 'bun:test';
import { formatXml, minifyXml } from '../xmlFormatter';

describe('formatXml', () => {
  test('formats nested XML with proper indentation', () => {
    const input = '<root><child><subchild>text</subchild></child></root>';
    const expected = [
      '<root>',
      '  <child>',
      '    <subchild>text</subchild>',
      '  </child>',
      '</root>',
    ].join('\n');
    expect(formatXml(input)).toBe(expected);
  });

  test('handles self-closing tags and processing instructions', () => {
    const input = '<?xml version="1.0"?><root><item/><item attr="val"/></root>';
    const expected = [
      '<?xml version="1.0"?>',
      '<root>',
      '  <item/>',
      '  <item attr="val"/>',
      '</root>',
    ].join('\n');
    expect(formatXml(input)).toBe(expected);
  });

  test('respects custom indent size', () => {
    const input = '<a><b>text</b></a>';
    const expected = ['<a>', '    <b>text</b>', '</a>'].join('\n');
    expect(formatXml(input, 4)).toBe(expected);
  });

  test('handles comments', () => {
    const input = '<root><!-- comment --><child/></root>';
    const expected = ['<root>', '  <!-- comment -->', '  <child/>', '</root>'].join('\n');
    expect(formatXml(input)).toBe(expected);
  });
});

describe('minifyXml', () => {
  test('removes whitespace and comments', () => {
    const input = [
      '<?xml version="1.0"?>',
      '<root>',
      '  <!-- comment -->',
      '  <child>',
      '    <sub>text</sub>',
      '  </child>',
      '</root>',
    ].join('\n');
    expect(minifyXml(input)).toBe(
      '<?xml version="1.0"?><root><child><sub>text</sub></child></root>'
    );
  });
});
