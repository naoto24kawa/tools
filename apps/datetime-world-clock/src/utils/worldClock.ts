export interface CityTime {
  city: string;
  timezone: string;
  time: string;
  date: string;
  offset: string;
}

export const CITIES = [
  { city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { city: 'New York', timezone: 'America/New_York' },
  { city: 'London', timezone: 'Europe/London' },
  { city: 'Paris', timezone: 'Europe/Paris' },
  { city: 'Sydney', timezone: 'Australia/Sydney' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { city: 'Shanghai', timezone: 'Asia/Shanghai' },
  { city: 'Dubai', timezone: 'Asia/Dubai' },
  { city: 'Sao Paulo', timezone: 'America/Sao_Paulo' },
  { city: 'Moscow', timezone: 'Europe/Moscow' },
  { city: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Seoul', timezone: 'Asia/Seoul' },
] as const;

export function getCityTime(timezone: string, city: string, now: Date): CityTime {
  const time = now.toLocaleTimeString('ja-JP', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const date = now.toLocaleDateString('ja-JP', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const offset =
    now
      .toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'shortOffset' })
      .split(' ')
      .pop() ?? '';
  return { city, timezone, time, date, offset };
}

export function getAllCityTimes(now: Date): CityTime[] {
  return CITIES.map((c) => getCityTime(c.timezone, c.city, now));
}
