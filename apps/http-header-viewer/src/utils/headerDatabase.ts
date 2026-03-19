export type HeaderCategory = 'Request' | 'Response' | 'General' | 'Entity';

export interface HttpHeaderEntry {
  name: string;
  category: HeaderCategory;
  description: string;
  example: string;
  rfc: string;
}

export const HEADER_DATABASE: HttpHeaderEntry[] = [
  // General Headers
  { name: 'Cache-Control', category: 'General', description: 'Directives for caching mechanisms in both requests and responses.', example: 'Cache-Control: no-cache', rfc: 'RFC 7234' },
  { name: 'Connection', category: 'General', description: 'Controls whether the network connection stays open after the current transaction finishes.', example: 'Connection: keep-alive', rfc: 'RFC 7230' },
  { name: 'Date', category: 'General', description: 'The date and time at which the message was originated.', example: 'Date: Wed, 21 Oct 2015 07:28:00 GMT', rfc: 'RFC 7231' },
  { name: 'Pragma', category: 'General', description: 'Implementation-specific header for backwards compatibility with HTTP/1.0 caches.', example: 'Pragma: no-cache', rfc: 'RFC 7234' },
  { name: 'Trailer', category: 'General', description: 'Lists headers that will be transmitted after the message body in chunked transfer coding.', example: 'Trailer: Expires', rfc: 'RFC 7230' },
  { name: 'Transfer-Encoding', category: 'General', description: 'Specifies the encoding used to safely transfer the payload body.', example: 'Transfer-Encoding: chunked', rfc: 'RFC 7230' },
  { name: 'Upgrade', category: 'General', description: 'Asks the server to upgrade to another protocol.', example: 'Upgrade: websocket', rfc: 'RFC 7230' },
  { name: 'Via', category: 'General', description: 'Added by proxies, both forward and reverse, to track message forwards.', example: 'Via: 1.1 varnish', rfc: 'RFC 7230' },
  { name: 'Warning', category: 'General', description: 'General warning about possible issues with the entity body.', example: 'Warning: 199 Miscellaneous warning', rfc: 'RFC 7234' },

  // Request Headers
  { name: 'Accept', category: 'Request', description: 'Media types the client is willing to receive.', example: 'Accept: text/html, application/json', rfc: 'RFC 7231' },
  { name: 'Accept-Charset', category: 'Request', description: 'Character sets the client is willing to accept.', example: 'Accept-Charset: utf-8', rfc: 'RFC 7231' },
  { name: 'Accept-Encoding', category: 'Request', description: 'Content encodings the client is willing to accept.', example: 'Accept-Encoding: gzip, deflate, br', rfc: 'RFC 7231' },
  { name: 'Accept-Language', category: 'Request', description: 'Natural languages the client prefers.', example: 'Accept-Language: en-US, ja;q=0.9', rfc: 'RFC 7231' },
  { name: 'Authorization', category: 'Request', description: 'Credentials for authenticating the client to the server.', example: 'Authorization: Bearer <token>', rfc: 'RFC 7235' },
  { name: 'Cookie', category: 'Request', description: 'Contains stored HTTP cookies previously sent by the server.', example: 'Cookie: session_id=abc123', rfc: 'RFC 6265' },
  { name: 'Expect', category: 'Request', description: 'Indicates expectations that need to be fulfilled by the server.', example: 'Expect: 100-continue', rfc: 'RFC 7231' },
  { name: 'Forwarded', category: 'Request', description: 'Contains information from the client-facing side of proxy servers.', example: 'Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43', rfc: 'RFC 7239' },
  { name: 'From', category: 'Request', description: 'Email address of the human user controlling the requesting user agent.', example: 'From: user@example.com', rfc: 'RFC 7231' },
  { name: 'Host', category: 'Request', description: 'The domain name and optionally the port number of the server.', example: 'Host: www.example.com', rfc: 'RFC 7230' },
  { name: 'If-Match', category: 'Request', description: 'Makes the request conditional based on the ETag.', example: 'If-Match: "737060cd8c284d8af7ad3082f209582d"', rfc: 'RFC 7232' },
  { name: 'If-Modified-Since', category: 'Request', description: 'Makes the request conditional based on the last modification date.', example: 'If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT', rfc: 'RFC 7232' },
  { name: 'If-None-Match', category: 'Request', description: 'Makes the request conditional based on the ETag (inverse of If-Match).', example: 'If-None-Match: "737060cd8c284d8af7ad3082f209582d"', rfc: 'RFC 7232' },
  { name: 'If-Range', category: 'Request', description: 'Makes a range request conditional.', example: 'If-Range: "737060cd8c284d8af7ad3082f209582d"', rfc: 'RFC 7233' },
  { name: 'If-Unmodified-Since', category: 'Request', description: 'Makes the request conditional based on the last modification date.', example: 'If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT', rfc: 'RFC 7232' },
  { name: 'Max-Forwards', category: 'Request', description: 'Limits the number of times a message can be forwarded through proxies.', example: 'Max-Forwards: 10', rfc: 'RFC 7231' },
  { name: 'Origin', category: 'Request', description: 'Indicates the origin of the cross-site access request or preflight request.', example: 'Origin: https://example.com', rfc: 'RFC 6454' },
  { name: 'Proxy-Authorization', category: 'Request', description: 'Credentials for authenticating with a proxy.', example: 'Proxy-Authorization: Basic dXNlcjpwYXNz', rfc: 'RFC 7235' },
  { name: 'Range', category: 'Request', description: 'Request only part of an entity. Bytes are numbered from 0.', example: 'Range: bytes=0-499', rfc: 'RFC 7233' },
  { name: 'Referer', category: 'Request', description: 'The address of the previous web page from which a link was followed.', example: 'Referer: https://example.com/page', rfc: 'RFC 7231' },
  { name: 'TE', category: 'Request', description: 'Transfer encodings the user agent is willing to accept.', example: 'TE: trailers, deflate', rfc: 'RFC 7230' },
  { name: 'User-Agent', category: 'Request', description: 'Contains a string identifying the requesting user agent.', example: 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)', rfc: 'RFC 7231' },
  { name: 'X-Forwarded-For', category: 'Request', description: 'Identifies the originating IP addresses of a client connecting through a proxy.', example: 'X-Forwarded-For: 203.0.113.195, 70.41.3.18', rfc: 'Non-standard' },
  { name: 'X-Forwarded-Host', category: 'Request', description: 'Identifies the original host requested by the client.', example: 'X-Forwarded-Host: example.com', rfc: 'Non-standard' },
  { name: 'X-Forwarded-Proto', category: 'Request', description: 'Identifies the protocol (HTTP or HTTPS) that a client used to connect.', example: 'X-Forwarded-Proto: https', rfc: 'Non-standard' },

  // Response Headers
  { name: 'Accept-Ranges', category: 'Response', description: 'Indicates if the server supports range requests.', example: 'Accept-Ranges: bytes', rfc: 'RFC 7233' },
  { name: 'Access-Control-Allow-Credentials', category: 'Response', description: 'Indicates whether the response can be exposed when the credentials flag is true.', example: 'Access-Control-Allow-Credentials: true', rfc: 'CORS' },
  { name: 'Access-Control-Allow-Headers', category: 'Response', description: 'Indicates which HTTP headers can be used during the actual request.', example: 'Access-Control-Allow-Headers: Content-Type, Authorization', rfc: 'CORS' },
  { name: 'Access-Control-Allow-Methods', category: 'Response', description: 'Indicates which HTTP methods are allowed when accessing a resource.', example: 'Access-Control-Allow-Methods: GET, POST, OPTIONS', rfc: 'CORS' },
  { name: 'Access-Control-Allow-Origin', category: 'Response', description: 'Indicates whether the response can be shared with requesting code from the given origin.', example: 'Access-Control-Allow-Origin: *', rfc: 'CORS' },
  { name: 'Access-Control-Expose-Headers', category: 'Response', description: 'Indicates which headers can be exposed as part of the response.', example: 'Access-Control-Expose-Headers: X-Custom-Header', rfc: 'CORS' },
  { name: 'Access-Control-Max-Age', category: 'Response', description: 'Indicates how long the results of a preflight request can be cached.', example: 'Access-Control-Max-Age: 86400', rfc: 'CORS' },
  { name: 'Age', category: 'Response', description: 'The time in seconds the object has been in a proxy cache.', example: 'Age: 12', rfc: 'RFC 7234' },
  { name: 'Allow', category: 'Response', description: 'Lists the set of HTTP methods supported by the resource.', example: 'Allow: GET, HEAD, POST', rfc: 'RFC 7231' },
  { name: 'Content-Security-Policy', category: 'Response', description: 'Controls resources the user agent is allowed to load for a given page.', example: "Content-Security-Policy: default-src 'self'", rfc: 'CSP Level 3' },
  { name: 'ETag', category: 'Response', description: 'An identifier for a specific version of a resource.', example: 'ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"', rfc: 'RFC 7232' },
  { name: 'Location', category: 'Response', description: 'Used in redirection, or when a new resource has been created.', example: 'Location: https://example.com/new-page', rfc: 'RFC 7231' },
  { name: 'Proxy-Authenticate', category: 'Response', description: 'Defines the authentication method that should be used to access a resource behind a proxy.', example: 'Proxy-Authenticate: Basic', rfc: 'RFC 7235' },
  { name: 'Retry-After', category: 'Response', description: 'Indicates how long to wait before making a new request.', example: 'Retry-After: 120', rfc: 'RFC 7231' },
  { name: 'Server', category: 'Response', description: 'Contains information about the software used by the origin server.', example: 'Server: Apache/2.4.1 (Unix)', rfc: 'RFC 7231' },
  { name: 'Set-Cookie', category: 'Response', description: 'Send cookies from the server to the user agent.', example: 'Set-Cookie: id=a3fWa; Expires=Wed, 09 Jun 2021 10:18:14 GMT', rfc: 'RFC 6265' },
  { name: 'Strict-Transport-Security', category: 'Response', description: 'Tells the client to only communicate with HTTPS.', example: 'Strict-Transport-Security: max-age=31536000; includeSubDomains', rfc: 'RFC 6797' },
  { name: 'Vary', category: 'Response', description: 'Determines how to match request headers to decide whether a cached response can be used.', example: 'Vary: Accept-Encoding', rfc: 'RFC 7231' },
  { name: 'WWW-Authenticate', category: 'Response', description: 'Defines the authentication method that should be used to access a resource.', example: 'WWW-Authenticate: Basic realm="Access to the staging site"', rfc: 'RFC 7235' },
  { name: 'X-Content-Type-Options', category: 'Response', description: 'Prevents the browser from MIME-sniffing a response away from the declared content-type.', example: 'X-Content-Type-Options: nosniff', rfc: 'Non-standard' },
  { name: 'X-Frame-Options', category: 'Response', description: 'Can be used to indicate whether a browser should be allowed to render a page in an iframe.', example: 'X-Frame-Options: DENY', rfc: 'RFC 7034' },

  // Entity Headers
  { name: 'Content-Encoding', category: 'Entity', description: 'The type of encoding used on the data.', example: 'Content-Encoding: gzip', rfc: 'RFC 7231' },
  { name: 'Content-Language', category: 'Entity', description: 'Describes the natural language(s) of the intended audience.', example: 'Content-Language: en-US', rfc: 'RFC 7231' },
  { name: 'Content-Length', category: 'Entity', description: 'The size of the entity-body in bytes.', example: 'Content-Length: 348', rfc: 'RFC 7230' },
  { name: 'Content-Location', category: 'Entity', description: 'An alternate location for the returned data.', example: 'Content-Location: /documents/foo.json', rfc: 'RFC 7231' },
  { name: 'Content-Range', category: 'Entity', description: 'Where in a full body message this partial message belongs.', example: 'Content-Range: bytes 21010-47021/47022', rfc: 'RFC 7233' },
  { name: 'Content-Type', category: 'Entity', description: 'The MIME type of the content.', example: 'Content-Type: application/json; charset=utf-8', rfc: 'RFC 7231' },
  { name: 'Expires', category: 'Entity', description: 'Gives the date/time after which the response is considered stale.', example: 'Expires: Thu, 01 Dec 1994 16:00:00 GMT', rfc: 'RFC 7234' },
  { name: 'Last-Modified', category: 'Entity', description: 'The last modified date for the requested object.', example: 'Last-Modified: Tue, 15 Nov 1994 12:45:26 GMT', rfc: 'RFC 7232' },
];

export type CategoryFilterType = 'All' | HeaderCategory;

export function searchHeaders(
  query: string,
  categoryFilter: CategoryFilterType = 'All',
): HttpHeaderEntry[] {
  let results = HEADER_DATABASE;

  if (categoryFilter !== 'All') {
    results = results.filter((h) => h.category === categoryFilter);
  }

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.example.toLowerCase().includes(q),
    );
  }

  return results;
}
