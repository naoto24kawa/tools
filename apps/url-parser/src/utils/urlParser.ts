export interface ParsedUrl {
  href: string;
  protocol: string;
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

export interface QueryParam {
  key: string;
  value: string;
}

export function parseUrl(input: string): ParsedUrl | null {
  try {
    const url = new URL(input);
    return {
      href: url.href,
      protocol: url.protocol,
      username: url.username,
      password: url.password,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
    };
  } catch {
    return null;
  }
}

export function extractQueryParams(search: string): QueryParam[] {
  if (!search || search === '?') return [];
  const params = new URLSearchParams(search);
  const result: QueryParam[] = [];
  params.forEach((value, key) => {
    result.push({ key, value });
  });
  return result;
}

export interface UrlParts {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  queryParams: QueryParam[];
  hash: string;
}

export function buildUrl(parts: UrlParts): string {
  let url = '';

  const protocol = parts.protocol || 'https:';
  url += protocol.endsWith(':') ? protocol : `${protocol}:`;
  url += '//';

  if (parts.username) {
    url += encodeURIComponent(parts.username);
    if (parts.password) {
      url += `:${encodeURIComponent(parts.password)}`;
    }
    url += '@';
  }

  if (!parts.hostname) return '';
  url += parts.hostname;

  if (parts.port) {
    url += `:${parts.port}`;
  }

  if (parts.pathname) {
    url += parts.pathname.startsWith('/') ? parts.pathname : `/${parts.pathname}`;
  } else {
    url += '/';
  }

  if (parts.queryParams.length > 0) {
    const params = new URLSearchParams();
    for (const p of parts.queryParams) {
      if (p.key) {
        params.append(p.key, p.value);
      }
    }
    const qs = params.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  if (parts.hash) {
    url += parts.hash.startsWith('#') ? parts.hash : `#${parts.hash}`;
  }

  return url;
}
