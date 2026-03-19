import { describe, it, expect, beforeEach } from 'vitest';
import {
  addHabit,
  deleteHabit,
  toggleHabitDay,
  isHabitDoneOnDate,
  calculateStreak,
  getHeatmapData,
  exportData,
  importData,
} from '../habitTracker';
import type { HabitData } from '../habitTracker';

let data: HabitData;

beforeEach(() => {
  data = { habits: [], logs: [] };
  localStorage.clear();
});

describe('addHabit', () => {
  it('adds a habit to empty data', () => {
    const result = addHabit(data, 'Exercise', 5);
    expect(result.habits).toHaveLength(1);
    expect(result.habits[0].name).toBe('Exercise');
    expect(result.habits[0].targetFrequency).toBe(5);
  });
});

describe('deleteHabit', () => {
  it('removes a habit and its logs', () => {
    const d1 = addHabit(data, 'Exercise', 5);
    const habitId = d1.habits[0].id;
    const d2 = toggleHabitDay(d1, habitId, '2025-01-01');
    const d3 = deleteHabit(d2, habitId);
    expect(d3.habits).toHaveLength(0);
    expect(d3.logs).toHaveLength(0);
  });
});

describe('toggleHabitDay', () => {
  it('adds a log entry', () => {
    const d1 = addHabit(data, 'Read', 7);
    const habitId = d1.habits[0].id;
    const d2 = toggleHabitDay(d1, habitId, '2025-01-01');
    expect(d2.logs).toHaveLength(1);
    expect(isHabitDoneOnDate(d2, habitId, '2025-01-01')).toBe(true);
  });

  it('removes a log entry on second toggle', () => {
    const d1 = addHabit(data, 'Read', 7);
    const habitId = d1.habits[0].id;
    const d2 = toggleHabitDay(d1, habitId, '2025-01-01');
    const d3 = toggleHabitDay(d2, habitId, '2025-01-01');
    expect(d3.logs).toHaveLength(0);
    expect(isHabitDoneOnDate(d3, habitId, '2025-01-01')).toBe(false);
  });
});

describe('calculateStreak', () => {
  it('returns 0 for no logs', () => {
    const d1 = addHabit(data, 'Test', 1);
    expect(calculateStreak(d1, d1.habits[0].id)).toBe(0);
  });

  it('returns correct streak for consecutive days', () => {
    const d1 = addHabit(data, 'Test', 1);
    const id = d1.habits[0].id;
    const today = new Date();
    let d = d1;
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      d = toggleHabitDay(d, id, date.toISOString().split('T')[0]);
    }
    expect(calculateStreak(d, id)).toBe(3);
  });
});

describe('getHeatmapData', () => {
  it('returns correct number of days', () => {
    const d1 = addHabit(data, 'Test', 1);
    const heatmap = getHeatmapData(d1, d1.habits[0].id, 4);
    expect(heatmap).toHaveLength(28);
  });
});

describe('exportData / importData', () => {
  it('round-trips data', () => {
    const d1 = addHabit(data, 'Export Test', 3);
    const json = exportData(d1);
    const imported = importData(json);
    expect(imported.habits[0].name).toBe('Export Test');
  });

  it('throws on invalid data', () => {
    expect(() => importData('{"invalid": true}')).toThrow('Invalid data format');
  });
});
