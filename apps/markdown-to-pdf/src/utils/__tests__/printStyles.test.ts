import { describe, expect, it } from 'vitest';
import { generatePrintCSS } from '../printStyles';

describe('generatePrintCSS', () => {
  it('A4 サイズを含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('size: A4');
  });

  it('Letter サイズを含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'Letter', fontSize: 16 });
    expect(css).toContain('size: Letter');
  });

  it('フォントサイズ 12px を含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 12 });
    expect(css).toContain('font-size: 12px');
  });

  it('フォントサイズ 16px を含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('font-size: 16px');
  });

  it('フォントサイズ 20px を含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 20 });
    expect(css).toContain('font-size: 20px');
  });

  it('@media print ブロックを含む', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('@media print');
  });

  it('#pdf-preview を表示する指定を含む', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('#pdf-preview');
  });
});
