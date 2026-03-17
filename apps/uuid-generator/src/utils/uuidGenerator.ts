export function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function generateULID(): string {
  // Timestamp (48 bits, 10 chars)
  const now = Date.now();
  let timestamp = '';
  let t = now;
  for (let i = 0; i < 10; i++) {
    timestamp = CROCKFORD[t % 32] + timestamp;
    t = Math.floor(t / 32);
  }

  // Random (80 bits, 16 chars)
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  let random = '';
  // Simple encoding: use 5 bits per char from random bytes
  let bits = 0;
  let val = 0;
  let ri = 0;
  for (let i = 0; i < 16; i++) {
    while (bits < 5 && ri < randomBytes.length) {
      val = (val << 8) | randomBytes[ri++];
      bits += 8;
    }
    bits -= 5;
    random += CROCKFORD[(val >> bits) & 0x1f];
  }

  return timestamp + random;
}

export function parseUUID(uuid: string): { version: string; variant: string; valid: boolean } {
  const pattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-([0-9a-f])[0-9a-f]{3}-[0-9a-f]{12}$/i;
  const match = uuid.match(pattern);
  if (!match) return { version: 'N/A', variant: 'N/A', valid: false };

  const version = `v${match[1]}`;
  const variantBit = Number.parseInt(match[2], 16);
  let variant = 'Unknown';
  if ((variantBit & 0x8) === 0) variant = 'NCS';
  else if ((variantBit & 0xc) === 0x8) variant = 'RFC 4122';
  else if ((variantBit & 0xe) === 0xc) variant = 'Microsoft';
  else variant = 'Future';

  return { version, variant, valid: true };
}

export type IdType = 'uuid-v4' | 'ulid';
export const ID_TYPES = ['uuid-v4', 'ulid'] as const;
