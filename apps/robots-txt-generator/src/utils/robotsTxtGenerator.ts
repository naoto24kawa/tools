export interface PathRule {
  type: 'allow' | 'disallow';
  path: string;
}

export interface UserAgentGroup {
  userAgent: string;
  rules: PathRule[];
  crawlDelay?: number;
}

export interface RobotsTxtData {
  groups: UserAgentGroup[];
  sitemapUrls: string[];
}

export const commonUserAgents = [
  '*',
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'Twitterbot',
  'facebookexternalhit',
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'Applebot',
];

export const defaultGroup: UserAgentGroup = {
  userAgent: '*',
  rules: [{ type: 'disallow', path: '' }],
  crawlDelay: undefined,
};

export function generateRobotsTxt(data: RobotsTxtData): string {
  const lines: string[] = [];

  for (let i = 0; i < data.groups.length; i++) {
    const group = data.groups[i];
    if (i > 0) {
      lines.push('');
    }

    lines.push(`User-agent: ${group.userAgent}`);

    for (const rule of group.rules) {
      const directive = rule.type === 'allow' ? 'Allow' : 'Disallow';
      lines.push(`${directive}: ${rule.path}`);
    }

    if (group.crawlDelay !== undefined && group.crawlDelay > 0) {
      lines.push(`Crawl-delay: ${group.crawlDelay}`);
    }
  }

  if (data.sitemapUrls.length > 0) {
    lines.push('');
    for (const url of data.sitemapUrls) {
      if (url.trim()) {
        lines.push(`Sitemap: ${url.trim()}`);
      }
    }
  }

  return lines.join('\n') + '\n';
}
