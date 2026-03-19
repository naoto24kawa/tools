export interface DetectedPII {
  type: string;
  value: string;
  start: number;
  end: number;
}

export type AnonymizeMode = 'mask' | 'fake' | 'hash';

interface PatternDef {
  type: string;
  pattern: RegExp;
}

const PATTERNS: PatternDef[] = [
  {
    type: 'Email',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  },
  {
    type: 'Phone (JP)',
    pattern: /\b0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}\b/g,
  },
  {
    type: 'Credit Card',
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  },
  {
    type: 'IP Address',
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  },
  {
    type: 'Date of Birth',
    pattern: /\b(?:19|20)\d{2}[/-](?:0[1-9]|1[0-2])[/-](?:0[1-9]|[12]\d|3[01])\b/g,
  },
  {
    type: 'Postal Code (JP)',
    pattern: /\b\d{3}-\d{4}\b/g,
  },
];

export function detectPII(text: string): DetectedPII[] {
  const results: DetectedPII[] = [];

  for (const { type, pattern } of PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let matchResult: RegExpExecArray | null;
    while ((matchResult = regex.exec(text)) !== null) {
      const value = matchResult[0];
      results.push({
        type,
        value,
        start: matchResult.index,
        end: matchResult.index + value.length,
      });
    }
  }

  results.sort((a, b) => a.start - b.start);
  return deduplicateOverlaps(results);
}

function deduplicateOverlaps(items: DetectedPII[]): DetectedPII[] {
  if (items.length <= 1) return items;
  const result: DetectedPII[] = [items[0]];
  for (let i = 1; i < items.length; i++) {
    const prev = result[result.length - 1];
    const current = items[i];
    if (current.start >= prev.end) {
      result.push(current);
    } else if (current.value.length > prev.value.length) {
      result[result.length - 1] = current;
    }
  }
  return result;
}

function maskValue(value: string, type: string): string {
  switch (type) {
    case 'Email': {
      const atIndex = value.indexOf('@');
      if (atIndex <= 1) return '***@***.***';
      return value[0] + '***@***.***';
    }
    case 'Phone (JP)':
      return value.slice(0, 3) + '-****-****';
    case 'Credit Card':
      return '**** **** **** ' + value.replace(/[\s-]/g, '').slice(-4);
    case 'IP Address':
      return '***.***.***.***';
    case 'Postal Code (JP)':
      return '***-****';
    default:
      return '*'.repeat(value.length);
  }
}

function fakeValue(type: string): string {
  switch (type) {
    case 'Email':
      return 'user@example.com';
    case 'Phone (JP)':
      return '090-0000-0000';
    case 'Credit Card':
      return '0000-0000-0000-0000';
    case 'IP Address':
      return '192.0.2.1';
    case 'Date of Birth':
      return '2000-01-01';
    case 'Postal Code (JP)':
      return '100-0001';
    default:
      return '[ANONYMIZED]';
  }
}

function simpleHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const hexStr = Math.abs(hash).toString(16).padStart(8, '0');
  return '[hash:' + hexStr + ']';
}

export function anonymize(
  text: string,
  piiItems?: DetectedPII[],
  mode: AnonymizeMode = 'mask'
): string {
  const detected = piiItems ?? detectPII(text);
  if (detected.length === 0) return text;

  const sorted = [...detected].sort((a, b) => b.start - a.start);
  let result = text;

  for (const pii of sorted) {
    let replacement: string;
    switch (mode) {
      case 'mask':
        replacement = maskValue(pii.value, pii.type);
        break;
      case 'fake':
        replacement = fakeValue(pii.type);
        break;
      case 'hash':
        replacement = simpleHash(pii.value);
        break;
    }
    result = result.slice(0, pii.start) + replacement + result.slice(pii.end);
  }

  return result;
}
