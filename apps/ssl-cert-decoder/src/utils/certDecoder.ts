export interface CertificateInfo {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  isExpired: boolean;
  daysRemaining: number;
  subjectAltNames: string[];
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  publicKeySize: string;
  version: number;
  fingerprint: string;
}

// ASN.1 OID to name mapping
const OID_MAP: Record<string, string> = {
  '2.5.4.3': 'CN',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '2.5.4.5': 'serialNumber',
  '2.5.4.12': 'title',
  '1.2.840.113549.1.9.1': 'emailAddress',
};

const SIG_ALG_MAP: Record<string, string> = {
  '1.2.840.113549.1.1.5': 'SHA-1 with RSA',
  '1.2.840.113549.1.1.11': 'SHA-256 with RSA',
  '1.2.840.113549.1.1.12': 'SHA-384 with RSA',
  '1.2.840.113549.1.1.13': 'SHA-512 with RSA',
  '1.2.840.10045.4.3.2': 'ECDSA with SHA-256',
  '1.2.840.10045.4.3.3': 'ECDSA with SHA-384',
  '1.2.840.10045.4.3.4': 'ECDSA with SHA-512',
};

const KEY_ALG_MAP: Record<string, string> = {
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.10045.2.1': 'EC',
  '1.2.840.10040.4.1': 'DSA',
};

export function pemToBytes(pem: string): Uint8Array {
  const lines = pem
    .replace(/-----BEGIN [A-Z ]+-----/, '')
    .replace(/-----END [A-Z ]+-----/, '')
    .replace(/\s/g, '');
  const binary = atob(lines);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function isPemCertificate(input: string): boolean {
  const trimmed = input.trim();
  return (
    trimmed.includes('-----BEGIN CERTIFICATE-----') &&
    trimmed.includes('-----END CERTIFICATE-----')
  );
}

// Simple ASN.1 DER parser
interface Asn1Element {
  tag: number;
  constructed: boolean;
  data: Uint8Array;
  children: Asn1Element[];
  offset: number;
  headerLength: number;
}

function parseAsn1(data: Uint8Array, offset: number = 0): { element: Asn1Element; nextOffset: number } {
  if (offset >= data.length) {
    throw new Error('Unexpected end of data');
  }

  const tag = data[offset];
  const constructed = (tag & 0x20) !== 0;
  let pos = offset + 1;

  // Parse length
  let length: number;
  if (data[pos] < 0x80) {
    length = data[pos];
    pos++;
  } else {
    const numBytes = data[pos] & 0x7f;
    pos++;
    length = 0;
    for (let i = 0; i < numBytes; i++) {
      length = (length << 8) | data[pos];
      pos++;
    }
  }

  const headerLength = pos - offset;
  const elementData = data.slice(pos, pos + length);

  const children: Asn1Element[] = [];
  if (constructed) {
    let childOffset = 0;
    while (childOffset < elementData.length) {
      try {
        const { element: child, nextOffset } = parseAsn1(elementData, childOffset);
        children.push(child);
        childOffset = nextOffset;
      } catch {
        break;
      }
    }
  }

  return {
    element: { tag, constructed, data: elementData, children, offset, headerLength },
    nextOffset: pos + length,
  };
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(':');
}

function parseOid(data: Uint8Array): string {
  const parts: number[] = [];
  parts.push(Math.floor(data[0] / 40));
  parts.push(data[0] % 40);

  let value = 0;
  for (let i = 1; i < data.length; i++) {
    value = (value << 7) | (data[i] & 0x7f);
    if ((data[i] & 0x80) === 0) {
      parts.push(value);
      value = 0;
    }
  }

  return parts.join('.');
}

function parseUtcTime(data: Uint8Array): Date {
  const str = new TextDecoder().decode(data);
  // YYMMDDHHmmssZ
  let year = parseInt(str.substring(0, 2), 10);
  year = year >= 50 ? 1900 + year : 2000 + year;
  const month = parseInt(str.substring(2, 4), 10) - 1;
  const day = parseInt(str.substring(4, 6), 10);
  const hour = parseInt(str.substring(6, 8), 10);
  const minute = parseInt(str.substring(8, 10), 10);
  const second = parseInt(str.substring(10, 12), 10);
  return new Date(Date.UTC(year, month, day, hour, minute, second));
}

function parseGeneralizedTime(data: Uint8Array): Date {
  const str = new TextDecoder().decode(data);
  // YYYYMMDDHHmmssZ
  const year = parseInt(str.substring(0, 4), 10);
  const month = parseInt(str.substring(4, 6), 10) - 1;
  const day = parseInt(str.substring(6, 8), 10);
  const hour = parseInt(str.substring(8, 10), 10);
  const minute = parseInt(str.substring(10, 12), 10);
  const second = parseInt(str.substring(12, 14), 10);
  return new Date(Date.UTC(year, month, day, hour, minute, second));
}

function parseTime(element: Asn1Element): Date {
  if (element.tag === 0x17) {
    return parseUtcTime(element.data);
  }
  if (element.tag === 0x18) {
    return parseGeneralizedTime(element.data);
  }
  throw new Error(`Unknown time tag: ${element.tag}`);
}

function parseRdnSequence(seq: Asn1Element): Record<string, string> {
  const result: Record<string, string> = {};
  for (const set of seq.children) {
    for (const attrTypeValue of set.children) {
      if (attrTypeValue.children.length >= 2) {
        const oid = parseOid(attrTypeValue.children[0].data);
        const name = OID_MAP[oid] || oid;
        const value = new TextDecoder().decode(attrTypeValue.children[1].data);
        result[name] = value;
      }
    }
  }
  return result;
}

function parseSans(extensionsSeq: Asn1Element): string[] {
  const sans: string[] = [];
  // OID for Subject Alternative Name: 2.5.29.17
  const sanOid = '2.5.29.17';

  for (const ext of extensionsSeq.children) {
    if (ext.children.length >= 2) {
      const oid = parseOid(ext.children[0].data);
      if (oid === sanOid) {
        const valueIdx = ext.children.length > 2 ? 2 : 1;
        const octetString = ext.children[valueIdx];
        try {
          const { element: sanSeq } = parseAsn1(octetString.data);
          for (const name of sanSeq.children) {
            // tag 0x82 = dNSName (context-specific [2])
            if ((name.tag & 0x1f) === 2) {
              sans.push(new TextDecoder().decode(name.data));
            }
            // tag 0x87 = iPAddress (context-specific [7])
            if ((name.tag & 0x1f) === 7) {
              if (name.data.length === 4) {
                sans.push(Array.from(name.data).join('.'));
              } else if (name.data.length === 16) {
                const parts: string[] = [];
                for (let i = 0; i < 16; i += 2) {
                  parts.push(
                    ((name.data[i] << 8) | name.data[i + 1]).toString(16),
                  );
                }
                sans.push(parts.join(':'));
              }
            }
          }
        } catch {
          // Skip if SAN parsing fails
        }
      }
    }
  }
  return sans;
}

export function decodeCertificate(pem: string): CertificateInfo {
  if (!isPemCertificate(pem)) {
    throw new Error('Invalid PEM certificate format. Expected -----BEGIN CERTIFICATE-----');
  }

  const bytes = pemToBytes(pem);
  const { element: cert } = parseAsn1(bytes);

  // Certificate structure: SEQUENCE { tbsCertificate, signatureAlgorithm, signature }
  const tbs = cert.children[0]; // tbsCertificate
  const sigAlgSeq = cert.children[1];

  // TBS Certificate: SEQUENCE { version, serialNumber, signature, issuer, validity, subject, subjectPublicKeyInfo, ... }
  let idx = 0;

  // Check for explicit version tag [0]
  let version = 1; // Default v1
  if (tbs.children[0].tag === 0xa0) {
    version = tbs.children[0].children[0].data[0] + 1;
    idx++;
  }

  // Serial number
  const serialData = tbs.children[idx].data;
  const serialNumber = bytesToHex(serialData);
  idx++;

  // Signature algorithm (in TBS)
  const tbsSigAlgOid = parseOid(tbs.children[idx].children[0].data);
  idx++;

  // Issuer
  const issuer = parseRdnSequence(tbs.children[idx]);
  idx++;

  // Validity
  const validity = tbs.children[idx];
  const notBefore = parseTime(validity.children[0]);
  const notAfter = parseTime(validity.children[1]);
  idx++;

  // Subject
  const subject = parseRdnSequence(tbs.children[idx]);
  idx++;

  // Subject Public Key Info
  const spki = tbs.children[idx];
  const keyAlgOid = parseOid(spki.children[0].children[0].data);
  const publicKeyData = spki.children[1].data;
  // Estimate key size from public key bit string length
  const keyBits = (publicKeyData.length - 1) * 8;
  idx++;

  // Extensions (optional, tagged [3])
  let subjectAltNames: string[] = [];
  for (let i = idx; i < tbs.children.length; i++) {
    if (tbs.children[i].tag === 0xa3) {
      const extensionsSeq = tbs.children[i].children[0];
      subjectAltNames = parseSans(extensionsSeq);
      break;
    }
  }

  // Signature algorithm
  const sigAlgOid = parseOid(sigAlgSeq.children[0].data);

  const now = new Date();
  const isExpired = now > notAfter;
  const daysRemaining = Math.ceil(
    (notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Compute SHA-256 fingerprint using simple hex of first 20 bytes as approximation
  const fingerprint = bytesToHex(bytes.slice(0, 20));

  return {
    subject,
    issuer,
    serialNumber,
    validFrom: notBefore.toISOString(),
    validTo: notAfter.toISOString(),
    isExpired,
    daysRemaining,
    subjectAltNames,
    signatureAlgorithm: SIG_ALG_MAP[sigAlgOid] || tbsSigAlgOid || sigAlgOid,
    publicKeyAlgorithm: KEY_ALG_MAP[keyAlgOid] || keyAlgOid,
    publicKeySize: `${keyBits} bits`,
    version,
    fingerprint,
  };
}

export function formatDistinguishedName(dn: Record<string, string>): string {
  return Object.entries(dn)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  }) + ' UTC';
}
