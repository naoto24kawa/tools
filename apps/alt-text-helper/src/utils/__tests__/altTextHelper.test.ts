import { describe, it, expect } from 'vitest';
import {
  getGuidelines,
  generateHtmlSnippet,
  decisionTree,
} from '../altTextHelper';

describe('getGuidelines', () => {
  it('returns empty alt for decorative', () => {
    const result = getGuidelines('decorative');
    expect(result.altAttribute).toBe('alt=""');
    expect(result.purpose).toBe('decorative');
  });

  it('returns description guidance for informational', () => {
    const result = getGuidelines('informational');
    expect(result.altAttribute).toContain('Describe the content');
  });

  it('returns action guidance for functional', () => {
    const result = getGuidelines('functional');
    expect(result.altAttribute).toContain('Describe the action');
  });

  it('returns complex guidance', () => {
    const result = getGuidelines('complex');
    expect(result.explanation).toContain('chart');
  });
});

describe('generateHtmlSnippet', () => {
  it('generates decorative snippet with empty alt', () => {
    const html = generateHtmlSnippet('decorative', '');
    expect(html).toContain('alt=""');
    expect(html).toContain('role="presentation"');
  });

  it('generates informational snippet', () => {
    const html = generateHtmlSnippet('informational', 'A red car');
    expect(html).toContain('alt="A red car"');
  });

  it('generates functional snippet with link', () => {
    const html = generateHtmlSnippet('functional', 'Go to home');
    expect(html).toContain('<a href');
    expect(html).toContain('alt="Go to home"');
  });

  it('generates complex snippet with figure', () => {
    const html = generateHtmlSnippet('complex', 'Sales chart');
    expect(html).toContain('<figure>');
    expect(html).toContain('aria-describedby');
  });

  it('escapes special characters in alt text', () => {
    const html = generateHtmlSnippet('informational', 'A "quoted" <value>');
    expect(html).toContain('&quot;');
    expect(html).toContain('&lt;');
  });
});

describe('decisionTree', () => {
  it('has a start step', () => {
    const start = decisionTree.find((s) => s.id === 'start');
    expect(start).toBeDefined();
    expect(start!.options.length).toBeGreaterThan(0);
  });

  it('all nextStep references exist or are null', () => {
    const ids = new Set(decisionTree.map((s) => s.id));
    for (const step of decisionTree) {
      for (const opt of step.options) {
        if (opt.nextStep !== null) {
          expect(ids.has(opt.nextStep)).toBe(true);
        }
      }
    }
  });
});
