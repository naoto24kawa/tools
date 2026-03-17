import { describe, expect, test } from 'vitest';
import { calculateSubnet, isValidIp } from '../subnet';

describe('subnet', () => {
  test('calculates /24 subnet', () => {
    const result = calculateSubnet('192.168.1.100', 24);
    expect(result.networkAddress).toBe('192.168.1.0');
    expect(result.broadcastAddress).toBe('192.168.1.255');
    expect(result.subnetMask).toBe('255.255.255.0');
    expect(result.usableHosts).toBe(254);
  });

  test('calculates /16 subnet', () => {
    const result = calculateSubnet('10.0.50.1', 16);
    expect(result.networkAddress).toBe('10.0.0.0');
    expect(result.usableHosts).toBe(65534);
  });

  test('validates IP', () => {
    expect(isValidIp('192.168.1.1')).toBe(true);
    expect(isValidIp('999.999.999.999')).toBe(false);
    expect(isValidIp('abc')).toBe(false);
  });

  test('detects private IP', () => {
    expect(calculateSubnet('192.168.1.1', 24).isPrivate).toBe(true);
    expect(calculateSubnet('8.8.8.8', 24).isPrivate).toBe(false);
  });
});
