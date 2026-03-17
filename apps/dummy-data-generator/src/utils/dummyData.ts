export type FieldType =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'company'
  | 'date'
  | 'number'
  | 'boolean'
  | 'uuid'
  | 'lorem';
export type OutputFormat = 'json' | 'csv';

export const FIELD_TYPES: FieldType[] = [
  'name',
  'email',
  'phone',
  'address',
  'company',
  'date',
  'number',
  'boolean',
  'uuid',
  'lorem',
];

export interface FieldConfig {
  name: string;
  type: FieldType;
}

const FIRST_NAMES = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'David',
  'Elizabeth',
  'Taro',
  'Hanako',
];
const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Tanaka',
  'Suzuki',
];
const COMPANIES = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella',
  'Stark Industries',
  'Wayne Enterprises',
  'Cyberdyne',
  'Soylent',
];
const DOMAINS = ['example.com', 'test.com', 'demo.org', 'sample.net'];
const STREETS = ['Main St', 'Oak Ave', 'Park Rd', 'Elm St', 'Cedar Ln', 'Pine Dr', 'Maple Ct'];
const CITIES = ['Tokyo', 'New York', 'London', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Seoul'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateField(type: FieldType): unknown {
  switch (type) {
    case 'name':
      return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
    case 'email':
      return `${randomItem(FIRST_NAMES).toLowerCase()}.${randomItem(LAST_NAMES).toLowerCase()}@${randomItem(DOMAINS)}`;
    case 'phone':
      return `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    case 'address':
      return `${Math.floor(Math.random() * 9999 + 1)} ${randomItem(STREETS)}, ${randomItem(CITIES)}`;
    case 'company':
      return randomItem(COMPANIES);
    case 'date': {
      const d = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000 * 5));
      return d.toISOString().split('T')[0];
    }
    case 'number':
      return Math.floor(Math.random() * 10000);
    case 'boolean':
      return Math.random() > 0.5;
    case 'uuid': {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
    case 'lorem':
      return 'Lorem ipsum dolor sit amet consectetur adipiscing elit';
    default:
      return '';
  }
}

export function generateData(fields: FieldConfig[], count: number): Record<string, unknown>[] {
  const data: Record<string, unknown>[] = [];
  for (let i = 0; i < count; i++) {
    const row: Record<string, unknown> = {};
    for (const field of fields) {
      row[field.name] = generateField(field.type);
    }
    data.push(row);
  }
  return data;
}

export function toJson(data: Record<string, unknown>[]): string {
  return JSON.stringify(data, null, 2);
}

export function toCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}
