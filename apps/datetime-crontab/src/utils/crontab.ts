export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export const DEFAULT_CRON: CronFields = {
  minute: '0',
  hour: '*',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '*',
};

export function cronToString(fields: CronFields): string {
  return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;
}

export function parseCron(cron: string): CronFields | null {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };
}

export function describeCron(fields: CronFields): string {
  const parts: string[] = [];
  if (fields.minute === '*') parts.push('毎分');
  else if (fields.minute.includes('/')) parts.push(`${fields.minute.split('/')[1]}分ごと`);
  else parts.push(`${fields.minute}分`);

  if (fields.hour === '*') parts.push('毎時');
  else if (fields.hour.includes('/')) parts.push(`${fields.hour.split('/')[1]}時間ごと`);
  else parts.push(`${fields.hour}時`);

  if (fields.dayOfMonth !== '*') parts.push(`${fields.dayOfMonth}日`);
  if (fields.month !== '*') parts.push(`${fields.month}月`);

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  if (fields.dayOfWeek !== '*') {
    const days = fields.dayOfWeek.split(',').map((d) => dayNames[Number(d)] ?? d);
    parts.push(`(${days.join(',')}曜日)`);
  }

  return parts.join(' ');
}

export const PRESETS = [
  { label: '毎分', cron: '* * * * *' },
  { label: '毎時', cron: '0 * * * *' },
  { label: '毎日 0:00', cron: '0 0 * * *' },
  { label: '毎週月曜 9:00', cron: '0 9 * * 1' },
  { label: '毎月1日 0:00', cron: '0 0 1 * *' },
  { label: '5分ごと', cron: '*/5 * * * *' },
  { label: '30分ごと', cron: '*/30 * * * *' },
] as const;
