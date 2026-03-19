export interface Habit {
  id: string;
  name: string;
  targetFrequency: number; // times per week
  createdAt: string;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
}

export interface HabitData {
  habits: Habit[];
  logs: HabitLog[];
}

const STORAGE_KEY = 'habit-tracker-data';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadData(): HabitData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return { habits: [], logs: [] };
}

export function saveData(data: HabitData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addHabit(data: HabitData, name: string, targetFrequency: number): HabitData {
  const habit: Habit = {
    id: generateId(),
    name,
    targetFrequency,
    createdAt: getTodayKey(),
  };
  const updated = { ...data, habits: [...data.habits, habit] };
  saveData(updated);
  return updated;
}

export function deleteHabit(data: HabitData, habitId: string): HabitData {
  const updated = {
    habits: data.habits.filter((h) => h.id !== habitId),
    logs: data.logs.filter((l) => l.habitId !== habitId),
  };
  saveData(updated);
  return updated;
}

export function toggleHabitDay(data: HabitData, habitId: string, date: string): HabitData {
  const existingIndex = data.logs.findIndex(
    (l) => l.habitId === habitId && l.date === date
  );
  let newLogs: HabitLog[];
  if (existingIndex >= 0) {
    newLogs = data.logs.filter((_, i) => i !== existingIndex);
  } else {
    newLogs = [...data.logs, { habitId, date }];
  }
  const updated = { ...data, logs: newLogs };
  saveData(updated);
  return updated;
}

export function isHabitDoneOnDate(data: HabitData, habitId: string, date: string): boolean {
  return data.logs.some((l) => l.habitId === habitId && l.date === date);
}

export function calculateStreak(data: HabitData, habitId: string): number {
  const logs = data.logs
    .filter((l) => l.habitId === habitId)
    .map((l) => l.date)
    .sort()
    .reverse();

  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const currentDate = new Date(today);

  // Check if today is logged, if not check yesterday
  const todayKey = currentDate.toISOString().split('T')[0];
  if (!logs.includes(todayKey)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dateKey = currentDate.toISOString().split('T')[0];
    if (logs.includes(dateKey)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getHeatmapData(
  data: HabitData,
  habitId: string,
  weeks: number = 12
): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const today = new Date();
  const totalDays = weeks * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const done = isHabitDoneOnDate(data, habitId, dateKey);
    result.push({ date: dateKey, count: done ? 1 : 0 });
  }

  return result;
}

export function exportData(data: HabitData): string {
  return JSON.stringify(data, null, 2);
}

export function importData(jsonStr: string): HabitData {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.habits || !parsed.logs) {
    throw new Error('Invalid data format');
  }
  saveData(parsed);
  return parsed;
}
