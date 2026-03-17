export function dateToISO8601(date: Date): string {
  return date.toISOString();
}

export function iso8601ToDate(iso: string): Date | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatISO8601Variants(date: Date): Record<string, string> {
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  const ms = pad(date.getMilliseconds(), 3);
  const tz = -date.getTimezoneOffset();
  const tzH = pad(Math.floor(Math.abs(tz) / 60));
  const tzM = pad(Math.abs(tz) % 60);
  const tzSign = tz >= 0 ? '+' : '-';

  return {
    'ISO 8601 (UTC)': date.toISOString(),
    'ISO 8601 (Local)': `${y}-${mo}-${d}T${h}:${mi}:${s}.${ms}${tzSign}${tzH}:${tzM}`,
    'Date only': `${y}-${mo}-${d}`,
    'Time only': `${h}:${mi}:${s}`,
    'Week number': `${y}-W${pad(getWeekNumber(date))}`,
    'Ordinal date': `${y}-${pad(getDayOfYear(date), 3)}`,
  };
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}
