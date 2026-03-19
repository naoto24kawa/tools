import { describe, it, expect } from 'vitest';
import {
  getDnsTypeNumber,
  getRecordTypeInfo,
  formatTtl,
  getDnsStatusText,
  DNS_RECORD_TYPES,
} from '../dnsLookup';

describe('getDnsTypeNumber', () => {
  it('returns correct type numbers', () => {
    expect(getDnsTypeNumber('A')).toBe(1);
    expect(getDnsTypeNumber('AAAA')).toBe(28);
    expect(getDnsTypeNumber('CNAME')).toBe(5);
    expect(getDnsTypeNumber('MX')).toBe(15);
    expect(getDnsTypeNumber('NS')).toBe(2);
    expect(getDnsTypeNumber('TXT')).toBe(16);
    expect(getDnsTypeNumber('SOA')).toBe(6);
    expect(getDnsTypeNumber('PTR')).toBe(12);
    expect(getDnsTypeNumber('SRV')).toBe(33);
  });
});

describe('getRecordTypeInfo', () => {
  it('returns info for A record', () => {
    const info = getRecordTypeInfo('A');
    expect(info).not.toBeUndefined();
    expect(info?.name).toBe('Address Record');
  });

  it('returns info for all record types', () => {
    for (const type of DNS_RECORD_TYPES) {
      const info = getRecordTypeInfo(type.type);
      expect(info).toBeDefined();
    }
  });
});

describe('formatTtl', () => {
  it('formats seconds', () => {
    expect(formatTtl(30)).toBe('30s');
  });

  it('formats minutes and seconds', () => {
    expect(formatTtl(90)).toBe('1m 30s');
  });

  it('formats hours and minutes', () => {
    expect(formatTtl(3661)).toBe('1h 1m');
  });
});

describe('getDnsStatusText', () => {
  it('returns text for known statuses', () => {
    expect(getDnsStatusText(0)).toContain('NOERROR');
    expect(getDnsStatusText(3)).toContain('NXDOMAIN');
  });

  it('returns unknown for undefined statuses', () => {
    expect(getDnsStatusText(99)).toContain('Unknown');
  });
});

describe('DNS_RECORD_TYPES', () => {
  it('contains all 9 record types', () => {
    expect(DNS_RECORD_TYPES.length).toBe(9);
  });

  it('each record has required fields', () => {
    for (const record of DNS_RECORD_TYPES) {
      expect(record.type).toBeTruthy();
      expect(record.name).toBeTruthy();
      expect(record.description).toBeTruthy();
      expect(record.format).toBeTruthy();
      expect(record.example).toBeTruthy();
    }
  });
});
