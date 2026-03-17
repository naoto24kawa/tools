export interface SubnetInfo {
  ip: string;
  cidr: number;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  wildcardMask: string;
  binaryMask: string;
  ipClass: string;
  isPrivate: boolean;
}

function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numberToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
}

export function calculateSubnet(ip: string, cidr: number): SubnetInfo {
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const ipNum = ipToNumber(ip);
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalHosts = 2 ** (32 - cidr);

  const firstOctet = (ipNum >>> 24) & 255;
  let ipClass = 'A';
  if (firstOctet >= 128 && firstOctet < 192) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet < 224) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet < 240) ipClass = 'D';
  else if (firstOctet >= 240) ipClass = 'E';

  const isPrivate =
    firstOctet === 10 ||
    (firstOctet === 172 && ((ipNum >>> 16) & 255) >= 16 && ((ipNum >>> 16) & 255) <= 31) ||
    (firstOctet === 192 && ((ipNum >>> 16) & 255) === 168);

  return {
    ip,
    cidr,
    subnetMask: numberToIp(mask),
    networkAddress: numberToIp(network),
    broadcastAddress: numberToIp(broadcast),
    firstHost: cidr >= 31 ? numberToIp(network) : numberToIp(network + 1),
    lastHost: cidr >= 31 ? numberToIp(broadcast) : numberToIp(broadcast - 1),
    totalHosts,
    usableHosts: cidr >= 31 ? totalHosts : Math.max(totalHosts - 2, 0),
    wildcardMask: numberToIp(~mask >>> 0),
    binaryMask: mask
      .toString(2)
      .padStart(32, '0')
      .replace(/(.{8})/g, '$1.')
      .slice(0, -1),
    ipClass,
    isPrivate,
  };
}

export function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = Number(p);
    return Number.isInteger(n) && n >= 0 && n <= 255 && p === String(n);
  });
}
