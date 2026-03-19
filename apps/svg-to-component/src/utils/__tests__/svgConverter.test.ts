import { describe, expect, it } from 'vitest';
import { convertToReact, convertToVue, cleanSvg, isValidSvg } from '../svgConverter';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 6v6l4 2"/>
</svg>`;

const SVG_WITH_CLASS = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <rect class="bg" fill-opacity="0.5" clip-rule="evenodd"/>
</svg>`;

describe('svgConverter', () => {
  describe('convertToReact JSX', () => {
    it('generates a valid React component', () => {
      const result = convertToReact(SAMPLE_SVG, {
        componentName: 'ClockIcon',
        addSizeProps: false,
        addColorProp: false,
      }, false);
      expect(result).toContain('const ClockIcon');
      expect(result).toContain('export default ClockIcon');
    });

    it('converts SVG attributes to React camelCase', () => {
      const result = convertToReact(SVG_WITH_CLASS, {
        componentName: 'TestIcon',
        addSizeProps: false,
        addColorProp: false,
      }, false);
      expect(result).toContain('className=');
      expect(result).toContain('fillOpacity=');
      expect(result).toContain('clipRule=');
    });

    it('converts stroke-width to strokeWidth', () => {
      const result = convertToReact(SAMPLE_SVG, {
        componentName: 'Icon',
        addSizeProps: false,
        addColorProp: false,
      }, false);
      expect(result).toContain('strokeWidth=');
      expect(result).toContain('strokeLinecap=');
      expect(result).toContain('strokeLinejoin=');
    });

    it('injects size props when enabled', () => {
      const result = convertToReact(SAMPLE_SVG, {
        componentName: 'Icon',
        addSizeProps: true,
        addColorProp: false,
      }, false);
      expect(result).toContain('width = 24');
      expect(result).toContain('height = 24');
      expect(result).toContain('width={width}');
      expect(result).toContain('height={height}');
    });

    it('injects color prop when enabled', () => {
      const result = convertToReact(SAMPLE_SVG, {
        componentName: 'Icon',
        addSizeProps: false,
        addColorProp: true,
      }, false);
      expect(result).toContain("color = 'currentColor'");
      expect(result).toContain('{color}');
    });
  });

  describe('convertToReact TSX', () => {
    it('includes React import and TypeScript interface', () => {
      const result = convertToReact(SAMPLE_SVG, {
        componentName: 'ClockIcon',
        addSizeProps: true,
        addColorProp: true,
      }, true);
      expect(result).toContain("import React from 'react'");
      expect(result).toContain('interface ClockIconProps');
      expect(result).toContain('width?: number | string');
      expect(result).toContain('color?: string');
    });

    it('has no interface when no props', () => {
      const result = convertToReact(SAMPLE_SVG, {
        componentName: 'Icon',
        addSizeProps: false,
        addColorProp: false,
      }, true);
      expect(result).not.toContain('interface');
    });
  });

  describe('convertToVue', () => {
    it('generates a Vue SFC', () => {
      const result = convertToVue(SAMPLE_SVG, {
        componentName: 'ClockIcon',
        addSizeProps: false,
        addColorProp: false,
      });
      expect(result).toContain('<template>');
      expect(result).toContain('</template>');
      expect(result).toContain('<script>');
      expect(result).toContain("name: 'ClockIcon'");
    });

    it('includes props for size when enabled', () => {
      const result = convertToVue(SAMPLE_SVG, {
        componentName: 'Icon',
        addSizeProps: true,
        addColorProp: false,
      });
      expect(result).toContain('props:');
      expect(result).toContain('width:');
      expect(result).toContain('height:');
      expect(result).toContain(':width="width"');
      expect(result).toContain(':height="height"');
    });

    it('includes color prop when enabled', () => {
      const result = convertToVue(SAMPLE_SVG, {
        componentName: 'Icon',
        addSizeProps: false,
        addColorProp: true,
      });
      expect(result).toContain('color:');
      expect(result).toContain("default: 'currentColor'");
    });

    it('does not convert attributes to camelCase (Vue uses HTML attrs)', () => {
      const result = convertToVue(SVG_WITH_CLASS, {
        componentName: 'Icon',
        addSizeProps: false,
        addColorProp: false,
      });
      expect(result).toContain('class="');
      expect(result).toContain('fill-opacity=');
    });
  });

  describe('cleanSvg', () => {
    it('removes XML declaration', () => {
      const input = '<?xml version="1.0" encoding="UTF-8"?><svg></svg>';
      expect(cleanSvg(input)).toBe('<svg></svg>');
    });

    it('removes HTML comments', () => {
      const input = '<!-- comment --><svg><!-- inner --></svg>';
      expect(cleanSvg(input)).toBe('<svg></svg>');
    });

    it('removes DOCTYPE', () => {
      const input = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "...">\n<svg></svg>';
      expect(cleanSvg(input)).toBe('<svg></svg>');
    });

    it('trims whitespace', () => {
      expect(cleanSvg('  <svg></svg>  ')).toBe('<svg></svg>');
    });
  });

  describe('isValidSvg', () => {
    it('accepts valid SVG', () => {
      expect(isValidSvg('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).toBe(true);
    });

    it('rejects non-SVG', () => {
      expect(isValidSvg('<div></div>')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidSvg('')).toBe(false);
    });

    it('rejects SVG without closing tag', () => {
      expect(isValidSvg('<svg>')).toBe(false);
    });
  });
});
