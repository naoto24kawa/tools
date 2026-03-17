import { describe, expect, test } from 'vitest';
import { parseUserAgent } from '../userAgent';

describe('parseUserAgent', () => {
  test('should parse Chrome on Windows user agent', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const result = parseUserAgent(ua);

    expect(result.browser).toBe('Chrome');
    expect(result.browserVersion).toBe('120.0.0.0');
    expect(result.os).toBe('Windows');
    expect(result.osVersion).toBe('10/11');
    expect(result.device).toBe('Desktop');
    expect(result.engine).toBe('Blink');
    expect(result.isMobile).toBe(false);
    expect(result.isBot).toBe(false);
  });

  test('should parse Firefox on Linux user agent', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0';
    const result = parseUserAgent(ua);

    expect(result.browser).toBe('Firefox');
    expect(result.browserVersion).toBe('115.0');
    expect(result.os).toBe('Linux');
    expect(result.engine).toBe('Gecko');
    expect(result.isMobile).toBe(false);
    expect(result.isBot).toBe(false);
  });

  test('should detect mobile device (iPhone Safari)', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const result = parseUserAgent(ua);

    expect(result.browser).toBe('Safari');
    expect(result.browserVersion).toBe('17.0');
    expect(result.os).toBe('iOS');
    expect(result.osVersion).toBe('17.0');
    expect(result.device).toBe('Mobile');
    expect(result.isMobile).toBe(true);
    expect(result.isBot).toBe(false);
  });

  test('should detect bot user agent', () => {
    const ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
    const result = parseUserAgent(ua);

    expect(result.isBot).toBe(true);
    expect(result.device).toBe('Bot');
  });

  test('should handle empty string', () => {
    const result = parseUserAgent('');

    expect(result.browser).toBe('Unknown');
    expect(result.browserVersion).toBe('');
    expect(result.os).toBe('Unknown');
    expect(result.osVersion).toBe('');
    expect(result.device).toBe('Desktop');
    expect(result.engine).toBe('Unknown');
    expect(result.isMobile).toBe(false);
    expect(result.isBot).toBe(false);
  });
});
