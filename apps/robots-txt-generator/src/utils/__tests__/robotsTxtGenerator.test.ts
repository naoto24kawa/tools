import { describe, test, expect } from 'vitest';
import { generateRobotsTxt, type RobotsTxtData } from '../robotsTxtGenerator';

describe('generateRobotsTxt', () => {
  test('should generate basic robots.txt with wildcard user-agent', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: '*',
          rules: [{ type: 'disallow', path: '' }],
        },
      ],
      sitemapUrls: [],
    };
    const result = generateRobotsTxt(data);
    expect(result).toContain('User-agent: *');
    expect(result).toContain('Disallow: ');
  });

  test('should generate allow and disallow rules', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: '*',
          rules: [
            { type: 'allow', path: '/' },
            { type: 'disallow', path: '/admin/' },
            { type: 'disallow', path: '/private/' },
          ],
        },
      ],
      sitemapUrls: [],
    };
    const result = generateRobotsTxt(data);
    expect(result).toContain('Allow: /');
    expect(result).toContain('Disallow: /admin/');
    expect(result).toContain('Disallow: /private/');
  });

  test('should include crawl-delay', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: 'Googlebot',
          rules: [{ type: 'disallow', path: '' }],
          crawlDelay: 10,
        },
      ],
      sitemapUrls: [],
    };
    const result = generateRobotsTxt(data);
    expect(result).toContain('Crawl-delay: 10');
  });

  test('should not include crawl-delay when 0 or undefined', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: '*',
          rules: [{ type: 'disallow', path: '' }],
          crawlDelay: 0,
        },
      ],
      sitemapUrls: [],
    };
    const result = generateRobotsTxt(data);
    expect(result).not.toContain('Crawl-delay');
  });

  test('should include sitemap URLs', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: '*',
          rules: [{ type: 'disallow', path: '' }],
        },
      ],
      sitemapUrls: ['https://example.com/sitemap.xml', 'https://example.com/sitemap2.xml'],
    };
    const result = generateRobotsTxt(data);
    expect(result).toContain('Sitemap: https://example.com/sitemap.xml');
    expect(result).toContain('Sitemap: https://example.com/sitemap2.xml');
  });

  test('should skip empty sitemap URLs', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: '*',
          rules: [{ type: 'disallow', path: '' }],
        },
      ],
      sitemapUrls: ['https://example.com/sitemap.xml', '', '  '],
    };
    const result = generateRobotsTxt(data);
    const sitemapLines = result.split('\n').filter((l) => l.startsWith('Sitemap:'));
    expect(sitemapLines.length).toBe(1);
  });

  test('should handle multiple user-agent groups', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: '*',
          rules: [{ type: 'allow', path: '/' }],
        },
        {
          userAgent: 'Googlebot',
          rules: [{ type: 'disallow', path: '/private/' }],
        },
      ],
      sitemapUrls: [],
    };
    const result = generateRobotsTxt(data);
    expect(result).toContain('User-agent: *');
    expect(result).toContain('User-agent: Googlebot');
  });

  test('should end with newline', () => {
    const data: RobotsTxtData = {
      groups: [
        {
          userAgent: '*',
          rules: [{ type: 'disallow', path: '' }],
        },
      ],
      sitemapUrls: [],
    };
    const result = generateRobotsTxt(data);
    expect(result.endsWith('\n')).toBe(true);
  });
});
