/**
 * Japanese national holidays for 2024-2027.
 * Format: 'YYYY-MM-DD'
 */
export const JAPANESE_HOLIDAYS: string[] = [
  // 2024
  '2024-01-01', '2024-01-08', '2024-02-11', '2024-02-12', '2024-02-23',
  '2024-03-20', '2024-04-29', '2024-05-03', '2024-05-04', '2024-05-05',
  '2024-05-06', '2024-07-15', '2024-08-11', '2024-08-12', '2024-09-16',
  '2024-09-22', '2024-09-23', '2024-10-14', '2024-11-03', '2024-11-04',
  '2024-11-23', // 2024 holidays

  // 2025
  '2025-01-01', '2025-01-13', '2025-02-11', '2025-02-23', '2025-02-24',
  '2025-03-20', '2025-04-29', '2025-05-03', '2025-05-04', '2025-05-05',
  '2025-05-06', '2025-07-21', '2025-08-11', '2025-09-15', '2025-09-23',
  '2025-10-13', '2025-11-03', '2025-11-23', '2025-11-24', // 2025 holidays

  // 2026
  '2026-01-01', '2026-01-12', '2026-02-11', '2026-02-23', '2026-03-20',
  '2026-04-29', '2026-05-03', '2026-05-04', '2026-05-05', '2026-05-06',
  '2026-07-20', '2026-08-11', '2026-09-21', '2026-09-22', '2026-09-23',
  '2026-10-12', '2026-11-03', '2026-11-23', // 2026 holidays

  // 2027
  '2027-01-01', '2027-01-11', '2027-02-11', '2027-02-23', '2027-03-21',
  '2027-03-22', '2027-04-29', '2027-05-03', '2027-05-04', '2027-05-05',
  '2027-07-19', '2027-08-11', '2027-09-20', '2027-09-23', '2027-10-11',
  '2027-11-03', '2027-11-23', // 2027 holidays
];

export interface WorkingDaysResult {
  totalDays: number;
  workingDays: number;
  weekendDays: number;
  holidayDays: number;
  startDate: string;
  endDate: string;
}

/**
 * Format a Date to 'YYYY-MM-DD'.
 */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse 'YYYY-MM-DD' to a Date (local timezone).
 */
function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Check if a date is a weekend (Saturday or Sunday).
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Calculate working days between two dates (inclusive).
 */
export function calculateWorkingDays(
  startDateStr: string,
  endDateStr: string,
  customHolidays: string[] = [],
): WorkingDaysResult {
  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);

  if (end < start) {
    throw new Error('End date must be on or after start date');
  }

  const allHolidays = new Set([...JAPANESE_HOLIDAYS, ...customHolidays]);

  let totalDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let workingDays = 0;

  const current = new Date(start);
  while (current <= end) {
    totalDays++;
    const dateStr = formatDate(current);

    if (isWeekend(current)) {
      weekendDays++;
    } else if (allHolidays.has(dateStr)) {
      holidayDays++;
    } else {
      workingDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    totalDays,
    workingDays,
    weekendDays,
    holidayDays,
    startDate: startDateStr,
    endDate: endDateStr,
  };
}

/**
 * Calculate end date from start date + N working days.
 */
export function addWorkingDays(
  startDateStr: string,
  numWorkingDays: number,
  customHolidays: string[] = [],
): string {
  if (numWorkingDays <= 0) {
    throw new Error('Number of working days must be positive');
  }

  const allHolidays = new Set([...JAPANESE_HOLIDAYS, ...customHolidays]);
  const current = parseDate(startDateStr);
  let count = 0;

  while (count < numWorkingDays) {
    current.setDate(current.getDate() + 1);
    const dateStr = formatDate(current);

    if (!isWeekend(current) && !allHolidays.has(dateStr)) {
      count++;
    }
  }

  return formatDate(current);
}

/**
 * Get holiday name for a given date string.
 */
export function isJapaneseHoliday(dateStr: string): boolean {
  return JAPANESE_HOLIDAYS.includes(dateStr);
}
