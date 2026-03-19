import { describe, it, expect } from 'vitest';
import { convert, convertProperty, parseCss } from '../cssToTailwind';

describe('cssToTailwind', () => {
  describe('parseCss', () => {
    it('should parse simple declarations', () => {
      const result = parseCss('display: flex; padding: 1rem;');
      expect(result).toEqual([
        { property: 'display', value: 'flex' },
        { property: 'padding', value: '1rem' },
      ]);
    });

    it('should handle CSS with selectors and braces', () => {
      const result = parseCss('.element { display: flex; padding: 1rem; }');
      expect(result.length).toBe(2);
      expect(result[0].property).toBe('display');
    });

    it('should handle empty input', () => {
      expect(parseCss('').length).toBe(0);
    });

    it('should ignore comments', () => {
      const result = parseCss('/* comment */ display: flex;');
      expect(result.length).toBe(1);
    });
  });

  describe('convertProperty', () => {
    it('should convert display', () => {
      expect(convertProperty('display', 'flex').tailwindClass).toBe('flex');
      expect(convertProperty('display', 'none').tailwindClass).toBe('hidden');
      expect(convertProperty('display', 'grid').tailwindClass).toBe('grid');
    });

    it('should convert position', () => {
      expect(convertProperty('position', 'absolute').tailwindClass).toBe('absolute');
      expect(convertProperty('position', 'relative').tailwindClass).toBe('relative');
    });

    it('should convert padding', () => {
      expect(convertProperty('padding', '1rem').tailwindClass).toBe('p-4');
      expect(convertProperty('padding', '0.5rem').tailwindClass).toBe('p-2');
      expect(convertProperty('padding-top', '0.25rem').tailwindClass).toBe('pt-1');
    });

    it('should convert margin', () => {
      expect(convertProperty('margin', '1rem').tailwindClass).toBe('m-4');
      expect(convertProperty('margin', 'auto').tailwindClass).toBe('m-auto');
    });

    it('should convert background-color', () => {
      expect(convertProperty('background-color', '#3b82f6').tailwindClass).toBe('bg-blue-500');
      expect(convertProperty('background-color', '#ffffff').tailwindClass).toBe('bg-white');
    });

    it('should convert color', () => {
      expect(convertProperty('color', '#ef4444').tailwindClass).toBe('text-red-500');
    });

    it('should convert width', () => {
      expect(convertProperty('width', '100%').tailwindClass).toBe('w-full');
      expect(convertProperty('width', '1rem').tailwindClass).toBe('w-4');
    });

    it('should convert height', () => {
      expect(convertProperty('height', '100vh').tailwindClass).toBe('h-screen');
    });

    it('should convert border-radius', () => {
      expect(convertProperty('border-radius', '0.5rem').tailwindClass).toBe('rounded-lg');
      expect(convertProperty('border-radius', '9999px').tailwindClass).toBe('rounded-full');
    });

    it('should convert font-weight', () => {
      expect(convertProperty('font-weight', '700').tailwindClass).toBe('font-bold');
      expect(convertProperty('font-weight', '400').tailwindClass).toBe('font-normal');
    });

    it('should convert font-size', () => {
      expect(convertProperty('font-size', '1rem').tailwindClass).toBe('text-base');
    });

    it('should use arbitrary values for unknowns', () => {
      const result = convertProperty('padding', '13px');
      expect(result.tailwindClass).toBe('p-[13px]');
      expect(result.exact).toBe(false);
    });

    it('should convert flexbox properties', () => {
      expect(convertProperty('flex-direction', 'column').tailwindClass).toBe('flex-col');
      expect(convertProperty('align-items', 'center').tailwindClass).toBe('items-center');
      expect(convertProperty('justify-content', 'space-between').tailwindClass).toBe('justify-between');
    });
  });

  describe('convert', () => {
    it('should convert full CSS block', () => {
      const result = convert('display: flex; padding: 1rem; background-color: #3b82f6;');
      expect(result.classes).toContain('flex');
      expect(result.classes).toContain('p-4');
      expect(result.classes).toContain('bg-blue-500');
    });

    it('should handle empty input', () => {
      const result = convert('');
      expect(result.results.length).toBe(0);
      expect(result.classes).toBe('');
    });
  });
});
