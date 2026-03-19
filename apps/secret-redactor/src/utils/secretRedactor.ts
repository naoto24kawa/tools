export interface DetectedSecret {
  type: string;
  value: string;
  start: number;
  end: number;
}

interface PatternDef {
  type: string;
  pattern: RegExp;
}

const PATTERNS: PatternDef[] = [
  {
    type: 'AWS Access Key',
    pattern: /\b(AKIA[0-9A-Z]{16})\b/g,
  },
  {
    type: 'GitHub Token',
    pattern: /\b(ghp_[A-Za-z0-9]{36})\b/g,
  },
  {
    type: 'GitHub Token (Fine-grained)',
    pattern: /\b(github_pat_[A-Za-z0-9_]{82})\b/g,
  },
  {
    type: 'Slack Token',
    pattern: /\b(xox[bpras]-[A-Za-z0-9-]+)\b/g,
  },
  {
    type: 'Generic API Key',
    pattern: /(?:api[_-]?key|apikey|api[_-]?secret|api[_-]?token)\s*[:=]\s*['"]?([A-Za-z0-9_\-./+=]{16,})/gi,
  },
  {
    type: 'Bearer Token',
    pattern: /Bearer\s+([A-Za-z0-9_\-./+=]{20,})/g,
  },
  {
    type: 'Private Key',
    pattern: /(-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----)/g,
  },
  {
    type: 'Password in URL',
    pattern: /:\/\/[^:]+:([^@\s]{4,})@/g,
  },
  {
    type: 'Password Assignment',
    pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"]?([^\s'"]{4,})/gi,
  },
  {
    type: 'Connection String',
    pattern: /((?:mongodb|postgres|mysql|redis|amqp):\/\/[^\s]+)/gi,
  },
  {
    type: 'JWT',
    pattern: /\b(eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+)\b/g,
  },
  {
    type: 'Google API Key',
    pattern: /\b(AIza[0-9A-Za-z_-]{35})\b/g,
  },
  {
    type: 'Stripe Key',
    pattern: /\b(sk_live_[A-Za-z0-9]{24,})\b/g,
  },
  {
    type: 'Stripe Publishable Key',
    pattern: /\b(pk_live_[A-Za-z0-9]{24,})\b/g,
  },
];

export function detect(text: string): DetectedSecret[] {
  const results: DetectedSecret[] = [];

  for (const { type, pattern } of PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      // Use the first capture group if available, otherwise the full match
      const value = match[1] ?? match[0];
      const start = match.index + match[0].indexOf(value);
      results.push({
        type,
        value,
        start,
        end: start + value.length,
      });
    }
  }

  // Sort by start position and remove overlapping matches
  results.sort((a, b) => a.start - b.start);
  return deduplicateOverlaps(results);
}

function deduplicateOverlaps(secrets: DetectedSecret[]): DetectedSecret[] {
  if (secrets.length <= 1) return secrets;
  const result: DetectedSecret[] = [secrets[0]];
  for (let i = 1; i < secrets.length; i++) {
    const prev = result[result.length - 1];
    const current = secrets[i];
    // If current starts after previous ends, no overlap
    if (current.start >= prev.end) {
      result.push(current);
    } else if (current.value.length > prev.value.length) {
      // Keep the longer match
      result[result.length - 1] = current;
    }
  }
  return result;
}

export function redact(text: string, secrets?: DetectedSecret[], replacement = '[REDACTED]'): string {
  const detected = secrets ?? detect(text);
  if (detected.length === 0) return text;

  // Process from end to start to keep indices valid
  const sorted = [...detected].sort((a, b) => b.start - a.start);
  let result = text;
  for (const secret of sorted) {
    result = result.slice(0, secret.start) + replacement + result.slice(secret.end);
  }
  return result;
}
