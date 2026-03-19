export interface MaskingRule {
  id: string;
  name: string;
  pattern: RegExp;
  replacer: (match: string) => string;
  enabled: boolean;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal =
    local.length <= 2 ? '*'.repeat(local.length) : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
  return maskedLocal + '@' + domain;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '*'.repeat(phone.length);
  const lastFour = digits.slice(-4);
  return phone.replace(/\d(?=\d{4})/g, '*').replace(/\d{4}$/, lastFour);
}

export function maskCreditCard(cc: string): string {
  const digits = cc.replace(/\D/g, '');
  if (digits.length < 4) return '*'.repeat(cc.length);
  const lastFour = digits.slice(-4);
  const masked = '*'.repeat(digits.length - 4) + lastFour;
  // Reconstruct with original formatting
  let result = '';
  let digitIndex = 0;
  for (const char of cc) {
    if (/\d/.test(char)) {
      result += masked[digitIndex];
      digitIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

export function maskIPAddress(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return parts[0] + '.*.*.' + parts[3];
  }
  return ip;
}

export function maskName(name: string): string {
  const words = name.split(/\s+/);
  return words
    .map((w) => {
      if (w.length <= 1) return '*';
      return w[0] + '*'.repeat(w.length - 1);
    })
    .join(' ');
}

export function getDefaultRules(): MaskingRule[] {
  return [
    {
      id: 'email',
      name: 'Email Addresses',
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      replacer: maskEmail,
      enabled: true,
    },
    {
      id: 'phone',
      name: 'Phone Numbers',
      pattern: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/g,
      replacer: maskPhone,
      enabled: true,
    },
    {
      id: 'creditcard',
      name: 'Credit Card Numbers',
      pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      replacer: maskCreditCard,
      enabled: true,
    },
    {
      id: 'ip',
      name: 'IP Addresses',
      pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
      replacer: maskIPAddress,
      enabled: true,
    },
  ];
}

export function applyMasking(text: string, rules: MaskingRule[]): string {
  let result = text;
  for (const rule of rules) {
    if (!rule.enabled) continue;
    // Reset lastIndex for global regexes
    rule.pattern.lastIndex = 0;
    result = result.replace(new RegExp(rule.pattern.source, rule.pattern.flags), rule.replacer);
  }
  return result;
}

export function countMatches(text: string, rules: MaskingRule[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const rule of rules) {
    if (!rule.enabled) {
      counts.set(rule.id, 0);
      continue;
    }
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    const matches = text.match(regex);
    counts.set(rule.id, matches ? matches.length : 0);
  }
  return counts;
}
