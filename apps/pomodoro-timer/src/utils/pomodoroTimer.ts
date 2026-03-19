export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  cyclesBeforeLongBreak: number;
}

export interface SessionRecord {
  date: string; // YYYY-MM-DD
  completedSessions: number;
  totalWorkMinutes: number;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
};

const STORAGE_KEY = 'pomodoro-settings';
const STATS_KEY = 'pomodoro-stats';

export function loadSettings(): PomodoroSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: PomodoroSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getPhaseDuration(phase: TimerPhase, settings: PomodoroSettings): number {
  switch (phase) {
    case 'work':
      return settings.workDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
}

export function getNextPhase(
  currentPhase: TimerPhase,
  completedCycles: number,
  settings: PomodoroSettings
): TimerPhase {
  if (currentPhase === 'work') {
    if ((completedCycles + 1) % settings.cyclesBeforeLongBreak === 0) {
      return 'longBreak';
    }
    return 'shortBreak';
  }
  return 'work';
}

export function getPhaseLabel(phase: TimerPhase): string {
  switch (phase) {
    case 'work':
      return 'Work';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
  }
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export function loadStats(): SessionRecord[] {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveStats(stats: SessionRecord[]): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordSession(workMinutes: number): SessionRecord[] {
  const stats = loadStats();
  const today = getTodayKey();
  const existing = stats.find((s) => s.date === today);
  if (existing) {
    existing.completedSessions += 1;
    existing.totalWorkMinutes += workMinutes;
  } else {
    stats.push({ date: today, completedSessions: 1, totalWorkMinutes: workMinutes });
  }
  saveStats(stats);
  return stats;
}

export function getTodayStats(stats: SessionRecord[]): { sessions: number; minutes: number } {
  const today = getTodayKey();
  const record = stats.find((s) => s.date === today);
  return {
    sessions: record?.completedSessions ?? 0,
    minutes: record?.totalWorkMinutes ?? 0,
  };
}

export function getWeekStats(stats: SessionRecord[]): { sessions: number; minutes: number } {
  const weekStart = getWeekStart();
  const filtered = stats.filter((s) => s.date >= weekStart);
  return {
    sessions: filtered.reduce((sum, s) => sum + s.completedSessions, 0),
    minutes: filtered.reduce((sum, s) => sum + s.totalWorkMinutes, 0),
  };
}

export function playBeep(frequency = 800, duration = 200, count = 3): void {
  try {
    const audioCtx = new AudioContext();
    for (let i = 0; i < count; i++) {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      const startTime = audioCtx.currentTime + i * (duration / 1000 + 0.1);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration / 1000);
    }
  } catch {
    // Web Audio API not available
  }
}
