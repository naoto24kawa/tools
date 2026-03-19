import { describe, it, expect } from 'vitest';
import {
  formatTime,
  getPhaseDuration,
  getNextPhase,
  getPhaseLabel,
  getTodayStats,
  getWeekStats,
  DEFAULT_SETTINGS,
} from '../pomodoroTimer';
import type { SessionRecord } from '../pomodoroTimer';

describe('formatTime', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats 90 seconds as 01:30', () => {
    expect(formatTime(90)).toBe('01:30');
  });

  it('formats 1500 seconds (25 min) as 25:00', () => {
    expect(formatTime(1500)).toBe('25:00');
  });

  it('formats 5 seconds as 00:05', () => {
    expect(formatTime(5)).toBe('00:05');
  });
});

describe('getPhaseDuration', () => {
  it('returns work duration in seconds', () => {
    expect(getPhaseDuration('work', DEFAULT_SETTINGS)).toBe(1500);
  });

  it('returns short break duration in seconds', () => {
    expect(getPhaseDuration('shortBreak', DEFAULT_SETTINGS)).toBe(300);
  });

  it('returns long break duration in seconds', () => {
    expect(getPhaseDuration('longBreak', DEFAULT_SETTINGS)).toBe(900);
  });

  it('uses custom settings', () => {
    const custom = { ...DEFAULT_SETTINGS, workDuration: 50 };
    expect(getPhaseDuration('work', custom)).toBe(3000);
  });
});

describe('getNextPhase', () => {
  it('returns shortBreak after work (not at cycle boundary)', () => {
    expect(getNextPhase('work', 0, DEFAULT_SETTINGS)).toBe('shortBreak');
  });

  it('returns longBreak after 4th work session', () => {
    expect(getNextPhase('work', 3, DEFAULT_SETTINGS)).toBe('longBreak');
  });

  it('returns work after shortBreak', () => {
    expect(getNextPhase('shortBreak', 1, DEFAULT_SETTINGS)).toBe('work');
  });

  it('returns work after longBreak', () => {
    expect(getNextPhase('longBreak', 3, DEFAULT_SETTINGS)).toBe('work');
  });
});

describe('getPhaseLabel', () => {
  it('returns correct labels', () => {
    expect(getPhaseLabel('work')).toBe('Work');
    expect(getPhaseLabel('shortBreak')).toBe('Short Break');
    expect(getPhaseLabel('longBreak')).toBe('Long Break');
  });
});

describe('getTodayStats', () => {
  it('returns zero for empty stats', () => {
    expect(getTodayStats([])).toEqual({ sessions: 0, minutes: 0 });
  });

  it('returns today stats', () => {
    const today = new Date().toISOString().split('T')[0];
    const stats: SessionRecord[] = [
      { date: today, completedSessions: 3, totalWorkMinutes: 75 },
    ];
    expect(getTodayStats(stats)).toEqual({ sessions: 3, minutes: 75 });
  });
});

describe('getWeekStats', () => {
  it('returns zero for empty stats', () => {
    expect(getWeekStats([])).toEqual({ sessions: 0, minutes: 0 });
  });

  it('sums stats for current week', () => {
    const today = new Date().toISOString().split('T')[0];
    const stats: SessionRecord[] = [
      { date: today, completedSessions: 2, totalWorkMinutes: 50 },
      { date: '2020-01-01', completedSessions: 5, totalWorkMinutes: 125 },
    ];
    const result = getWeekStats(stats);
    expect(result.sessions).toBeGreaterThanOrEqual(2);
  });
});
