import { describe, expect, it } from 'vitest';
import { generate, getCategories, getTemplatesByCategory, TEMPLATES } from '../gitignoreTemplates';

describe('generate', () => {
  it('generates empty string for no selections', () => {
    expect(generate([])).toBe('');
  });

  it('generates gitignore for single template', () => {
    const result = generate(['macOS']);
    expect(result).toContain('# macOS');
    expect(result).toContain('.DS_Store');
  });

  it('generates gitignore for multiple templates', () => {
    const result = generate(['Node.js', 'macOS']);
    expect(result).toContain('# Node.js');
    expect(result).toContain('node_modules/');
    expect(result).toContain('# macOS');
    expect(result).toContain('.DS_Store');
  });

  it('ends with newline', () => {
    const result = generate(['macOS']);
    expect(result.endsWith('\n')).toBe(true);
  });

  it('ignores unknown template names', () => {
    const result = generate(['NonExistent']);
    expect(result).toBe('');
  });
});

describe('getCategories', () => {
  it('returns unique categories', () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it('includes expected categories', () => {
    const categories = getCategories();
    expect(categories).toContain('Language');
    expect(categories).toContain('Framework');
    expect(categories).toContain('Editor');
    expect(categories).toContain('OS');
  });
});

describe('getTemplatesByCategory', () => {
  it('returns templates for a valid category', () => {
    const templates = getTemplatesByCategory('Language');
    expect(templates.length).toBeGreaterThan(0);
    templates.forEach((t) => expect(t.category).toBe('Language'));
  });

  it('returns empty array for unknown category', () => {
    expect(getTemplatesByCategory('Unknown')).toEqual([]);
  });
});

describe('TEMPLATES', () => {
  it('has at least 20 templates', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(20);
  });

  it('each template has required fields', () => {
    TEMPLATES.forEach((t) => {
      expect(t.name).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.patterns.length).toBeGreaterThan(0);
    });
  });
});
