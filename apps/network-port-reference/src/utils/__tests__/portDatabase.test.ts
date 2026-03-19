import { describe, it, expect } from 'vitest';
import { searchPorts, getPortCategory, PORT_DATABASE } from '../portDatabase';

describe('searchPorts', () => {
  it('returns all ports when no filter', () => {
    const results = searchPorts('');
    expect(results.length).toBe(PORT_DATABASE.length);
  });

  it('searches by port number', () => {
    const results = searchPorts('80');
    expect(results.some((r) => r.port === 80)).toBe(true);
  });

  it('searches by service name', () => {
    const results = searchPorts('SSH');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].service).toBe('SSH');
  });

  it('filters by protocol TCP', () => {
    const results = searchPorts('', 'TCP');
    expect(results.every((r) => r.protocol === 'TCP' || r.protocol === 'TCP/UDP')).toBe(true);
  });

  it('filters by protocol UDP', () => {
    const results = searchPorts('', 'UDP');
    expect(results.every((r) => r.protocol === 'UDP' || r.protocol === 'TCP/UDP')).toBe(true);
  });

  it('filters by category', () => {
    const results = searchPorts('', 'all', 'well-known');
    expect(results.every((r) => r.category === 'well-known')).toBe(true);
  });

  it('combines search and filters', () => {
    const results = searchPorts('HTTP', 'TCP', 'well-known');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.category === 'well-known')).toBe(true);
  });
});

describe('getPortCategory', () => {
  it('categorizes well-known ports', () => {
    expect(getPortCategory(80)).toBe('Well-Known (0-1023)');
  });

  it('categorizes registered ports', () => {
    expect(getPortCategory(3306)).toBe('Registered (1024-49151)');
  });

  it('categorizes dynamic ports', () => {
    expect(getPortCategory(50000)).toBe('Dynamic/Private (49152-65535)');
  });
});
