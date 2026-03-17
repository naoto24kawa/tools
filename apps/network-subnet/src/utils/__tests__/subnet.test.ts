import { describe, expect, test } from 'bun:test';
import { calculateSubnet, isValidIP } from '../subnet';

describe('subnet', () => {
  test('192.168.1.0/24', () => {
    const r = calculateSubnet('192.168.1.0', 24);
    expect(r?.networkAddress).toBe('192.168.1.0');
    expect(r?.broadcastAddress).toBe('192.168.1.255');
    expect(r?.subnetMask).toBe('255.255.255.0');
    expect(r?.firstHost).toBe('192.168.1.1');
    expect(r?.lastHost).toBe('192.168.1.254');
    expect(r?.usableHosts).toBe(254);
    expect(r?.ipClass).toBe('C');
  });

  test('10.0.0.0/8', () => {
    const r = calculateSubnet('10.0.0.0', 8);
    expect(r?.networkAddress).toBe('10.0.0.0');
    expect(r?.subnetMask).toBe('255.0.0.0');
    expect(r?.totalHosts).toBe(16777216);
    expect(r?.ipClass).toBe('A');
  });

  test('172.16.0.0/16', () => {
    const r = calculateSubnet('172.16.0.0', 16);
    expect(r?.subnetMask).toBe('255.255.0.0');
    expect(r?.ipClass).toBe('B');
  });

  test('/32 single host', () => {
    const r = calculateSubnet('192.168.1.1', 32);
    expect(r?.totalHosts).toBe(1);
    expect(r?.networkAddress).toBe('192.168.1.1');
  });

  test('isValidIP', () => {
    expect(isValidIP('192.168.1.1')).toBe(true);
    expect(isValidIP('256.1.1.1')).toBe(false);
    expect(isValidIP('invalid')).toBe(false);
    expect(isValidIP('')).toBe(false);
  });

  test('invalid IP returns null', () => {
    expect(calculateSubnet('invalid', 24)).toBeNull();
  });

  test('invalid CIDR returns null', () => {
    expect(calculateSubnet('192.168.1.0', 33)).toBeNull();
  });
});
