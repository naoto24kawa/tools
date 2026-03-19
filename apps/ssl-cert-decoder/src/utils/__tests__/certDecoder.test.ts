import { describe, it, expect } from 'vitest';
import {
  isPemCertificate,
  formatDistinguishedName,
  formatDate,
  pemToBytes,
} from '../certDecoder';

describe('isPemCertificate', () => {
  it('recognizes valid PEM certificate', () => {
    const pem = `-----BEGIN CERTIFICATE-----
MIIBkTCB+wIJALKnHj/q3k7lMA0GCSqGSIb3DQEBCwUAMBExDzANBgNVBAMMBnRl
-----END CERTIFICATE-----`;
    expect(isPemCertificate(pem)).toBe(true);
  });

  it('rejects non-certificate PEM', () => {
    expect(isPemCertificate('-----BEGIN RSA PRIVATE KEY-----')).toBe(false);
    expect(isPemCertificate('not a cert')).toBe(false);
    expect(isPemCertificate('')).toBe(false);
  });
});

describe('pemToBytes', () => {
  it('converts base64 PEM to bytes', () => {
    const pem = `-----BEGIN CERTIFICATE-----
AQID
-----END CERTIFICATE-----`;
    const bytes = pemToBytes(pem);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(3);
    expect(bytes[0]).toBe(1);
    expect(bytes[1]).toBe(2);
    expect(bytes[2]).toBe(3);
  });
});

describe('formatDistinguishedName', () => {
  it('formats DN correctly', () => {
    const dn = { CN: 'example.com', O: 'Example Inc', C: 'US' };
    const result = formatDistinguishedName(dn);
    expect(result).toContain('CN=example.com');
    expect(result).toContain('O=Example Inc');
    expect(result).toContain('C=US');
  });

  it('handles empty DN', () => {
    expect(formatDistinguishedName({})).toBe('');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2024-12-31T23:59:59.000Z');
    expect(result).toContain('2024');
    expect(result).toContain('UTC');
  });
});
