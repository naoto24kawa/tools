import { describe, it, expect } from 'vitest';
import {
  detectIpVersion,
  ipv4ToBinary,
  getNetworkClass,
  isPrivateIpv4,
  isLoopbackIpv4,
  calculateSubnetMask,
  calculateNetworkAddress,
  calculateBroadcastAddress,
  expandIpv6,
  analyzeIp,
} from '../ipInfo';

describe('detectIpVersion', () => {
  it('detects IPv4', () => {
    expect(detectIpVersion('192.168.1.1')).toBe('IPv4');
    expect(detectIpVersion('10.0.0.1/24')).toBe('IPv4');
  });

  it('detects IPv6', () => {
    expect(detectIpVersion('::1')).toBe('IPv6');
    expect(detectIpVersion('2001:db8::1')).toBe('IPv6');
    expect(detectIpVersion('fe80::1/64')).toBe('IPv6');
  });

  it('returns unknown for invalid', () => {
    expect(detectIpVersion('not an ip')).toBe('unknown');
    expect(detectIpVersion('999.999.999.999')).toBe('unknown');
  });
});

describe('ipv4ToBinary', () => {
  it('converts correctly', () => {
    expect(ipv4ToBinary('192.168.1.1')).toBe('11000000.10101000.00000001.00000001');
    expect(ipv4ToBinary('0.0.0.0')).toBe('00000000.00000000.00000000.00000000');
  });
});

describe('getNetworkClass', () => {
  it('returns correct class', () => {
    expect(getNetworkClass([10, 0, 0, 1])).toBe('A');
    expect(getNetworkClass([172, 16, 0, 1])).toBe('B');
    expect(getNetworkClass([192, 168, 1, 1])).toBe('C');
    expect(getNetworkClass([224, 0, 0, 1])).toBe('D');
    expect(getNetworkClass([240, 0, 0, 1])).toBe('E');
  });
});

describe('isPrivateIpv4', () => {
  it('detects private ranges', () => {
    expect(isPrivateIpv4([10, 0, 0, 1])).toBe(true);
    expect(isPrivateIpv4([172, 16, 0, 1])).toBe(true);
    expect(isPrivateIpv4([192, 168, 1, 1])).toBe(true);
    expect(isPrivateIpv4([8, 8, 8, 8])).toBe(false);
  });
});

describe('isLoopbackIpv4', () => {
  it('detects loopback', () => {
    expect(isLoopbackIpv4([127, 0, 0, 1])).toBe(true);
    expect(isLoopbackIpv4([192, 168, 1, 1])).toBe(false);
  });
});

describe('calculateSubnetMask', () => {
  it('calculates correctly', () => {
    expect(calculateSubnetMask(24)).toBe('255.255.255.0');
    expect(calculateSubnetMask(16)).toBe('255.255.0.0');
    expect(calculateSubnetMask(8)).toBe('255.0.0.0');
    expect(calculateSubnetMask(32)).toBe('255.255.255.255');
  });
});

describe('calculateNetworkAddress', () => {
  it('calculates correctly', () => {
    expect(calculateNetworkAddress([192, 168, 1, 100], 24)).toBe('192.168.1.0');
    expect(calculateNetworkAddress([10, 20, 30, 40], 8)).toBe('10.0.0.0');
  });
});

describe('calculateBroadcastAddress', () => {
  it('calculates correctly', () => {
    expect(calculateBroadcastAddress([192, 168, 1, 100], 24)).toBe('192.168.1.255');
    expect(calculateBroadcastAddress([10, 20, 30, 40], 8)).toBe('10.255.255.255');
  });
});

describe('expandIpv6', () => {
  it('expands abbreviated addresses', () => {
    expect(expandIpv6('::1')).toBe('0000:0000:0000:0000:0000:0000:0000:0001');
    expect(expandIpv6('2001:db8::1')).toBe('2001:0db8:0000:0000:0000:0000:0000:0001');
  });
});

describe('analyzeIp', () => {
  it('analyzes IPv4 with CIDR', () => {
    const result = analyzeIp('192.168.1.100/24');
    expect(result).not.toBeNull();
    expect(result!.version).toBe('IPv4');
    expect(result!.isPrivate).toBe(true);
    expect(result!.networkClass).toBe('C');
    expect(result!.subnetMask).toBe('255.255.255.0');
    expect(result!.networkAddress).toBe('192.168.1.0');
    expect(result!.broadcastAddress).toBe('192.168.1.255');
    expect(result!.hostCount).toBe(254);
  });

  it('analyzes IPv6', () => {
    const result = analyzeIp('::1');
    expect(result).not.toBeNull();
    expect(result!.version).toBe('IPv6');
    expect(result!.isLoopback).toBe(true);
  });

  it('returns null for invalid', () => {
    expect(analyzeIp('not an ip')).toBeNull();
    expect(analyzeIp('')).toBeNull();
  });
});
