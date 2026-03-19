import { describe, expect, it } from 'vitest';
import {
  generateKeyframesCss,
  generateAnimationCss,
  generateFullCss,
  DEFAULT_KEYFRAME_PROPERTIES,
  DEFAULT_ANIMATION_SETTINGS,
  type Keyframe,
} from '../animationBuilder';

describe('animationBuilder', () => {
  const makeKeyframe = (percentage: number, overrides?: Partial<Keyframe['properties']>): Keyframe => ({
    id: `kf-${percentage}`,
    percentage,
    properties: { ...DEFAULT_KEYFRAME_PROPERTIES, ...overrides },
  });

  describe('generateKeyframesCss', () => {
    it('generates empty string for no keyframes', () => {
      expect(generateKeyframesCss([], 'test')).toBe('');
    });

    it('generates keyframes with correct name', () => {
      const keyframes = [makeKeyframe(0), makeKeyframe(100)];
      const css = generateKeyframesCss(keyframes, 'fadeIn');
      expect(css).toContain('@keyframes fadeIn');
    });

    it('includes percentage markers', () => {
      const keyframes = [makeKeyframe(0), makeKeyframe(50), makeKeyframe(100)];
      const css = generateKeyframesCss(keyframes, 'test');
      expect(css).toContain('0%');
      expect(css).toContain('50%');
      expect(css).toContain('100%');
    });

    it('includes transform when values are non-default', () => {
      const keyframes = [
        makeKeyframe(0),
        makeKeyframe(100, { translateX: 100, rotate: 45 }),
      ];
      const css = generateKeyframesCss(keyframes, 'test');
      expect(css).toContain('translate(100px, 0px)');
      expect(css).toContain('rotate(45deg)');
    });

    it('includes opacity when non-default', () => {
      const keyframes = [makeKeyframe(0, { opacity: 0 }), makeKeyframe(100)];
      const css = generateKeyframesCss(keyframes, 'test');
      expect(css).toContain('opacity: 0');
    });

    it('includes background-color', () => {
      const keyframes = [
        makeKeyframe(0, { backgroundColor: '#ff0000' }),
        makeKeyframe(100, { backgroundColor: '#00ff00' }),
      ];
      const css = generateKeyframesCss(keyframes, 'test');
      expect(css).toContain('background-color: #ff0000');
      expect(css).toContain('background-color: #00ff00');
    });

    it('sorts keyframes by percentage', () => {
      const keyframes = [makeKeyframe(100), makeKeyframe(0), makeKeyframe(50)];
      const css = generateKeyframesCss(keyframes, 'test');
      const idx0 = css.indexOf('0%');
      const idx50 = css.indexOf('50%');
      const idx100 = css.indexOf('100%');
      expect(idx0).toBeLessThan(idx50);
      expect(idx50).toBeLessThan(idx100);
    });
  });

  describe('generateAnimationCss', () => {
    it('generates animation shorthand', () => {
      const css = generateAnimationCss(DEFAULT_ANIMATION_SETTINGS);
      expect(css).toContain('animation:');
      expect(css).toContain('myAnimation');
      expect(css).toContain('1s');
      expect(css).toContain('ease');
      expect(css).toContain('infinite');
    });

    it('handles numeric iteration count', () => {
      const css = generateAnimationCss({
        ...DEFAULT_ANIMATION_SETTINGS,
        iterationCount: 3,
      });
      expect(css).toContain(' 3 ');
    });
  });

  describe('generateFullCss', () => {
    it('includes both keyframes and animation property', () => {
      const keyframes = [makeKeyframe(0), makeKeyframe(100)];
      const css = generateFullCss(keyframes, DEFAULT_ANIMATION_SETTINGS);
      expect(css).toContain('@keyframes');
      expect(css).toContain('.animated-element');
      expect(css).toContain('animation:');
    });
  });
});
