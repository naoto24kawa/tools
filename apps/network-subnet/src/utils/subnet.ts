export interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipClass: string;
}

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
}

function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
}

function getClass(firstOctet: number): string {
  if (firstOctet < 128) return 'A';
  if (firstOctet < 192) return 'B';
  if (firstOctet < 224) return 'C';
  if (firstOctet < 240) return 'D (Multicast)';
  return 'E (Reserved)';
}

export function isValidIP(ip: string): boolean {
  return (
    /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
    ip.split('.').every((p) => Number(p) >= 0 && Number(p) <= 255)
  );
}

export function calculateSubnet(ip: string, cidr: number): SubnetInfo | null {
  if (!isValidIP(ip) || cidr < 0 || cidr > 32) return null;

  const ipNum = ipToNum(ip);
  const mask = cidrToMask(cidr);
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const totalHosts = 2 ** (32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : totalHosts - 2;

  return {
    networkAddress: numToIp(network),
    broadcastAddress: numToIp(broadcast),
    subnetMask: numToIp(mask),
    wildcardMask: numToIp(~mask >>> 0),
    firstHost: cidr >= 31 ? numToIp(network) : numToIp(network + 1),
    lastHost: cidr >= 31 ? numToIp(broadcast) : numToIp(broadcast - 1),
    totalHosts,
    usableHosts: Math.max(0, usableHosts),
    cidr,
    ipClass: getClass(Number(ip.split('.')[0])),
  };
}
