import { describe, it, expect } from 'vitest';
import { optimize, defaultOptions, type OptimizeOptions } from '../svgOptimizer';

const disabledOptions: OptimizeOptions = {
  removeComments: false,
  removeMetadata: false,
  removeEmptyGroups: false,
  collapseGroups: false,
  shortenIds: false,
  roundNumbers: false,
  removeDefaultAttrs: false,
};

describe('svgOptimizer', () => {
  describe('removeComments', () => {
    it('should remove HTML comments', () => {
      const svg = '<svg><!-- comment --><rect/></svg>';
      const result = optimize(svg, { ...disabledOptions, removeComments: true });
      expect(result.optimized).not.toContain('<!-- comment -->');
      expect(result.optimized).toContain('<rect/>');
    });

    it('should remove multi-line comments', () => {
      const svg = '<svg><!--\n  multi\n  line\n--><rect/></svg>';
      const result = optimize(svg, { ...disabledOptions, removeComments: true });
      expect(result.optimized).not.toContain('multi');
    });
  });

  describe('removeMetadata', () => {
    it('should remove metadata elements', () => {
      const svg = '<svg><metadata><rdf/></metadata><rect/></svg>';
      const result = optimize(svg, { ...disabledOptions, removeMetadata: true });
      expect(result.optimized).not.toContain('metadata');
      expect(result.optimized).toContain('<rect/>');
    });

    it('should remove desc and title elements', () => {
      const svg = '<svg><desc>A description</desc><title>A title</title><rect/></svg>';
      const result = optimize(svg, { ...disabledOptions, removeMetadata: true });
      expect(result.optimized).not.toContain('desc');
      expect(result.optimized).not.toContain('title');
    });
  });

  describe('removeEmptyGroups', () => {
    it('should remove empty g elements', () => {
      const svg = '<svg><g></g><rect/></svg>';
      const result = optimize(svg, { ...disabledOptions, removeEmptyGroups: true });
      expect(result.optimized).not.toContain('<g');
    });

    it('should handle nested empty groups', () => {
      const svg = '<svg><g><g></g></g><rect/></svg>';
      const result = optimize(svg, { ...disabledOptions, removeEmptyGroups: true });
      expect(result.optimized).not.toContain('<g');
    });
  });

  describe('collapseGroups', () => {
    it('should unwrap groups without attributes', () => {
      const svg = '<svg><g><rect/></g></svg>';
      const result = optimize(svg, { ...disabledOptions, collapseGroups: true });
      expect(result.optimized).not.toContain('<g>');
      expect(result.optimized).toContain('<rect/>');
    });
  });

  describe('shortenIds', () => {
    it('should replace long ids with short ones', () => {
      const svg = '<svg><rect id="myLongIdentifier"/></svg>';
      const result = optimize(svg, { ...disabledOptions, shortenIds: true });
      expect(result.optimized).toContain('id="a"');
      expect(result.optimized).not.toContain('myLongIdentifier');
    });

    it('should update references to shortened ids', () => {
      const svg = '<svg><rect id="grad1"/><use href="#grad1"/></svg>';
      const result = optimize(svg, { ...disabledOptions, shortenIds: true });
      expect(result.optimized).toContain('id="a"');
      expect(result.optimized).toContain('#a');
    });
  });

  describe('roundNumbers', () => {
    it('should round long decimal numbers', () => {
      const svg = '<svg><rect x="10.123456" y="20.987654"/></svg>';
      const result = optimize(svg, { ...disabledOptions, roundNumbers: true });
      expect(result.optimized).toContain('10.12');
      expect(result.optimized).toContain('20.99');
    });

    it('should not affect short decimals', () => {
      const svg = '<svg><rect x="10.5" y="20"/></svg>';
      const result = optimize(svg, { ...disabledOptions, roundNumbers: true });
      expect(result.optimized).toContain('10.5');
    });
  });

  describe('size calculation', () => {
    it('should calculate size savings', () => {
      const svg = '<svg><!-- big comment here --><rect/></svg>';
      const result = optimize(svg, { ...disabledOptions, removeComments: true });
      expect(result.savings).toBeGreaterThan(0);
      expect(result.savingsPercent).toBeGreaterThan(0);
      expect(result.originalSize).toBeGreaterThan(result.optimizedSize);
    });

    it('should return 0% for empty input', () => {
      const result = optimize('', disabledOptions);
      expect(result.savingsPercent).toBe(0);
    });
  });

  describe('all options enabled', () => {
    it('should apply all optimizations', () => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg">
        <!-- comment -->
        <metadata><rdf/></metadata>
        <desc>Description</desc>
        <g>
          <g></g>
          <rect id="myRect" x="10.123456" fill-opacity="1"/>
        </g>
      </svg>`;
      const result = optimize(svg, defaultOptions);
      expect(result.optimized).not.toContain('<!-- comment -->');
      expect(result.optimized).not.toContain('metadata');
      expect(result.optimized).not.toContain('desc');
      expect(result.savings).toBeGreaterThan(0);
    });
  });
});
