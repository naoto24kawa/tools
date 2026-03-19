export type StrengthLevel = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';

export interface StrengthCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigits: boolean;
  hasSymbols: boolean;
  length: number;
}

export interface StrengthResult {
  score: number;
  level: StrengthLevel;
  label: string;
  entropy: number;
  criteria: StrengthCriteria;
  crackTime: string;
  suggestions: string[];
}

export function calculateEntropy(password: string): number {
  if (password.length === 0) return 0;

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

  if (poolSize === 0) return 0;

  return password.length * Math.log2(poolSize);
}

export function evaluateCriteria(password: string): StrengthCriteria {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigits: /[0-9]/.test(password),
    hasSymbols: /[^a-zA-Z0-9]/.test(password),
    length: password.length,
  };
}

export function evaluateStrength(password: string): StrengthResult {
  const entropy = calculateEntropy(password);
  const criteria = evaluateCriteria(password);
  const crackTime = estimateCrackTime(entropy);
  const suggestions = generateSuggestions(criteria);

  let score: number;
  let level: StrengthLevel;
  let label: string;

  if (entropy < 28) {
    score = 0;
    level = 'very-weak';
    label = 'Very Weak';
  } else if (entropy < 36) {
    score = 1;
    level = 'weak';
    label = 'Weak';
  } else if (entropy < 60) {
    score = 2;
    level = 'fair';
    label = 'Fair';
  } else if (entropy < 80) {
    score = 3;
    level = 'strong';
    label = 'Strong';
  } else {
    score = 4;
    level = 'very-strong';
    label = 'Very Strong';
  }

  return { score, level, label, entropy, criteria, crackTime, suggestions };
}

export function estimateCrackTime(entropy: number): string {
  if (entropy === 0) return 'Instant';

  // Assume 10 billion guesses per second (modern GPU cluster)
  const guessesPerSecond = 1e10;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond;

  if (seconds < 1) return 'Less than a second';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365 * 1000) return `${Math.round(seconds / (86400 * 365))} years`;
  if (seconds < 86400 * 365 * 1e6) return `${Math.round(seconds / (86400 * 365 * 1000))}K years`;
  if (seconds < 86400 * 365 * 1e9) return `${Math.round(seconds / (86400 * 365 * 1e6))}M years`;

  return 'Billions of years';
}

function generateSuggestions(criteria: StrengthCriteria): string[] {
  const suggestions: string[] = [];

  if (!criteria.minLength) {
    suggestions.push('Use at least 8 characters');
  }
  if (criteria.length < 12) {
    suggestions.push('Consider using 12 or more characters');
  }
  if (!criteria.hasUppercase) {
    suggestions.push('Add uppercase letters (A-Z)');
  }
  if (!criteria.hasLowercase) {
    suggestions.push('Add lowercase letters (a-z)');
  }
  if (!criteria.hasDigits) {
    suggestions.push('Add numbers (0-9)');
  }
  if (!criteria.hasSymbols) {
    suggestions.push('Add special characters (!@#$%^&*)');
  }

  return suggestions;
}
