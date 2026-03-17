export interface PasswordAnalysis {
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  entropy: number;
  score: number;
  label: string;
  suggestions: string[];
  timeToCrack: string;
}

function calculateEntropy(password: string): number {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
  if (poolSize === 0) return 0;
  return password.length * Math.log2(poolSize);
}

function estimateTimeToCrack(entropy: number): string {
  const guessesPerSecond = 1e10;
  const totalGuesses = 2 ** entropy;
  const seconds = totalGuesses / guessesPerSecond / 2;

  if (seconds < 1) return '即座';
  if (seconds < 60) return `${Math.ceil(seconds)}秒`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}分`;
  if (seconds < 86400) return `${Math.ceil(seconds / 3600)}時間`;
  if (seconds < 86400 * 365) return `${Math.ceil(seconds / 86400)}日`;
  if (seconds < 86400 * 365 * 1000) return `${Math.ceil(seconds / (86400 * 365))}年`;
  if (seconds < 86400 * 365 * 1e6) return `${Math.ceil(seconds / (86400 * 365 * 1000))}千年`;
  return '数百万年以上';
}

export function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);
  const entropy = calculateEntropy(password);

  const suggestions: string[] = [];
  if (length < 8) suggestions.push('8文字以上にしてください');
  if (!hasUppercase) suggestions.push('大文字を含めてください');
  if (!hasLowercase) suggestions.push('小文字を含めてください');
  if (!hasNumbers) suggestions.push('数字を含めてください');
  if (!hasSymbols) suggestions.push('記号を含めてください');
  if (length < 12) suggestions.push('12文字以上が推奨です');

  let score: number;
  let label: string;
  if (entropy < 28) {
    score = 0;
    label = 'とても弱い';
  } else if (entropy < 36) {
    score = 1;
    label = '弱い';
  } else if (entropy < 60) {
    score = 2;
    label = '普通';
  } else if (entropy < 80) {
    score = 3;
    label = '強い';
  } else {
    score = 4;
    label = 'とても強い';
  }

  return {
    length,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
    entropy: Math.round(entropy * 10) / 10,
    score,
    label,
    suggestions,
    timeToCrack: estimateTimeToCrack(entropy),
  };
}
