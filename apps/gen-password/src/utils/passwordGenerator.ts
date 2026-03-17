export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeChars: string;
  count: number;
}

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeChars: '',
  count: 5,
};

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getCharPool(options: PasswordOptions): string {
  let pool = '';
  if (options.uppercase) pool += UPPERCASE;
  if (options.lowercase) pool += LOWERCASE;
  if (options.numbers) pool += NUMBERS;
  if (options.symbols) pool += SYMBOLS;

  if (options.excludeChars) {
    const excluded = new Set(options.excludeChars);
    pool = [...pool].filter((c) => !excluded.has(c)).join('');
  }

  return pool;
}

function secureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

export function generatePassword(options: PasswordOptions): string {
  const pool = getCharPool(options);
  if (pool.length === 0) return '';

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += pool[secureRandom(pool.length)];
  }
  return password;
}

export function generatePasswords(options: PasswordOptions): string[] {
  const passwords: string[] = [];
  for (let i = 0; i < options.count; i++) {
    passwords.push(generatePassword(options));
  }
  return passwords;
}

export function estimateStrength(password: string): { score: number; label: string } {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = password.length * Math.log2(poolSize || 1);

  if (entropy < 28) return { score: 0, label: 'とても弱い' };
  if (entropy < 36) return { score: 1, label: '弱い' };
  if (entropy < 60) return { score: 2, label: '普通' };
  if (entropy < 80) return { score: 3, label: '強い' };
  return { score: 4, label: 'とても強い' };
}
