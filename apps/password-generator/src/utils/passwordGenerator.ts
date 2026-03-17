export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = 'lI1O0';

export function generatePassword(options: PasswordOptions): string {
  let chars = '';
  if (options.uppercase) chars += UPPERCASE;
  if (options.lowercase) chars += LOWERCASE;
  if (options.numbers) chars += NUMBERS;
  if (options.symbols) chars += SYMBOLS;

  if (options.excludeAmbiguous) {
    chars = chars
      .split('')
      .filter((c) => !AMBIGUOUS.includes(c))
      .join('');
  }

  if (!chars) return '';

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => chars[v % chars.length]).join('');
}

export function calculateStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const labels = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong',
    'Very Strong',
    'Excellent',
    'Maximum',
  ];
  return { score, label: labels[Math.min(score, labels.length - 1)] };
}
