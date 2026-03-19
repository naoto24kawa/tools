export interface ICalEvent {
  type: 'VEVENT' | 'VTODO' | 'VJOURNAL';
  summary: string;
  description: string;
  location: string;
  dtstart: Date | null;
  dtend: Date | null;
  due: Date | null;
  status: string;
  rrule: string;
  uid: string;
  organizer: string;
  categories: string[];
  priority: number | null;
  completed: Date | null;
  created: Date | null;
  lastModified: Date | null;
  raw: Record<string, string>;
}

function parseICalDate(value: string): Date | null {
  if (!value) return null;

  // Remove TZID parameter if present
  const cleanValue = value.replace(/^.*:/, '').trim();

  // Format: YYYYMMDD
  if (/^\d{8}$/.test(cleanValue)) {
    const year = parseInt(cleanValue.slice(0, 4), 10);
    const month = parseInt(cleanValue.slice(4, 6), 10) - 1;
    const day = parseInt(cleanValue.slice(6, 8), 10);
    return new Date(year, month, day);
  }

  // Format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
  if (/^\d{8}T\d{6}Z?$/.test(cleanValue)) {
    const year = parseInt(cleanValue.slice(0, 4), 10);
    const month = parseInt(cleanValue.slice(4, 6), 10) - 1;
    const day = parseInt(cleanValue.slice(6, 8), 10);
    const hour = parseInt(cleanValue.slice(9, 11), 10);
    const minute = parseInt(cleanValue.slice(11, 13), 10);
    const second = parseInt(cleanValue.slice(13, 15), 10);

    if (cleanValue.endsWith('Z')) {
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    return new Date(year, month, day, hour, minute, second);
  }

  // Try parsing as ISO date string
  const date = new Date(cleanValue);
  return isNaN(date.getTime()) ? null : date;
}

function unfoldLines(text: string): string {
  // RFC 5545: Lines that begin with a space or tab are continuations
  return text.replace(/\r?\n[ \t]/g, '');
}

function unescapeValue(value: string): string {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseComponent(
  lines: string[],
  startIndex: number,
  componentType: string,
): { event: ICalEvent; endIndex: number } {
  const raw: Record<string, string> = {};
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];

    if (line === `END:${componentType}`) {
      break;
    }

    // Skip nested components we don't handle
    if (line.startsWith('BEGIN:VALARM') || line.startsWith('BEGIN:VTIMEZONE')) {
      while (i < lines.length && !lines[i].startsWith('END:VALARM') && !lines[i].startsWith('END:VTIMEZONE')) {
        i++;
      }
      i++;
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      let key = line.slice(0, colonIndex);
      const value = line.slice(colonIndex + 1);

      // Remove parameters from key (e.g., DTSTART;TZID=...)
      const semicolonIndex = key.indexOf(';');
      if (semicolonIndex !== -1) {
        key = key.slice(0, semicolonIndex);
      }

      raw[key.toUpperCase()] = value;
    }

    i++;
  }

  const event: ICalEvent = {
    type: componentType as ICalEvent['type'],
    summary: unescapeValue(raw['SUMMARY'] || ''),
    description: unescapeValue(raw['DESCRIPTION'] || ''),
    location: unescapeValue(raw['LOCATION'] || ''),
    dtstart: parseICalDate(raw['DTSTART'] || ''),
    dtend: parseICalDate(raw['DTEND'] || ''),
    due: parseICalDate(raw['DUE'] || ''),
    status: raw['STATUS'] || '',
    rrule: raw['RRULE'] || '',
    uid: raw['UID'] || '',
    organizer: raw['ORGANIZER'] || '',
    categories: raw['CATEGORIES'] ? raw['CATEGORIES'].split(',').map((c) => c.trim()) : [],
    priority: raw['PRIORITY'] ? parseInt(raw['PRIORITY'], 10) : null,
    completed: parseICalDate(raw['COMPLETED'] || ''),
    created: parseICalDate(raw['CREATED'] || ''),
    lastModified: parseICalDate(raw['LAST-MODIFIED'] || ''),
    raw,
  };

  return { event, endIndex: i };
}

export function parse(icsContent: string): ICalEvent[] {
  if (!icsContent.trim()) {
    throw new Error('Input is empty');
  }

  const unfolded = unfoldLines(icsContent);
  const lines = unfolded.split(/\r?\n/);

  const events: ICalEvent[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line === 'BEGIN:VEVENT' || line === 'BEGIN:VTODO' || line === 'BEGIN:VJOURNAL') {
      const componentType = line.replace('BEGIN:', '');
      const { event, endIndex } = parseComponent(lines, i + 1, componentType);
      events.push(event);
      i = endIndex + 1;
    } else {
      i++;
    }
  }

  if (events.length === 0) {
    throw new Error('No events, todos, or journals found in the iCalendar data');
  }

  return events;
}

export function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
}

export function formatDateTime(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRRule(rrule: string): string {
  if (!rrule) return '';

  const parts = rrule.split(';');
  const parsed: Record<string, string> = {};

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key && value) {
      parsed[key] = value;
    }
  }

  let description = '';

  if (parsed['FREQ']) {
    const freqMap: Record<string, string> = {
      DAILY: 'Daily',
      WEEKLY: 'Weekly',
      MONTHLY: 'Monthly',
      YEARLY: 'Yearly',
    };
    description += freqMap[parsed['FREQ']] || parsed['FREQ'];
  }

  if (parsed['INTERVAL'] && parsed['INTERVAL'] !== '1') {
    description += ` (every ${parsed['INTERVAL']})`;
  }

  if (parsed['COUNT']) {
    description += `, ${parsed['COUNT']} times`;
  }

  if (parsed['UNTIL']) {
    const untilDate = parseICalDate(parsed['UNTIL']);
    if (untilDate) {
      description += `, until ${formatDate(untilDate)}`;
    }
  }

  if (parsed['BYDAY']) {
    description += ` on ${parsed['BYDAY']}`;
  }

  return description;
}

export function eventToIcs(event: ICalEvent): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Elchika Tools//iCal Parser//EN');
  lines.push(`BEGIN:${event.type}`);

  if (event.uid) lines.push(`UID:${event.uid}`);
  if (event.summary) lines.push(`SUMMARY:${event.summary}`);
  if (event.description) lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
  if (event.location) lines.push(`LOCATION:${event.location}`);
  if (event.dtstart) {
    const dt = event.dtstart;
    const formatted = `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}T${String(dt.getHours()).padStart(2, '0')}${String(dt.getMinutes()).padStart(2, '0')}${String(dt.getSeconds()).padStart(2, '0')}`;
    lines.push(`DTSTART:${formatted}`);
  }
  if (event.dtend) {
    const dt = event.dtend;
    const formatted = `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}T${String(dt.getHours()).padStart(2, '0')}${String(dt.getMinutes()).padStart(2, '0')}${String(dt.getSeconds()).padStart(2, '0')}`;
    lines.push(`DTEND:${formatted}`);
  }
  if (event.status) lines.push(`STATUS:${event.status}`);
  if (event.rrule) lines.push(`RRULE:${event.rrule}`);

  lines.push(`END:${event.type}`);
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}
