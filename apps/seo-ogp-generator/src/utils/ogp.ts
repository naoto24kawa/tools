export interface OGPConfig {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  type: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterSite: string;
  locale: string;
}

export const DEFAULT_CONFIG: OGPConfig = {
  title: '',
  description: '',
  url: '',
  image: '',
  siteName: '',
  type: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  locale: 'ja_JP',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function generateOGPTags(config: OGPConfig): string {
  const tags: string[] = [];

  if (config.title) {
    tags.push(`<meta property="og:title" content="${escapeHtml(config.title)}" />`);
    tags.push(`<meta name="twitter:title" content="${escapeHtml(config.title)}" />`);
  }
  if (config.description) {
    tags.push(`<meta property="og:description" content="${escapeHtml(config.description)}" />`);
    tags.push(`<meta name="twitter:description" content="${escapeHtml(config.description)}" />`);
    tags.push(`<meta name="description" content="${escapeHtml(config.description)}" />`);
  }
  if (config.url) tags.push(`<meta property="og:url" content="${escapeHtml(config.url)}" />`);
  if (config.image) {
    tags.push(`<meta property="og:image" content="${escapeHtml(config.image)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(config.image)}" />`);
  }
  if (config.siteName)
    tags.push(`<meta property="og:site_name" content="${escapeHtml(config.siteName)}" />`);
  if (config.type) tags.push(`<meta property="og:type" content="${escapeHtml(config.type)}" />`);
  if (config.locale)
    tags.push(`<meta property="og:locale" content="${escapeHtml(config.locale)}" />`);
  tags.push(`<meta name="twitter:card" content="${config.twitterCard}" />`);
  if (config.twitterSite)
    tags.push(`<meta name="twitter:site" content="${escapeHtml(config.twitterSite)}" />`);

  return tags.join('\n');
}
