export interface TimezoneInfo {
  id: string;
  label: string;
  offset: string;
}

export const TIMEZONES: TimezoneInfo[] = [
  { id: 'UTC', label: 'UTC', offset: '+00:00' },
  { id: 'Europe/London', label: 'GMT (London)', offset: '+00:00' },
  { id: 'Europe/Paris', label: 'CET (Paris)', offset: '+01:00' },
  { id: 'Europe/Helsinki', label: 'EET (Helsinki)', offset: '+02:00' },
  { id: 'Asia/Dubai', label: 'GST (Dubai)', offset: '+04:00' },
  { id: 'Asia/Kolkata', label: 'IST (Mumbai)', offset: '+05:30' },
  { id: 'Asia/Bangkok', label: 'ICT (Bangkok)', offset: '+07:00' },
  { id: 'Asia/Shanghai', label: 'CST (Shanghai)', offset: '+08:00' },
  { id: 'Asia/Tokyo', label: 'JST (Tokyo)', offset: '+09:00' },
  { id: 'Australia/Sydney', label: 'AEST (Sydney)', offset: '+10:00' },
  { id: 'Pacific/Auckland', label: 'NZST (Auckland)', offset: '+12:00' },
  { id: 'Pacific/Honolulu', label: 'HST (Honolulu)', offset: '-10:00' },
  { id: 'America/Anchorage', label: 'AKST (Anchorage)', offset: '-09:00' },
  { id: 'America/Los_Angeles', label: 'PST (Los Angeles)', offset: '-08:00' },
  { id: 'America/Denver', label: 'MST (Denver)', offset: '-07:00' },
  { id: 'America/Chicago', label: 'CST (Chicago)', offset: '-06:00' },
  { id: 'America/New_York', label: 'EST (New York)', offset: '-05:00' },
  { id: 'America/Sao_Paulo', label: 'BRT (Sao Paulo)', offset: '-03:00' },
];

/**
 * Convert a date-time from one timezone to another using Intl API.
 */
export function convertTimezone(
  dateStr: string,
  fromTimezone: string,
  toTimezone: string,
): string {
  // Parse the input date string as if it's in the fromTimezone
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  // Format in the target timezone
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: toTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return formatter.format(date);
}

/**
 * Format a date in a specific timezone with full details.
 */
export function formatInTimezone(
  date: Date,
  timezone: string,
  locale: string = 'en-US',
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(date);
}

/**
 * Get current time formatted for a specific timezone.
 */
export function getCurrentTimeInTimezone(timezone: string): string {
  return formatInTimezone(new Date(), timezone);
}

/**
 * Convert a local datetime string to a Date object considering the source timezone.
 * Input format: "YYYY-MM-DDTHH:mm" (from datetime-local input)
 */
export function localDatetimeToDate(
  datetimeLocal: string,
  sourceTimezone: string,
): Date {
  // Get the offset for the source timezone at this particular date
  const tempDate = new Date(datetimeLocal);
  if (Number.isNaN(tempDate.getTime())) {
    throw new Error('Invalid date');
  }

  // Use Intl to find the actual offset
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: sourceTimezone,
    timeZoneName: 'longOffset',
  });
  const parts = formatter.formatToParts(tempDate);
  const tzPart = parts.find((p) => p.type === 'timeZoneName');
  const offsetStr = tzPart?.value ?? 'GMT';

  // Parse offset like "GMT+09:00" or "GMT-05:00" or "GMT"
  const match = offsetStr.match(/GMT([+-])(\d{2}):(\d{2})/);
  let offsetMs = 0;
  if (match) {
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;
  }

  // The datetime-local input is interpreted as local browser time
  // We need to adjust it as if it were in the source timezone
  const localOffset = tempDate.getTimezoneOffset() * 60 * 1000;
  const utcMs = tempDate.getTime() + localOffset - offsetMs;
  return new Date(utcMs);
}
