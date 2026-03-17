import { describe, expect, test } from 'bun:test';
import { invertColor } from '../colorInvert';

describe('invertColor', () => {
  test('inverts black to white', () => {
    expect(invertColor('#000000')).toBe('#ffffff');
  });
  test('inverts white to black', () => {
    expect(invertColor('#ffffff')).toBe('#000000');
  });
  test('inverts red to cyan', () => {
    expect(invertColor('#ff0000')).toBe('#00ffff');
  });
  test('inverts green to magenta', () => {
    expect(invertColor('#00ff00')).toBe('#ff00ff');
  });
  test('inverts blue to yellow', () => {
    expect(invertColor('#0000ff')).toBe('#ffff00');
  });
  test('self-inverse', () => {
    expect(invertColor(invertColor('#3b82f6'))).toBe('#3b82f6');
  });
  test('invalid hex returns input', () => {
    expect(invertColor('xyz')).toBe('xyz');
  });
});
