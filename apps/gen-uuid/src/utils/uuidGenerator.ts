export function generateUUIDv4(): string {
  return crypto.randomUUID();
}

export function generateULID(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const TIME_LEN = 10;
  const RANDOM_LEN = 16;

  const now = Date.now();
  let timeStr = '';
  let remaining = now;
  for (let i = TIME_LEN - 1; i >= 0; i--) {
    timeStr = ENCODING[remaining % 32] + timeStr;
    remaining = Math.floor(remaining / 32);
  }

  const randomBytes = new Uint8Array(RANDOM_LEN);
  crypto.getRandomValues(randomBytes);
  let randomStr = '';
  for (let i = 0; i < RANDOM_LEN; i++) {
    randomStr += ENCODING[randomBytes[i] % 32];
  }

  return timeStr + randomStr;
}

const UUID_FORMAT_OPTIONS = [
  { value: 'v4', label: 'UUID v4' },
  { value: 'ulid', label: 'ULID' },
] as const;

export { UUID_FORMAT_OPTIONS };

export type UUIDFormat = (typeof UUID_FORMAT_OPTIONS)[number]['value'];

export function generate(format: UUIDFormat): string {
  switch (format) {
    case 'v4':
      return generateUUIDv4();
    case 'ulid':
      return generateULID();
    default: {
      const _exhaustiveCheck: never = format;
      throw new Error(`Unsupported format: ${_exhaustiveCheck}`);
    }
  }
}

export function generateBulk(format: UUIDFormat, count: number): string[] {
  return Array.from({ length: count }, () => generate(format));
}
