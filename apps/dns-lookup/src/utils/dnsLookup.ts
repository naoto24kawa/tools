export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'SOA' | 'PTR' | 'SRV';

export interface DnsRecordTypeInfo {
  type: DnsRecordType;
  name: string;
  description: string;
  format: string;
  example: string;
}

export const DNS_RECORD_TYPES: DnsRecordTypeInfo[] = [
  {
    type: 'A',
    name: 'Address Record',
    description: 'Maps a domain name to an IPv4 address. This is the most common DNS record type used to resolve domain names to IP addresses.',
    format: 'domain. IN A <IPv4 address>',
    example: 'example.com. IN A 93.184.216.34',
  },
  {
    type: 'AAAA',
    name: 'IPv6 Address Record',
    description: 'Maps a domain name to an IPv6 address. Similar to A records but for IPv6.',
    format: 'domain. IN AAAA <IPv6 address>',
    example: 'example.com. IN AAAA 2606:2800:220:1:248:1893:25c8:1946',
  },
  {
    type: 'CNAME',
    name: 'Canonical Name Record',
    description: 'Creates an alias from one domain name to another (the canonical name). Useful for pointing subdomains to other domains.',
    format: 'alias. IN CNAME canonical-name.',
    example: 'www.example.com. IN CNAME example.com.',
  },
  {
    type: 'MX',
    name: 'Mail Exchange Record',
    description: 'Specifies the mail server responsible for accepting email on behalf of a domain. Includes a priority value (lower = higher priority).',
    format: 'domain. IN MX <priority> <mail server>',
    example: 'example.com. IN MX 10 mail.example.com.',
  },
  {
    type: 'NS',
    name: 'Name Server Record',
    description: 'Delegates a DNS zone to an authoritative name server. Specifies which DNS servers are responsible for the domain.',
    format: 'domain. IN NS <nameserver>',
    example: 'example.com. IN NS ns1.example.com.',
  },
  {
    type: 'TXT',
    name: 'Text Record',
    description: 'Holds arbitrary text data. Commonly used for SPF (email authentication), DKIM, domain verification, and other purposes.',
    format: 'domain. IN TXT "<text>"',
    example: 'example.com. IN TXT "v=spf1 include:_spf.google.com ~all"',
  },
  {
    type: 'SOA',
    name: 'Start of Authority',
    description: 'Contains administrative information about a DNS zone, including the primary nameserver, hostmaster email, serial number, and refresh/retry/expire timers.',
    format: 'domain. IN SOA <primary ns> <hostmaster> <serial> <refresh> <retry> <expire> <minimum>',
    example: 'example.com. IN SOA ns1.example.com. admin.example.com. 2024010101 3600 900 604800 86400',
  },
  {
    type: 'PTR',
    name: 'Pointer Record',
    description: 'Maps an IP address to a domain name (reverse DNS). Used for reverse DNS lookups, commonly for email server verification.',
    format: '<reversed-ip>.in-addr.arpa. IN PTR <domain>',
    example: '34.216.184.93.in-addr.arpa. IN PTR example.com.',
  },
  {
    type: 'SRV',
    name: 'Service Record',
    description: 'Specifies the location (hostname and port) of servers for specific services. Used by protocols like SIP, XMPP, and LDAP.',
    format: '_service._proto.domain. IN SRV <priority> <weight> <port> <target>',
    example: '_sip._tcp.example.com. IN SRV 10 60 5060 sipserver.example.com.',
  },
];

export interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface DnsLookupResult {
  domain: string;
  recordType: DnsRecordType;
  status: number;
  answers: DnsAnswer[];
  error: string | null;
}

// DNS record type number mapping
const DNS_TYPE_NUMBERS: Record<DnsRecordType, number> = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  MX: 15,
  NS: 2,
  TXT: 16,
  SOA: 6,
  PTR: 12,
  SRV: 33,
};

export function getDnsTypeNumber(type: DnsRecordType): number {
  return DNS_TYPE_NUMBERS[type];
}

export function getRecordTypeInfo(type: DnsRecordType): DnsRecordTypeInfo | undefined {
  return DNS_RECORD_TYPES.find((r) => r.type === type);
}

export async function lookupDns(
  domain: string,
  recordType: DnsRecordType,
): Promise<DnsLookupResult> {
  if (!domain.trim()) {
    throw new Error('Domain name is required');
  }

  const cleanDomain = domain.trim().replace(/\.$/, '');
  const url = `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=${recordType}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`DNS query failed with status ${response.status}`);
    }

    const data = await response.json();

    const answers: DnsAnswer[] = (data.Answer || []).map((a: Record<string, unknown>) => ({
      name: String(a.name || ''),
      type: Number(a.type || 0),
      TTL: Number(a.TTL || 0),
      data: String(a.data || ''),
    }));

    return {
      domain: cleanDomain,
      recordType,
      status: data.Status || 0,
      answers,
      error: data.Status !== 0 ? `DNS query returned status ${data.Status} (NXDOMAIN or other error)` : null,
    };
  } catch (e) {
    return {
      domain: cleanDomain,
      recordType,
      status: -1,
      answers: [],
      error: e instanceof Error ? e.message : 'DNS lookup failed',
    };
  }
}

export function formatTtl(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function getDnsStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    0: 'NOERROR - Query completed successfully',
    1: 'FORMERR - Format error in query',
    2: 'SERVFAIL - Server failed to complete request',
    3: 'NXDOMAIN - Domain name does not exist',
    4: 'NOTIMP - Not implemented',
    5: 'REFUSED - Query refused',
  };
  return statusMap[status] || `Unknown status: ${status}`;
}
