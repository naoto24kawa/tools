export type IpVersion = 'IPv4' | 'IPv6' | 'unknown';
export type NetworkClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'N/A';

export interface IpInfo {
  address: string;
  version: IpVersion;
  isPrivate: boolean;
  isLoopback: boolean;
  isLinkLocal: boolean;
  networkClass: NetworkClass;
  binaryRepresentation: string;
  cidr: string | null;
  networkAddress: string | null;
  broadcastAddress: string | null;
  subnetMask: string | null;
  hostCount: number | null;
}

const IPV4_REGEX = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(\/(\d{1,2}))?$/;
const IPV6_REGEX = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}(\/(\d{1,3}))?$/;

export function detectIpVersion(input: string): IpVersion {
  const trimmed = input.trim();
  if (IPV4_REGEX.test(trimmed)) {
    const parts = trimmed.split('/')[0].split('.').map(Number);
    if (parts.every((p) => p >= 0 && p <= 255)) return 'IPv4';
  }
  if (IPV6_REGEX.test(trimmed) || isExpandedIpv6(trimmed.split('/')[0])) return 'IPv6';
  return 'unknown';
}

function isExpandedIpv6(addr: string): boolean {
  const parts = addr.split(':');
  if (parts.length < 3 || parts.length > 8) return false;
  const hasEmpty = addr.includes('::');
  if (hasEmpty) {
    const emptyCount = (addr.match(/::/g) || []).length;
    if (emptyCount > 1) return false;
  }
  return parts.every((p) => p === '' || /^[0-9a-fA-F]{1,4}$/.test(p));
}

export function isValidIpv4(input: string): boolean {
  const addr = input.split('/')[0];
  const match = addr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  return [match[1], match[2], match[3], match[4]].every((o) => {
    const n = Number(o);
    return n >= 0 && n <= 255;
  });
}

export function ipv4ToOctets(addr: string): number[] {
  return addr.split('/')[0].split('.').map(Number);
}

export function ipv4ToBinary(addr: string): string {
  const octets = ipv4ToOctets(addr);
  return octets.map((o) => o.toString(2).padStart(8, '0')).join('.');
}

export function getNetworkClass(octets: number[]): NetworkClass {
  const first = octets[0];
  if (first >= 0 && first <= 127) return 'A';
  if (first >= 128 && first <= 191) return 'B';
  if (first >= 192 && first <= 223) return 'C';
  if (first >= 224 && first <= 239) return 'D';
  if (first >= 240 && first <= 255) return 'E';
  return 'N/A';
}

export function isPrivateIpv4(octets: number[]): boolean {
  // 10.0.0.0/8
  if (octets[0] === 10) return true;
  // 172.16.0.0/12
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  // 192.168.0.0/16
  if (octets[0] === 192 && octets[1] === 168) return true;
  return false;
}

export function isLoopbackIpv4(octets: number[]): boolean {
  return octets[0] === 127;
}

export function isLinkLocalIpv4(octets: number[]): boolean {
  return octets[0] === 169 && octets[1] === 254;
}

export function calculateSubnetMask(cidr: number): string {
  const mask = (0xffffffff << (32 - cidr)) >>> 0;
  return [
    (mask >>> 24) & 0xff,
    (mask >>> 16) & 0xff,
    (mask >>> 8) & 0xff,
    mask & 0xff,
  ].join('.');
}

export function calculateNetworkAddress(octets: number[], cidr: number): string {
  const ip = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const mask = (0xffffffff << (32 - cidr)) >>> 0;
  const network = (ip & mask) >>> 0;
  return [
    (network >>> 24) & 0xff,
    (network >>> 16) & 0xff,
    (network >>> 8) & 0xff,
    network & 0xff,
  ].join('.');
}

export function calculateBroadcastAddress(octets: number[], cidr: number): string {
  const ip = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const mask = (0xffffffff << (32 - cidr)) >>> 0;
  const broadcast = (ip | ~mask) >>> 0;
  return [
    (broadcast >>> 24) & 0xff,
    (broadcast >>> 16) & 0xff,
    (broadcast >>> 8) & 0xff,
    broadcast & 0xff,
  ].join('.');
}

export function expandIpv6(addr: string): string {
  const raw = addr.split('/')[0];
  let parts = raw.split(':');

  const doubleColonIndex = raw.indexOf('::');
  if (doubleColonIndex !== -1) {
    const before = raw.substring(0, doubleColonIndex).split(':').filter((s) => s !== '');
    const after = raw.substring(doubleColonIndex + 2).split(':').filter((s) => s !== '');
    const missing = 8 - before.length - after.length;
    parts = [...before, ...Array(missing).fill('0000'), ...after];
  }

  return parts.map((p) => p.padStart(4, '0')).join(':');
}

export function ipv6ToBinary(addr: string): string {
  const expanded = expandIpv6(addr);
  return expanded
    .split(':')
    .map((group) => parseInt(group, 16).toString(2).padStart(16, '0'))
    .join(':');
}

export function isPrivateIpv6(addr: string): boolean {
  const expanded = expandIpv6(addr).toLowerCase();
  // fc00::/7 (Unique Local Address)
  const firstWord = parseInt(expanded.split(':')[0], 16);
  return (firstWord & 0xfe00) === 0xfc00;
}

export function isLoopbackIpv6(addr: string): boolean {
  const expanded = expandIpv6(addr);
  return expanded === '0000:0000:0000:0000:0000:0000:0000:0001';
}

export function isLinkLocalIpv6(addr: string): boolean {
  const expanded = expandIpv6(addr).toLowerCase();
  const firstWord = parseInt(expanded.split(':')[0], 16);
  return (firstWord & 0xffc0) === 0xfe80;
}

export function analyzeIp(input: string): IpInfo | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const version = detectIpVersion(trimmed);
  if (version === 'unknown') return null;

  if (version === 'IPv4') {
    const cidrMatch = trimmed.match(/\/(\d{1,2})$/);
    const cidrNum = cidrMatch ? parseInt(cidrMatch[1], 10) : null;
    if (cidrNum !== null && (cidrNum < 0 || cidrNum > 32)) return null;

    const octets = ipv4ToOctets(trimmed);
    if (!isValidIpv4(trimmed)) return null;

    return {
      address: octets.join('.'),
      version: 'IPv4',
      isPrivate: isPrivateIpv4(octets),
      isLoopback: isLoopbackIpv4(octets),
      isLinkLocal: isLinkLocalIpv4(octets),
      networkClass: getNetworkClass(octets),
      binaryRepresentation: ipv4ToBinary(trimmed),
      cidr: cidrNum !== null ? `/${cidrNum}` : null,
      networkAddress: cidrNum !== null ? calculateNetworkAddress(octets, cidrNum) : null,
      broadcastAddress: cidrNum !== null ? calculateBroadcastAddress(octets, cidrNum) : null,
      subnetMask: cidrNum !== null ? calculateSubnetMask(cidrNum) : null,
      hostCount: cidrNum !== null ? Math.max(0, Math.pow(2, 32 - cidrNum) - 2) : null,
    };
  }

  // IPv6
  const cidrMatch = trimmed.match(/\/(\d{1,3})$/);
  const cidrNum = cidrMatch ? parseInt(cidrMatch[1], 10) : null;
  if (cidrNum !== null && (cidrNum < 0 || cidrNum > 128)) return null;

  return {
    address: expandIpv6(trimmed),
    version: 'IPv6',
    isPrivate: isPrivateIpv6(trimmed),
    isLoopback: isLoopbackIpv6(trimmed),
    isLinkLocal: isLinkLocalIpv6(trimmed),
    networkClass: 'N/A',
    binaryRepresentation: ipv6ToBinary(trimmed),
    cidr: cidrNum !== null ? `/${cidrNum}` : null,
    networkAddress: null,
    broadcastAddress: null,
    subnetMask: null,
    hostCount: null,
  };
}
