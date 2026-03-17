const FIRST_NAMES = [
  '太郎',
  '花子',
  '一郎',
  '美咲',
  '翔太',
  '愛',
  '大輔',
  '由美',
  '健太',
  '真由美',
  'John',
  'Jane',
  'Alice',
  'Bob',
  'Charlie',
];
const LAST_NAMES = [
  '田中',
  '鈴木',
  '佐藤',
  '山田',
  '高橋',
  '渡辺',
  '伊藤',
  '中村',
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
];
const DOMAINS = ['example.com', 'test.co.jp', 'mail.com', 'company.org', 'dev.io'];
const CITIES = [
  'Tokyo',
  'Osaka',
  'Kyoto',
  'Yokohama',
  'Nagoya',
  'Sapporo',
  'Fukuoka',
  'New York',
  'London',
  'Paris',
];
const STREETS = ['Main St', 'Oak Ave', '1-2-3', '4-5-6', 'Elm Dr', '7-8-9'];

function pick<T>(arr: readonly T[]): T {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return arr[a[0] % arr.length];
}

function randomInt(min: number, max: number): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return min + (a[0] % (max - min + 1));
}

export interface DummyRecord {
  name: string;
  email: string;
  age: number;
  city: string;
  address: string;
  phone: string;
}

export function generateDummyRecord(): DummyRecord {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const name = `${lastName} ${firstName}`;
  const email = `${firstName.toLowerCase()}${randomInt(1, 999)}@${pick(DOMAINS)}`;
  return {
    name,
    email,
    age: randomInt(18, 80),
    city: pick(CITIES),
    address: `${pick(STREETS)}, ${pick(CITIES)}`,
    phone: `0${randomInt(10, 99)}-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
  };
}

export function generateDummyData(count: number): DummyRecord[] {
  return Array.from({ length: count }, () => generateDummyRecord());
}

export function toCSV(data: DummyRecord[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((r) => Object.values(r).join(','));
  return [headers, ...rows].join('\n');
}

export function toJSON(data: DummyRecord[]): string {
  return JSON.stringify(data, null, 2);
}
