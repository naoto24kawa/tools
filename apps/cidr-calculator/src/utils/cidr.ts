export interface CidrRange {
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  subnetMask: string;
}

function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) | Number(octet), 0) >>> 0;
}

function numberToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
}

export function parseCidr(cidr: string): CidrRange {
  const [ip, prefix] = cidr.split('/');
  const bits = Number(prefix);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  const ipNum = ipToNumber(ip);
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - bits);

  return {
    cidr,
    networkAddress: numberToIp(network),
    broadcastAddress: numberToIp(broadcast),
    firstHost: bits >= 31 ? numberToIp(network) : numberToIp(network + 1),
    lastHost: bits >= 31 ? numberToIp(broadcast) : numberToIp(broadcast - 1),
    totalAddresses: total,
    subnetMask: numberToIp(mask),
  };
}

export function cidrContainsIp(cidr: string, ip: string): boolean {
  const range = parseCidr(cidr);
  const ipNum = ipToNumber(ip);
  const networkNum = ipToNumber(range.networkAddress);
  const broadcastNum = ipToNumber(range.broadcastAddress);
  return ipNum >= networkNum && ipNum <= broadcastNum;
}

export function cidrsOverlap(cidr1: string, cidr2: string): boolean {
  const r1 = parseCidr(cidr1);
  const r2 = parseCidr(cidr2);
  const n1 = ipToNumber(r1.networkAddress);
  const b1 = ipToNumber(r1.broadcastAddress);
  const n2 = ipToNumber(r2.networkAddress);
  const b2 = ipToNumber(r2.broadcastAddress);
  return n1 <= b2 && n2 <= b1;
}

export function isValidCidr(cidr: string): boolean {
  const match = cidr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match) return false;
  const octets = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
  const prefix = Number(match[5]);
  return octets.every((o) => o >= 0 && o <= 255) && prefix >= 0 && prefix <= 32;
}

export function isValidIp(ip: string): boolean {
  const match = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const octets = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
  return octets.every((o) => o >= 0 && o <= 255);
}
