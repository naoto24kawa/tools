const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function dateToRFC2822(date: Date): string {
  const day = DAYS[date.getDay()];
  const d = String(date.getDate()).padStart(2, '0');
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  const tz = -date.getTimezoneOffset();
  const tzH = String(Math.floor(Math.abs(tz) / 60)).padStart(2, '0');
  const tzM = String(Math.abs(tz) % 60).padStart(2, '0');
  const tzSign = tz >= 0 ? '+' : '-';
  return `${day}, ${d} ${month} ${year} ${h}:${m}:${s} ${tzSign}${tzH}${tzM}`;
}

export function rfc2822ToDate(rfc: string): Date | null {
  const d = new Date(rfc);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dateToUTC(date: Date): string {
  return date.toUTCString();
}
