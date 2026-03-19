export interface RedirectRule {
  type: '301' | '302';
  from: string;
  to: string;
}

export interface ErrorPage {
  code: string;
  path: string;
}

export interface HtaccessConfig {
  enableHttpsForce: boolean;
  enableWwwRedirect: boolean;
  wwwRedirectType: 'add-www' | 'remove-www';
  enableCors: boolean;
  corsOrigin: string;
  enableCacheControl: boolean;
  cacheDuration: string;
  enableGzip: boolean;
  redirects: RedirectRule[];
  errorPages: ErrorPage[];
  blockedIps: string[];
}

export const defaultConfig: HtaccessConfig = {
  enableHttpsForce: false,
  enableWwwRedirect: false,
  wwwRedirectType: 'add-www',
  enableCors: false,
  corsOrigin: '*',
  enableCacheControl: false,
  cacheDuration: '2592000',
  enableGzip: false,
  redirects: [],
  errorPages: [],
  blockedIps: [],
};

export function generateHtaccess(config: HtaccessConfig): string {
  const sections: string[] = [];

  if (config.enableHttpsForce) {
    sections.push(
      [
        '# Force HTTPS',
        'RewriteEngine On',
        'RewriteCond %{HTTPS} off',
        'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
      ].join('\n'),
    );
  }

  if (config.enableWwwRedirect) {
    if (config.wwwRedirectType === 'add-www') {
      sections.push(
        [
          '# Redirect to www',
          'RewriteEngine On',
          'RewriteCond %{HTTP_HOST} !^www\\. [NC]',
          'RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
        ].join('\n'),
      );
    } else {
      sections.push(
        [
          '# Redirect to non-www',
          'RewriteEngine On',
          'RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]',
          'RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]',
        ].join('\n'),
      );
    }
  }

  if (config.redirects.length > 0) {
    const redirectLines = ['# Redirects'];
    for (const redirect of config.redirects) {
      if (redirect.from && redirect.to) {
        redirectLines.push(`Redirect ${redirect.type} ${redirect.from} ${redirect.to}`);
      }
    }
    if (redirectLines.length > 1) {
      sections.push(redirectLines.join('\n'));
    }
  }

  if (config.enableCors) {
    sections.push(
      [
        '# CORS Headers',
        '<IfModule mod_headers.c>',
        `    Header set Access-Control-Allow-Origin "${config.corsOrigin}"`,
        '    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"',
        '    Header set Access-Control-Allow-Headers "Content-Type, Authorization"',
        '</IfModule>',
      ].join('\n'),
    );
  }

  if (config.enableCacheControl) {
    sections.push(
      [
        '# Cache Control',
        '<IfModule mod_expires.c>',
        '    ExpiresActive On',
        `    ExpiresDefault "access plus ${config.cacheDuration} seconds"`,
        '    ExpiresByType image/jpeg "access plus 2592000 seconds"',
        '    ExpiresByType image/png "access plus 2592000 seconds"',
        '    ExpiresByType image/gif "access plus 2592000 seconds"',
        '    ExpiresByType image/svg+xml "access plus 2592000 seconds"',
        '    ExpiresByType text/css "access plus 604800 seconds"',
        '    ExpiresByType application/javascript "access plus 604800 seconds"',
        '</IfModule>',
      ].join('\n'),
    );
  }

  if (config.enableGzip) {
    sections.push(
      [
        '# Gzip Compression',
        '<IfModule mod_deflate.c>',
        '    AddOutputFilterByType DEFLATE text/html',
        '    AddOutputFilterByType DEFLATE text/css',
        '    AddOutputFilterByType DEFLATE text/javascript',
        '    AddOutputFilterByType DEFLATE application/javascript',
        '    AddOutputFilterByType DEFLATE application/json',
        '    AddOutputFilterByType DEFLATE application/xml',
        '    AddOutputFilterByType DEFLATE image/svg+xml',
        '</IfModule>',
      ].join('\n'),
    );
  }

  if (config.errorPages.length > 0) {
    const errorLines = ['# Custom Error Pages'];
    for (const ep of config.errorPages) {
      if (ep.code && ep.path) {
        errorLines.push(`ErrorDocument ${ep.code} ${ep.path}`);
      }
    }
    if (errorLines.length > 1) {
      sections.push(errorLines.join('\n'));
    }
  }

  if (config.blockedIps.length > 0) {
    const validIps = config.blockedIps.filter((ip) => ip.trim());
    if (validIps.length > 0) {
      const ipLines = ['# IP Blocking', '<RequireAll>', '    Require all granted'];
      for (const ip of validIps) {
        ipLines.push(`    Require not ip ${ip.trim()}`);
      }
      ipLines.push('</RequireAll>');
      sections.push(ipLines.join('\n'));
    }
  }

  if (sections.length === 0) {
    return '# .htaccess - No rules configured\n';
  }

  return sections.join('\n\n') + '\n';
}
