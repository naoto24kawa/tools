import { describe, expect, test } from 'vitest';
import { generateMixSteps, mixColors, mixTwo } from '../colorMixer';

describe('colorMixer', () => {
  test('mixTwo 50% red+blue = purple', () => {
    const result = mixTwo('#ff0000', '#0000ff', 50);
    expect(result).toBe('#800080');
  });

  test('mixTwo 0% returns first color', () => {
    expect(mixTwo('#ff0000', '#0000ff', 0)).toBe('#ff0000');
  });

  test('mixTwo 100% returns second color', () => {
    expect(mixTwo('#ff0000', '#0000ff', 100)).toBe('#0000ff');
  });

  test('mixColors with weights', () => {
    const result = mixColors([
      { hex: '#ff0000', weight: 1 },
      { hex: '#0000ff', weight: 1 },
    ]);
    expect(result).toBe('#800080');
  });

  test('mixColors empty returns black', () => {
    expect(mixColors([])).toBe('#000000');
  });

  test('generateMixSteps returns correct count', () => {
    const steps = generateMixSteps('#ff0000', '#0000ff', 5);
    expect(steps.length).toBe(5);
  });

  test('generateMixSteps first and last', () => {
    const steps = generateMixSteps('#ff0000', '#0000ff', 5);
    expect(steps[0]).toBe('#ff0000');
    expect(steps[4]).toBe('#0000ff');
  });
});
