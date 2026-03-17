import { describe, expect, test } from 'vitest';
import { cronToString, describeCron, parseCron } from '../crontab';

describe('crontab', () => {
  test('cronToString', () => {
    expect(
      cronToString({ minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' })
    ).toBe('0 9 * * 1');
  });

  test('parseCron valid', () => {
    const r = parseCron('*/5 * * * *');
    expect(r?.minute).toBe('*/5');
    expect(r?.hour).toBe('*');
  });

  test('parseCron invalid', () => {
    expect(parseCron('invalid')).toBeNull();
  });

  test('parseCron too few parts', () => {
    expect(parseCron('* *')).toBeNull();
  });

  test('describeCron basic', () => {
    const desc = describeCron({
      minute: '0',
      hour: '9',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
    });
    expect(desc).toContain('0分');
    expect(desc).toContain('9時');
  });

  test('describeCron with interval', () => {
    const desc = describeCron({
      minute: '*/5',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
    });
    expect(desc).toContain('5分ごと');
  });

  test('round-trip', () => {
    const cron = '30 9 1 * 5';
    const parsed = parseCron(cron);
    expect(parsed).not.toBeNull();
    if (parsed) expect(cronToString(parsed)).toBe(cron);
  });
});
