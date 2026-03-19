import { describe, it, expect } from 'vitest';
import { parse, formatDate, formatRRule, eventToIcs } from '../icalParser';

const sampleIcs = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:test-uid-1@example.com
SUMMARY:Team Meeting
DTSTART:20240115T100000
DTEND:20240115T110000
LOCATION:Conference Room A
DESCRIPTION:Weekly team sync
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

describe('icalParser', () => {
  describe('parse', () => {
    it('parses a simple VEVENT', () => {
      const events = parse(sampleIcs);
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('VEVENT');
      expect(events[0].summary).toBe('Team Meeting');
      expect(events[0].location).toBe('Conference Room A');
      expect(events[0].description).toBe('Weekly team sync');
      expect(events[0].status).toBe('CONFIRMED');
    });

    it('parses dates correctly', () => {
      const events = parse(sampleIcs);
      expect(events[0].dtstart).toBeInstanceOf(Date);
      expect(events[0].dtstart!.getFullYear()).toBe(2024);
      expect(events[0].dtstart!.getMonth()).toBe(0); // January
      expect(events[0].dtstart!.getDate()).toBe(15);
    });

    it('parses multiple events', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Event 1
DTSTART:20240115T100000
END:VEVENT
BEGIN:VEVENT
SUMMARY:Event 2
DTSTART:20240116T100000
END:VEVENT
END:VCALENDAR`;
      const events = parse(ics);
      expect(events).toHaveLength(2);
    });

    it('parses VTODO', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VTODO
SUMMARY:Buy groceries
DUE:20240120T180000
PRIORITY:1
STATUS:NEEDS-ACTION
END:VTODO
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].type).toBe('VTODO');
      expect(events[0].summary).toBe('Buy groceries');
      expect(events[0].priority).toBe(1);
    });

    it('parses VJOURNAL', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VJOURNAL
SUMMARY:Daily Notes
DESCRIPTION:Today was productive
DTSTART:20240115
END:VJOURNAL
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].type).toBe('VJOURNAL');
    });

    it('parses categories', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Meeting
CATEGORIES:Work,Important
DTSTART:20240115T100000
END:VEVENT
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].categories).toEqual(['Work', 'Important']);
    });

    it('parses date-only format', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:All Day Event
DTSTART:20240115
DTEND:20240116
END:VEVENT
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].dtstart!.getDate()).toBe(15);
    });

    it('parses UTC dates (Z suffix)', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:UTC Event
DTSTART:20240115T100000Z
END:VEVENT
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].dtstart).toBeInstanceOf(Date);
    });

    it('handles folded lines', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:This is a very long summary
 that continues on the next line
DTSTART:20240115T100000
END:VEVENT
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].summary).toBe('This is a very long summarythat continues on the next line');
    });

    it('handles escape sequences', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Meeting\\, Important
DESCRIPTION:Line 1\\nLine 2
DTSTART:20240115T100000
END:VEVENT
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].summary).toBe('Meeting, Important');
      expect(events[0].description).toContain('Line 1');
      expect(events[0].description).toContain('Line 2');
    });

    it('throws on empty input', () => {
      expect(() => parse('')).toThrow('Input is empty');
    });

    it('throws when no events found', () => {
      expect(() => parse('BEGIN:VCALENDAR\nEND:VCALENDAR')).toThrow('No events');
    });

    it('parses rrule', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Weekly Meeting
DTSTART:20240115T100000
RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=10
END:VEVENT
END:VCALENDAR`;
      const events = parse(ics);
      expect(events[0].rrule).toBe('FREQ=WEEKLY;BYDAY=MO;COUNT=10');
    });
  });

  describe('formatDate', () => {
    it('formats a date', () => {
      const date = new Date(2024, 0, 15);
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('01');
      expect(result).toContain('15');
    });

    it('returns empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });
  });

  describe('formatRRule', () => {
    it('formats weekly rule', () => {
      expect(formatRRule('FREQ=WEEKLY')).toContain('Weekly');
    });

    it('formats with count', () => {
      expect(formatRRule('FREQ=DAILY;COUNT=5')).toContain('5 times');
    });

    it('returns empty for empty input', () => {
      expect(formatRRule('')).toBe('');
    });
  });

  describe('eventToIcs', () => {
    it('generates valid iCal output', () => {
      const events = parse(sampleIcs);
      const ics = eventToIcs(events[0]);
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('SUMMARY:Team Meeting');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');
    });
  });
});
