import { describe, it, expect } from 'vitest';
import { convert, convertClass } from '../tailwindToCss';

describe('tailwindToCss', () => {
  describe('convertClass', () => {
    it('should convert display classes', () => {
      expect(convertClass('flex').css).toBe('display: flex;');
      expect(convertClass('hidden').css).toBe('display: none;');
      expect(convertClass('block').css).toBe('display: block;');
      expect(convertClass('grid').css).toBe('display: grid;');
    });

    it('should convert padding classes', () => {
      expect(convertClass('p-4').css).toBe('padding: 1rem;');
      expect(convertClass('px-2').css).toBe('padding-left: 0.5rem; padding-right: 0.5rem;');
      expect(convertClass('py-8').css).toBe('padding-top: 2rem; padding-bottom: 2rem;');
      expect(convertClass('pt-1').css).toBe('padding-top: 0.25rem;');
    });

    it('should convert margin classes', () => {
      expect(convertClass('m-4').css).toBe('margin: 1rem;');
      expect(convertClass('mx-auto').css).toBe('margin-left: auto; margin-right: auto;');
      expect(convertClass('mt-2').css).toBe('margin-top: 0.5rem;');
    });

    it('should convert background color', () => {
      expect(convertClass('bg-blue-500').css).toBe('background-color: #3b82f6;');
      expect(convertClass('bg-white').css).toBe('background-color: #ffffff;');
    });

    it('should convert text color', () => {
      expect(convertClass('text-red-500').css).toBe('color: #ef4444;');
    });

    it('should convert typography', () => {
      expect(convertClass('text-lg').css).toContain('font-size: 1.125rem');
      expect(convertClass('font-bold').css).toBe('font-weight: 700;');
      expect(convertClass('text-center').css).toBe('text-align: center;');
    });

    it('should convert border radius', () => {
      expect(convertClass('rounded-lg').css).toBe('border-radius: 0.5rem;');
      expect(convertClass('rounded-full').css).toBe('border-radius: 9999px;');
    });

    it('should convert position classes', () => {
      expect(convertClass('absolute').css).toBe('position: absolute;');
      expect(convertClass('relative').css).toBe('position: relative;');
    });

    it('should convert flexbox classes', () => {
      expect(convertClass('flex-col').css).toBe('flex-direction: column;');
      expect(convertClass('items-center').css).toBe('align-items: center;');
      expect(convertClass('justify-between').css).toBe('justify-content: space-between;');
    });

    it('should convert width/height', () => {
      expect(convertClass('w-full').css).toBe('width: 100%;');
      expect(convertClass('h-screen').css).toBe('height: 100vh;');
      expect(convertClass('w-4').css).toBe('width: 1rem;');
    });

    it('should convert shadow', () => {
      expect(convertClass('shadow-lg').css).toContain('box-shadow');
    });

    it('should handle arbitrary values', () => {
      expect(convertClass('w-[200px]').css).toBe('width: 200px;');
      expect(convertClass('h-[50vh]').css).toBe('height: 50vh;');
    });

    it('should mark unknown classes', () => {
      const result = convertClass('unknown-class');
      expect(result.found).toBe(false);
      expect(result.css).toContain('unknown');
    });
  });

  describe('convert', () => {
    it('should convert multiple classes', () => {
      const result = convert('flex items-center p-4 bg-blue-500');
      expect(result.results.length).toBe(4);
      expect(result.results.filter((r) => r.found).length).toBe(4);
    });

    it('should generate combined CSS', () => {
      const result = convert('flex p-4');
      expect(result.combinedCss).toContain('.element');
      expect(result.combinedCss).toContain('display: flex');
      expect(result.combinedCss).toContain('padding: 1rem');
    });

    it('should handle empty input', () => {
      const result = convert('');
      expect(result.results.length).toBe(0);
    });

    it('should handle extra whitespace', () => {
      const result = convert('  flex   p-4  ');
      expect(result.results.length).toBe(2);
    });
  });
});
