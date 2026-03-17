import { describe, expect, test } from 'vitest';
import { cidrContainsIp, cidrsOverlap, isValidCidr, parseCidr } from '../cidr';

describe('cidr', () => {
  test('parses CIDR notation', () => {
    const result = parseCidr('192.168.1.0/24');
    expect(result.networkAddress).toBe('192.168.1.0');
    expect(result.broadcastAddress).toBe('192.168.1.255');
    expect(result.totalAddresses).toBe(256);
  });
  test('checks IP containment', () => {
    expect(cidrContainsIp('192.168.1.0/24', '192.168.1.100')).toBe(true);
    expect(cidrContainsIp('192.168.1.0/24', '192.168.2.1')).toBe(false);
  });
  test('checks CIDR overlap', () => {
    expect(cidrsOverlap('10.0.0.0/8', '10.1.0.0/16')).toBe(true);
    expect(cidrsOverlap('192.168.1.0/24', '192.168.2.0/24')).toBe(false);
  });
  test('validates CIDR', () => {
    expect(isValidCidr('192.168.1.0/24')).toBe(true);
    expect(isValidCidr('999.0.0.0/24')).toBe(false);
    expect(isValidCidr('abc')).toBe(false);
  });
});
