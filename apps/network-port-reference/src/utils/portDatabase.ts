export type Protocol = 'TCP' | 'UDP' | 'TCP/UDP';

export interface PortEntry {
  port: number;
  protocol: Protocol;
  service: string;
  description: string;
  category: 'well-known' | 'registered' | 'dynamic';
}

export const PORT_DATABASE: PortEntry[] = [
  { port: 20, protocol: 'TCP', service: 'FTP Data', description: 'File Transfer Protocol (data transfer)', category: 'well-known' },
  { port: 21, protocol: 'TCP', service: 'FTP Control', description: 'File Transfer Protocol (control)', category: 'well-known' },
  { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell', category: 'well-known' },
  { port: 23, protocol: 'TCP', service: 'Telnet', description: 'Telnet remote login', category: 'well-known' },
  { port: 25, protocol: 'TCP', service: 'SMTP', description: 'Simple Mail Transfer Protocol', category: 'well-known' },
  { port: 43, protocol: 'TCP', service: 'WHOIS', description: 'WHOIS directory service', category: 'well-known' },
  { port: 53, protocol: 'TCP/UDP', service: 'DNS', description: 'Domain Name System', category: 'well-known' },
  { port: 67, protocol: 'UDP', service: 'DHCP Server', description: 'Dynamic Host Configuration Protocol (server)', category: 'well-known' },
  { port: 68, protocol: 'UDP', service: 'DHCP Client', description: 'Dynamic Host Configuration Protocol (client)', category: 'well-known' },
  { port: 69, protocol: 'UDP', service: 'TFTP', description: 'Trivial File Transfer Protocol', category: 'well-known' },
  { port: 80, protocol: 'TCP', service: 'HTTP', description: 'Hypertext Transfer Protocol', category: 'well-known' },
  { port: 88, protocol: 'TCP/UDP', service: 'Kerberos', description: 'Kerberos authentication', category: 'well-known' },
  { port: 110, protocol: 'TCP', service: 'POP3', description: 'Post Office Protocol v3', category: 'well-known' },
  { port: 111, protocol: 'TCP/UDP', service: 'RPC', description: 'Remote Procedure Call', category: 'well-known' },
  { port: 119, protocol: 'TCP', service: 'NNTP', description: 'Network News Transfer Protocol', category: 'well-known' },
  { port: 123, protocol: 'UDP', service: 'NTP', description: 'Network Time Protocol', category: 'well-known' },
  { port: 135, protocol: 'TCP/UDP', service: 'MS RPC', description: 'Microsoft Remote Procedure Call', category: 'well-known' },
  { port: 137, protocol: 'UDP', service: 'NetBIOS Name', description: 'NetBIOS Name Service', category: 'well-known' },
  { port: 138, protocol: 'UDP', service: 'NetBIOS Datagram', description: 'NetBIOS Datagram Service', category: 'well-known' },
  { port: 139, protocol: 'TCP', service: 'NetBIOS Session', description: 'NetBIOS Session Service', category: 'well-known' },
  { port: 143, protocol: 'TCP', service: 'IMAP', description: 'Internet Message Access Protocol', category: 'well-known' },
  { port: 161, protocol: 'UDP', service: 'SNMP', description: 'Simple Network Management Protocol', category: 'well-known' },
  { port: 162, protocol: 'UDP', service: 'SNMP Trap', description: 'SNMP Trap', category: 'well-known' },
  { port: 179, protocol: 'TCP', service: 'BGP', description: 'Border Gateway Protocol', category: 'well-known' },
  { port: 194, protocol: 'TCP', service: 'IRC', description: 'Internet Relay Chat', category: 'well-known' },
  { port: 389, protocol: 'TCP/UDP', service: 'LDAP', description: 'Lightweight Directory Access Protocol', category: 'well-known' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'HTTP over TLS/SSL', category: 'well-known' },
  { port: 445, protocol: 'TCP', service: 'SMB', description: 'Server Message Block / Microsoft-DS', category: 'well-known' },
  { port: 465, protocol: 'TCP', service: 'SMTPS', description: 'SMTP over TLS/SSL', category: 'well-known' },
  { port: 500, protocol: 'UDP', service: 'IKE', description: 'Internet Key Exchange (IPsec)', category: 'well-known' },
  { port: 514, protocol: 'UDP', service: 'Syslog', description: 'System Logging Protocol', category: 'well-known' },
  { port: 515, protocol: 'TCP', service: 'LPD', description: 'Line Printer Daemon', category: 'well-known' },
  { port: 520, protocol: 'UDP', service: 'RIP', description: 'Routing Information Protocol', category: 'well-known' },
  { port: 587, protocol: 'TCP', service: 'SMTP Submission', description: 'SMTP Message Submission', category: 'well-known' },
  { port: 636, protocol: 'TCP', service: 'LDAPS', description: 'LDAP over TLS/SSL', category: 'well-known' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', description: 'IMAP over TLS/SSL', category: 'well-known' },
  { port: 995, protocol: 'TCP', service: 'POP3S', description: 'POP3 over TLS/SSL', category: 'well-known' },
  { port: 1080, protocol: 'TCP', service: 'SOCKS', description: 'SOCKS Proxy', category: 'registered' },
  { port: 1433, protocol: 'TCP', service: 'MS SQL', description: 'Microsoft SQL Server', category: 'registered' },
  { port: 1434, protocol: 'UDP', service: 'MS SQL Monitor', description: 'Microsoft SQL Server Monitor', category: 'registered' },
  { port: 1521, protocol: 'TCP', service: 'Oracle DB', description: 'Oracle Database', category: 'registered' },
  { port: 1723, protocol: 'TCP', service: 'PPTP', description: 'Point-to-Point Tunneling Protocol', category: 'registered' },
  { port: 2049, protocol: 'TCP/UDP', service: 'NFS', description: 'Network File System', category: 'registered' },
  { port: 2082, protocol: 'TCP', service: 'cPanel', description: 'cPanel default', category: 'registered' },
  { port: 2083, protocol: 'TCP', service: 'cPanel SSL', description: 'cPanel over SSL', category: 'registered' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL Database', category: 'registered' },
  { port: 3389, protocol: 'TCP/UDP', service: 'RDP', description: 'Remote Desktop Protocol', category: 'registered' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL Database', category: 'registered' },
  { port: 5672, protocol: 'TCP', service: 'AMQP', description: 'Advanced Message Queuing Protocol', category: 'registered' },
  { port: 5900, protocol: 'TCP', service: 'VNC', description: 'Virtual Network Computing', category: 'registered' },
  { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Redis key-value store', category: 'registered' },
  { port: 6443, protocol: 'TCP', service: 'Kubernetes API', description: 'Kubernetes API Server', category: 'registered' },
  { port: 8080, protocol: 'TCP', service: 'HTTP Alt', description: 'HTTP Alternate (commonly used for web proxies)', category: 'registered' },
  { port: 8443, protocol: 'TCP', service: 'HTTPS Alt', description: 'HTTPS Alternate', category: 'registered' },
  { port: 9090, protocol: 'TCP', service: 'Prometheus', description: 'Prometheus monitoring', category: 'registered' },
  { port: 9200, protocol: 'TCP', service: 'Elasticsearch', description: 'Elasticsearch HTTP', category: 'registered' },
  { port: 9300, protocol: 'TCP', service: 'Elasticsearch Transport', description: 'Elasticsearch node-to-node', category: 'registered' },
  { port: 11211, protocol: 'TCP/UDP', service: 'Memcached', description: 'Memcached caching system', category: 'registered' },
  { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB Database', category: 'registered' },
];

export type ProtocolFilter = 'all' | 'TCP' | 'UDP';
export type CategoryFilter = 'all' | 'well-known' | 'registered';

export function searchPorts(
  query: string,
  protocolFilter: ProtocolFilter = 'all',
  categoryFilter: CategoryFilter = 'all',
): PortEntry[] {
  let results = PORT_DATABASE;

  if (protocolFilter !== 'all') {
    results = results.filter(
      (entry) => entry.protocol === protocolFilter || entry.protocol === 'TCP/UDP',
    );
  }

  if (categoryFilter !== 'all') {
    results = results.filter((entry) => entry.category === categoryFilter);
  }

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    const portNum = parseInt(q, 10);

    results = results.filter((entry) => {
      if (!isNaN(portNum) && entry.port === portNum) return true;
      if (entry.service.toLowerCase().includes(q)) return true;
      if (entry.description.toLowerCase().includes(q)) return true;
      return false;
    });
  }

  return results;
}

export function getPortCategory(port: number): string {
  if (port >= 0 && port <= 1023) return 'Well-Known (0-1023)';
  if (port >= 1024 && port <= 49151) return 'Registered (1024-49151)';
  if (port >= 49152 && port <= 65535) return 'Dynamic/Private (49152-65535)';
  return 'Unknown';
}
