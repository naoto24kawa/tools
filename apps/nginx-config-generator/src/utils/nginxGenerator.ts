export type PresetType = 'reverse-proxy' | 'static' | 'spa';

export interface NginxConfig {
  preset: PresetType;
  serverName: string;
  listenPort: number;
  enableSsl: boolean;
  sslCertPath: string;
  sslKeyPath: string;
  // Reverse proxy settings
  proxyPass: string;
  proxyWebsocket: boolean;
  // Static settings
  root: string;
  indexFiles: string;
  // SPA settings
  spaRoot: string;
  // Common settings
  enableGzip: boolean;
  enableAccessLog: boolean;
  accessLogPath: string;
  errorLogPath: string;
  clientMaxBodySize: string;
  enableCors: boolean;
  corsOrigin: string;
  customHeaders: { name: string; value: string }[];
}

export const defaultConfig: NginxConfig = {
  preset: 'reverse-proxy',
  serverName: 'example.com',
  listenPort: 80,
  enableSsl: false,
  sslCertPath: '/etc/ssl/certs/cert.pem',
  sslKeyPath: '/etc/ssl/private/key.pem',
  proxyPass: 'http://localhost:3000',
  proxyWebsocket: false,
  root: '/var/www/html',
  indexFiles: 'index.html index.htm',
  spaRoot: '/usr/share/nginx/html',
  enableGzip: true,
  enableAccessLog: true,
  accessLogPath: '/var/log/nginx/access.log',
  errorLogPath: '/var/log/nginx/error.log',
  clientMaxBodySize: '10m',
  enableCors: false,
  corsOrigin: '*',
  customHeaders: [],
};

function ind(level: number): string {
  return '    '.repeat(level);
}

export function generateNginxConfig(config: NginxConfig): string {
  const lines: string[] = [];

  // Gzip configuration
  if (config.enableGzip) {
    lines.push('gzip on;');
    lines.push('gzip_vary on;');
    lines.push('gzip_min_length 1024;');
    lines.push('gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;');
    lines.push('');
  }

  lines.push('server {');

  // Listen
  if (config.enableSsl) {
    lines.push(`${ind(1)}listen ${config.listenPort} ssl;`);
    lines.push(`${ind(1)}listen [::]:${config.listenPort} ssl;`);
  } else {
    lines.push(`${ind(1)}listen ${config.listenPort};`);
    lines.push(`${ind(1)}listen [::]:${config.listenPort};`);
  }

  // Server name
  lines.push(`${ind(1)}server_name ${config.serverName};`);
  lines.push('');

  // SSL
  if (config.enableSsl) {
    lines.push(`${ind(1)}ssl_certificate ${config.sslCertPath};`);
    lines.push(`${ind(1)}ssl_certificate_key ${config.sslKeyPath};`);
    lines.push(`${ind(1)}ssl_protocols TLSv1.2 TLSv1.3;`);
    lines.push(`${ind(1)}ssl_ciphers HIGH:!aNULL:!MD5;`);
    lines.push('');
  }

  // Client max body size
  if (config.clientMaxBodySize) {
    lines.push(`${ind(1)}client_max_body_size ${config.clientMaxBodySize};`);
    lines.push('');
  }

  // Access/error logs
  if (config.enableAccessLog) {
    lines.push(`${ind(1)}access_log ${config.accessLogPath};`);
    lines.push(`${ind(1)}error_log ${config.errorLogPath};`);
    lines.push('');
  }

  // CORS headers
  if (config.enableCors) {
    lines.push(`${ind(1)}add_header Access-Control-Allow-Origin "${config.corsOrigin}";`);
    lines.push(`${ind(1)}add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";`);
    lines.push(`${ind(1)}add_header Access-Control-Allow-Headers "Content-Type, Authorization";`);
    lines.push('');
  }

  // Custom headers
  for (const header of config.customHeaders) {
    if (header.name && header.value) {
      lines.push(`${ind(1)}add_header ${header.name} "${header.value}";`);
    }
  }
  if (config.customHeaders.some((h) => h.name && h.value)) {
    lines.push('');
  }

  // Preset-specific configuration
  switch (config.preset) {
    case 'reverse-proxy':
      lines.push(`${ind(1)}location / {`);
      lines.push(`${ind(2)}proxy_pass ${config.proxyPass};`);
      lines.push(`${ind(2)}proxy_set_header Host $host;`);
      lines.push(`${ind(2)}proxy_set_header X-Real-IP $remote_addr;`);
      lines.push(`${ind(2)}proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`);
      lines.push(`${ind(2)}proxy_set_header X-Forwarded-Proto $scheme;`);
      if (config.proxyWebsocket) {
        lines.push('');
        lines.push(`${ind(2)}# WebSocket support`);
        lines.push(`${ind(2)}proxy_http_version 1.1;`);
        lines.push(`${ind(2)}proxy_set_header Upgrade $http_upgrade;`);
        lines.push(`${ind(2)}proxy_set_header Connection "upgrade";`);
      }
      lines.push(`${ind(1)}}`);
      break;

    case 'static':
      lines.push(`${ind(1)}root ${config.root};`);
      lines.push(`${ind(1)}index ${config.indexFiles};`);
      lines.push('');
      lines.push(`${ind(1)}location / {`);
      lines.push(`${ind(2)}try_files $uri $uri/ =404;`);
      lines.push(`${ind(1)}}`);
      lines.push('');
      lines.push(`${ind(1)}# Cache static assets`);
      lines.push(`${ind(1)}location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {`);
      lines.push(`${ind(2)}expires 30d;`);
      lines.push(`${ind(2)}add_header Cache-Control "public, immutable";`);
      lines.push(`${ind(1)}}`);
      break;

    case 'spa':
      lines.push(`${ind(1)}root ${config.spaRoot};`);
      lines.push(`${ind(1)}index index.html;`);
      lines.push('');
      lines.push(`${ind(1)}location / {`);
      lines.push(`${ind(2)}try_files $uri $uri/ /index.html;`);
      lines.push(`${ind(1)}}`);
      lines.push('');
      lines.push(`${ind(1)}# Cache static assets`);
      lines.push(`${ind(1)}location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {`);
      lines.push(`${ind(2)}expires 30d;`);
      lines.push(`${ind(2)}add_header Cache-Control "public, immutable";`);
      lines.push(`${ind(1)}}`);
      lines.push('');
      lines.push(`${ind(1)}# API proxy (uncomment and configure if needed)`);
      lines.push(`${ind(1)}# location /api/ {`);
      lines.push(`${ind(1)}#     proxy_pass http://localhost:3000;`);
      lines.push(`${ind(1)}# }`);
      break;
  }

  lines.push('}');

  return lines.join('\n') + '\n';
}
