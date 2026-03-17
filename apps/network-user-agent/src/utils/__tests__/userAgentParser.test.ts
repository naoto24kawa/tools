import { describe, expect, test } from 'bun:test';
import { parseUserAgent } from '../userAgentParser';

describe('parseUserAgent', () => {
  test('Chrome on Windows', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const parsed = parseUserAgent(ua);
    expect(parsed.browser).toBe('Chrome');
    expect(parsed.os).toBe('Windows');
    expect(parsed.isMobile).toBe(false);
    expect(parsed.engine).toBe('Blink');
  });

  test('Firefox on Linux', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0';
    const parsed = parseUserAgent(ua);
    expect(parsed.browser).toBe('Firefox');
    expect(parsed.os).toBe('Linux');
  });

  test('Safari on macOS', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15';
    const parsed = parseUserAgent(ua);
    expect(parsed.browser).toBe('Safari');
    expect(parsed.os).toBe('macOS');
  });

  test('Chrome on Android (mobile)', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    const parsed = parseUserAgent(ua);
    expect(parsed.browser).toBe('Chrome');
    expect(parsed.os).toBe('Android');
    expect(parsed.isMobile).toBe(true);
    expect(parsed.device).toBe('Mobile');
  });

  test('Safari on iPhone', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
    const parsed = parseUserAgent(ua);
    expect(parsed.os).toBe('iOS');
    expect(parsed.isMobile).toBe(true);
  });

  test('Edge browser', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';
    const parsed = parseUserAgent(ua);
    expect(parsed.browser).toBe('Edge');
  });

  test('bot detection', () => {
    const ua = 'Googlebot/2.1 (+http://www.google.com/bot.html)';
    const parsed = parseUserAgent(ua);
    expect(parsed.isBot).toBe(true);
  });

  test('empty string', () => {
    const parsed = parseUserAgent('');
    expect(parsed.browser).toBe('Unknown');
    expect(parsed.os).toBe('Unknown');
  });
});
