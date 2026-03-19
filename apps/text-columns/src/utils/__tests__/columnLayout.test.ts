import { describe, expect, it } from 'vitest';
import {
  clampColumnCount,
  clampColumnGap,
  DEFAULT_OPTIONS,
  getColumnStyles,
} from '../columnLayout';

describe('getColumnStyles', () => {
  it('returns correct column count', () => {
    const styles = getColumnStyles(DEFAULT_OPTIONS);
    expect(styles.columnCount).toBe(2);
  });

  it('returns correct column gap', () => {
    const styles = getColumnStyles({ ...DEFAULT_OPTIONS, columnGap: 48 });
    expect(styles.columnGap).toBe('48px');
  });

  it('sets column rule width to 0 when style is none', () => {
    const styles = getColumnStyles({ ...DEFAULT_OPTIONS, columnRuleStyle: 'none' });
    expect(styles.columnRuleWidth).toBe('0');
  });

  it('applies column rule when style is solid', () => {
    const styles = getColumnStyles({ ...DEFAULT_OPTIONS, columnRuleStyle: 'solid', columnRuleWidth: 2 });
    expect(styles.columnRuleWidth).toBe('2px');
    expect(styles.columnRuleStyle).toBe('solid');
  });

  it('applies font size and line height', () => {
    const styles = getColumnStyles({ ...DEFAULT_OPTIONS, fontSize: 18, lineHeight: 1.8 });
    expect(styles.fontSize).toBe('18px');
    expect(styles.lineHeight).toBe(1.8);
  });
});

describe('clampColumnCount', () => {
  it('clamps minimum to 2', () => {
    expect(clampColumnCount(1)).toBe(2);
    expect(clampColumnCount(0)).toBe(2);
  });

  it('clamps maximum to 6', () => {
    expect(clampColumnCount(7)).toBe(6);
    expect(clampColumnCount(10)).toBe(6);
  });

  it('allows values in range', () => {
    expect(clampColumnCount(3)).toBe(3);
    expect(clampColumnCount(5)).toBe(5);
  });
});

describe('clampColumnGap', () => {
  it('clamps minimum to 0', () => {
    expect(clampColumnGap(-10)).toBe(0);
  });

  it('clamps maximum to 100', () => {
    expect(clampColumnGap(200)).toBe(100);
  });

  it('allows values in range', () => {
    expect(clampColumnGap(32)).toBe(32);
  });
});

describe('DEFAULT_OPTIONS', () => {
  it('has reasonable defaults', () => {
    expect(DEFAULT_OPTIONS.columnCount).toBe(2);
    expect(DEFAULT_OPTIONS.columnGap).toBe(32);
    expect(DEFAULT_OPTIONS.columnRuleStyle).toBe('solid');
  });
});
