import { describe, expect, it } from 'vitest';
import { DEFAULT_OPTIONS, getVerticalStyles } from '../verticalText';

describe('getVerticalStyles', () => {
  it('returns correct writing mode', () => {
    const styles = getVerticalStyles(DEFAULT_OPTIONS);
    expect(styles.writingMode).toBe('vertical-rl');
  });

  it('applies font size', () => {
    const styles = getVerticalStyles({ ...DEFAULT_OPTIONS, fontSize: 24 });
    expect(styles.fontSize).toBe('24px');
  });

  it('applies line height', () => {
    const styles = getVerticalStyles({ ...DEFAULT_OPTIONS, lineHeight: 2.0 });
    expect(styles.lineHeight).toBe(2.0);
  });

  it('applies font family', () => {
    const styles = getVerticalStyles({ ...DEFAULT_OPTIONS, fontFamily: 'sans-serif' });
    expect(styles.fontFamily).toBe('sans-serif');
  });

  it('has pre-wrap white space', () => {
    const styles = getVerticalStyles(DEFAULT_OPTIONS);
    expect(styles.whiteSpace).toBe('pre-wrap');
  });
});

describe('DEFAULT_OPTIONS', () => {
  it('has reasonable defaults', () => {
    expect(DEFAULT_OPTIONS.fontSize).toBe(16);
    expect(DEFAULT_OPTIONS.lineHeight).toBe(1.8);
    expect(DEFAULT_OPTIONS.fontFamily).toBe('serif');
  });
});
