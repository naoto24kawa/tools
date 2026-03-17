export interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
  expiresAt: string | null;
  issuedAt: string | null;
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function decodeJWT(token: string): DecodedJWT {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: expected 3 parts separated by dots');
  }

  const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
  const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
  const signature = parts[2];

  let isExpired: boolean | null = null;
  let expiresAt: string | null = null;
  let issuedAt: string | null = null;

  if (typeof payload.exp === 'number') {
    expiresAt = new Date(payload.exp * 1000).toISOString();
    isExpired = Date.now() > payload.exp * 1000;
  }

  if (typeof payload.iat === 'number') {
    issuedAt = new Date(payload.iat * 1000).toISOString();
  }

  return { header, payload, signature, isExpired, expiresAt, issuedAt };
}

export function formatJSON(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}
