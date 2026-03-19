import { describe, it, expect } from 'vitest';
import {
  ICON_DATA,
  CATEGORIES,
  filterIcons,
  getComponentImport,
  toKebabCase,
} from '../iconData';

describe('iconData', () => {
  describe('data', () => {
    it('should have icons', () => {
      expect(ICON_DATA.length).toBeGreaterThan(50);
    });

    it('should have categories', () => {
      expect(CATEGORIES.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain('All');
    });

    it('every icon should have a valid category', () => {
      const validCategories = CATEGORIES.filter((c) => c !== 'All');
      for (const icon of ICON_DATA) {
        expect(validCategories).toContain(icon.category);
      }
    });
  });

  describe('filterIcons', () => {
    it('should return all icons when no filter applied', () => {
      const result = filterIcons(ICON_DATA, '', 'All');
      expect(result.length).toBe(ICON_DATA.length);
    });

    it('should filter by category', () => {
      const result = filterIcons(ICON_DATA, '', 'Arrows');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((i) => i.category === 'Arrows')).toBe(true);
    });

    it('should filter by search term in name', () => {
      const result = filterIcons(ICON_DATA, 'arrow', 'All');
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((i) => i.name.toLowerCase().includes('arrow'))).toBe(true);
    });

    it('should filter by search term in keywords', () => {
      const result = filterIcons(ICON_DATA, 'email', 'All');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-matching search', () => {
      const result = filterIcons(ICON_DATA, 'xyznonexistent', 'All');
      expect(result.length).toBe(0);
    });

    it('should combine category and search filters', () => {
      const result = filterIcons(ICON_DATA, 'up', 'Arrows');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((i) => i.category === 'Arrows')).toBe(true);
    });
  });

  describe('getComponentImport', () => {
    it('should generate correct import statement', () => {
      expect(getComponentImport('ArrowUp')).toBe("import { ArrowUp } from 'lucide-react';");
    });
  });

  describe('toKebabCase', () => {
    it('should convert PascalCase to kebab-case', () => {
      expect(toKebabCase('ArrowUp')).toBe('arrow-up');
      expect(toKebabCase('ArrowUpRight')).toBe('arrow-up-right');
      expect(toKebabCase('GitPullRequest')).toBe('git-pull-request');
    });
  });
});
