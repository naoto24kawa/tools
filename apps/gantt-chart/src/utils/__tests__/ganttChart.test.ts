import { describe, expect, it } from 'vitest';
import { parseInput, formatDate, getCategoryColor } from '../ganttChart';

describe('parseInput', () => {
  it('parses task lines with name, date, duration', () => {
    const input = `Design, 2024-01-01, 5, design
Development, 2024-01-06, 10, dev
Testing, 2024-01-16, 3, test`;
    const tasks = parseInput(input);
    expect(tasks).toHaveLength(3);
    expect(tasks[0].name).toBe('Design');
    expect(tasks[0].start).toBe('2024-01-01');
    expect(tasks[0].duration).toBe(5);
    expect(tasks[0].category).toBe('design');
  });

  it('calculates end dates correctly', () => {
    const tasks = parseInput('Task, 2024-01-01, 5, dev');
    expect(tasks[0].startDate.getDate()).toBe(1);
    expect(tasks[0].endDate.getDate()).toBe(6);
  });

  it('skips invalid date formats', () => {
    const tasks = parseInput('Task, invalid-date, 5');
    expect(tasks).toHaveLength(0);
  });

  it('skips negative or zero durations', () => {
    const tasks = parseInput('Task, 2024-01-01, 0\nTask2, 2024-01-01, -3');
    expect(tasks).toHaveLength(0);
  });

  it('defaults category to "default"', () => {
    const tasks = parseInput('Task, 2024-01-01, 5');
    expect(tasks[0].category).toBe('default');
  });

  it('skips comment lines', () => {
    const tasks = parseInput('# Comment\nTask, 2024-01-01, 5');
    expect(tasks).toHaveLength(1);
  });

  it('handles empty input', () => {
    expect(parseInput('')).toHaveLength(0);
  });
});

describe('formatDate', () => {
  it('formats date as M/D', () => {
    const date = new Date('2024-03-15T00:00:00');
    expect(formatDate(date)).toBe('3/15');
  });

  it('formats single digit month/day', () => {
    const date = new Date('2024-01-05T00:00:00');
    expect(formatDate(date)).toBe('1/5');
  });
});

describe('getCategoryColor', () => {
  it('returns predefined color for known categories', () => {
    expect(getCategoryColor('design', 0)).toBe('#4A90D9');
    expect(getCategoryColor('dev', 0)).toBe('#50B86C');
    expect(getCategoryColor('test', 0)).toBe('#E6A23C');
  });

  it('returns fallback color for unknown categories', () => {
    const color = getCategoryColor('unknown', 0);
    expect(color).toMatch(/^#/);
  });

  it('is case-insensitive for known categories', () => {
    expect(getCategoryColor('Design', 0)).toBe('#4A90D9');
    expect(getCategoryColor('DEV', 0)).toBe('#50B86C');
  });
});
