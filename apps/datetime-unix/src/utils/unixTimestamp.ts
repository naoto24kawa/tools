export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export function formatISO(date: Date): string {
  return date.toISOString();
}

export function formatUTC(date: Date): string {
  return date.toUTCString();
}

export function formatRelative(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;

  if (absDiff < 60_000) {
    const secs = Math.floor(absDiff / 1000);
    return isFuture ? `${secs}秒後` : `${secs}秒前`;
  }
  if (absDiff < 3_600_000) {
    const mins = Math.floor(absDiff / 60_000);
    return isFuture ? `${mins}分後` : `${mins}分前`;
  }
  if (absDiff < 86_400_000) {
    const hours = Math.floor(absDiff / 3_600_000);
    return isFuture ? `${hours}時間後` : `${hours}時間前`;
  }
  const days = Math.floor(absDiff / 86_400_000);
  return isFuture ? `${days}日後` : `${days}日前`;
}
