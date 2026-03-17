export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isPast: boolean;
}

export function calculateCountdown(targetDate: Date): CountdownResult {
  const diff = targetDate.getTime() - Date.now();
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);
  return {
    days: Math.floor(absDiff / 86400000),
    hours: Math.floor((absDiff % 86400000) / 3600000),
    minutes: Math.floor((absDiff % 3600000) / 60000),
    seconds: Math.floor((absDiff % 60000) / 1000),
    totalMs: absDiff,
    isPast,
  };
}
