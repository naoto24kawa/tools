import { describe, it, expect } from 'vitest';
import {
  maskEmail,
  maskPhone,
  maskCreditCard,
  maskIPAddress,
  maskName,
  applyMasking,
  getDefaultRules,
  countMatches,
} from '../dataMasking';

describe('maskEmail', () => {
  it('masks email preserving first char and domain', () => {
    const result = maskEmail('john@example.com');
    expect(result).toBe('j**n@example.com');
  });

  it('handles short local parts', () => {
    const result = maskEmail('ab@test.com');
    expect(result).toBe('**@test.com');
  });
});

describe('maskPhone', () => {
  it('masks phone number keeping last 4 digits', () => {
    const result = maskPhone('090-1234-5678');
    expect(result).toContain('5678');
    expect(result).toContain('*');
  });
});

describe('maskCreditCard', () => {
  it('masks credit card keeping last 4 digits', () => {
    const result = maskCreditCard('4111-1111-1111-1234');
    expect(result).toContain('1234');
    expect(result).toContain('*');
  });

  it('handles card without separators', () => {
    const result = maskCreditCard('4111111111111234');
    expect(result).toContain('1234');
  });
});

describe('maskIPAddress', () => {
  it('masks middle octets of IP address', () => {
    const result = maskIPAddress('192.168.1.100');
    expect(result).toBe('192.*.*.100');
  });
});

describe('maskName', () => {
  it('masks name keeping first letter', () => {
    const result = maskName('John Doe');
    expect(result).toBe('J*** D**');
  });

  it('handles single character words', () => {
    const result = maskName('A');
    expect(result).toBe('*');
  });
});

describe('applyMasking', () => {
  it('masks all PII types in text', () => {
    const text = 'Email: test@example.com, IP: 10.0.0.1';
    const rules = getDefaultRules();
    const result = applyMasking(text, rules);
    expect(result).not.toContain('test@example.com');
    expect(result).not.toContain('10.0.0.1');
  });

  it('respects disabled rules', () => {
    const text = 'Email: test@example.com';
    const rules = getDefaultRules().map((r) => ({ ...r, enabled: false }));
    const result = applyMasking(text, rules);
    expect(result).toContain('test@example.com');
  });
});

describe('countMatches', () => {
  it('counts matches per rule', () => {
    const text = 'a@b.com and c@d.com';
    const rules = getDefaultRules();
    const counts = countMatches(text, rules);
    expect(counts.get('email')).toBe(2);
  });
});
