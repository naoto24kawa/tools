export interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  isMobile: boolean;
  isBot: boolean;
  raw: string;
}

function match(ua: string, patterns: [RegExp, string][]): { name: string; version: string } {
  for (const [regex, name] of patterns) {
    const m = ua.match(regex);
    if (m) return { name, version: m[1] ?? '' };
  }
  return { name: 'Unknown', version: '' };
}

export function parseUserAgent(ua: string): ParsedUserAgent {
  const browserPatterns: [RegExp, string][] = [
    [/Edg(?:e|A|iOS)?\/(\S+)/, 'Edge'],
    [/OPR\/(\S+)/, 'Opera'],
    [/Vivaldi\/(\S+)/, 'Vivaldi'],
    [/Brave/, 'Brave'],
    [/Chrome\/(\S+)/, 'Chrome'],
    [/Firefox\/(\S+)/, 'Firefox'],
    [/Safari\/(\S+).*Version\/(\S+)/, 'Safari'],
    [/MSIE (\S+)/, 'IE'],
    [/Trident.*rv:(\S+)/, 'IE'],
  ];

  const osPatterns: [RegExp, string][] = [
    [/Windows NT (\S+)/, 'Windows'],
    [/Mac OS X ([\d._]+)/, 'macOS'],
    [/Android (\S+)/, 'Android'],
    [/iPhone OS ([\d_]+)/, 'iOS'],
    [/iPad.*OS ([\d_]+)/, 'iPadOS'],
    [/Linux/, 'Linux'],
    [/CrOS/, 'ChromeOS'],
  ];

  const browser = match(ua, browserPatterns);
  const os = match(ua, osPatterns);

  let engine = 'Unknown';
  if (ua.includes('Gecko/')) engine = 'Gecko';
  if (ua.includes('AppleWebKit/')) engine = 'WebKit';
  if (ua.includes('Blink')) engine = 'Blink';
  if (ua.includes('Chrome/') && ua.includes('AppleWebKit/')) engine = 'Blink';

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const isBot = /bot|crawler|spider|crawling/i.test(ua);

  return {
    browser: browser.name,
    browserVersion: browser.version.replace(/_/g, '.'),
    os: os.name,
    osVersion: os.version.replace(/_/g, '.'),
    device: isMobile ? 'Mobile' : 'Desktop',
    engine,
    isMobile,
    isBot,
    raw: ua,
  };
}
