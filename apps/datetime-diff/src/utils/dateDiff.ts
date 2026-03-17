export interface DateDiffResult {
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateDateDiff(date1: Date, date2: Date): DateDiffResult {
  const start = date1 < date2 ? date1 : date2;
  const end = date1 < date2 ? date2 : date1;

  const diffMs = end.getTime() - start.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(diffMs / 3600000);
  const totalDays = Math.floor(diffMs / 86400000);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const remainingMs = diffMs % 86400000;
  const hours = Math.floor(remainingMs / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  return {
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}
