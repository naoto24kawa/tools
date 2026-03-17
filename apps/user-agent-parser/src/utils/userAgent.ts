export interface ParsedUA {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  isMobile: boolean;
  isBot: boolean;
}

function detectBot(ua: string): { isBot: boolean; device: string } {
  if (/bot|crawl|spider|slurp|googlebot|bingbot/i.test(ua)) {
    return { isBot: true, device: 'Bot' };
  }
  return { isBot: false, device: 'Desktop' };
}

function detectBrowser(ua: string): { browser: string; browserVersion: string } {
  if (/Edg\//i.test(ua)) {
    return { browser: 'Edge', browserVersion: ua.match(/Edg\/([\d.]+)/)?.[1] ?? '' };
  }
  if (/OPR\//i.test(ua)) {
    return { browser: 'Opera', browserVersion: ua.match(/OPR\/([\d.]+)/)?.[1] ?? '' };
  }
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
    return { browser: 'Chrome', browserVersion: ua.match(/Chrome\/([\d.]+)/)?.[1] ?? '' };
  }
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    return { browser: 'Safari', browserVersion: ua.match(/Version\/([\d.]+)/)?.[1] ?? '' };
  }
  if (/Firefox\//i.test(ua)) {
    return { browser: 'Firefox', browserVersion: ua.match(/Firefox\/([\d.]+)/)?.[1] ?? '' };
  }
  return { browser: 'Unknown', browserVersion: '' };
}

const WINDOWS_VERSION_MAP: Record<string, string> = {
  '10.0': '10/11',
  '6.3': '8.1',
  '6.1': '7',
};

function detectOS(ua: string): { os: string; osVersion: string } {
  if (/Windows NT/i.test(ua)) {
    const ver = ua.match(/Windows NT ([\d.]+)/)?.[1] ?? '';
    return { os: 'Windows', osVersion: WINDOWS_VERSION_MAP[ver] ?? ver };
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return { os: 'iOS', osVersion: ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') ?? '' };
  }
  if (/Android/i.test(ua)) {
    return { os: 'Android', osVersion: ua.match(/Android ([\d.]+)/)?.[1] ?? '' };
  }
  if (/Mac OS X/i.test(ua)) {
    return {
      os: 'macOS',
      osVersion: ua.match(/Mac OS X ([\d_.]+)/)?.[1]?.replace(/_/g, '.') ?? '',
    };
  }
  if (/Linux/i.test(ua)) {
    return { os: 'Linux', osVersion: '' };
  }
  return { os: 'Unknown', osVersion: '' };
}

function detectMobile(ua: string): { isMobile: boolean; device: string } {
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    const device = /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobile';
    return { isMobile: true, device };
  }
  return { isMobile: false, device: 'Desktop' };
}

function detectEngine(ua: string): string {
  if (/Blink/i.test(ua) || (/Chrome/i.test(ua) && /AppleWebKit/i.test(ua))) return 'Blink';
  if (/Trident\//i.test(ua)) return 'Trident';
  if (/AppleWebKit\//i.test(ua)) return 'WebKit';
  if (/Gecko\//i.test(ua)) return 'Gecko';
  return 'Unknown';
}

export function parseUserAgent(ua: string): ParsedUA {
  const bot = detectBot(ua);
  const browser = detectBrowser(ua);
  const os = detectOS(ua);
  const mobile = detectMobile(ua);
  const engine = detectEngine(ua);

  return {
    browser: browser.browser,
    browserVersion: browser.browserVersion,
    os: os.os,
    osVersion: os.osVersion,
    device: bot.isBot ? bot.device : mobile.device,
    engine,
    isMobile: mobile.isMobile,
    isBot: bot.isBot,
  };
}
