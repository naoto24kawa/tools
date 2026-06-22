export interface BiorhythmValues {
  physical: number;      // 身体 23日周期
  emotional: number;     // 感情 28日周期
  intellectual: number;  // 知性 33日周期
  daysSinceBirth: number;
}

export interface BiorhythmSeries {
  dates: Date[];
  physical: number[];
  emotional: number[];
  intellectual: number[];
}

const PHYSICAL_CYCLE = 23;
const EMOTIONAL_CYCLE = 28;
const INTELLECTUAL_CYCLE = 33;

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const fromDay = Math.floor(from.getTime() / msPerDay);
  const toDay = Math.floor(to.getTime() / msPerDay);
  return toDay - fromDay;
}

export function calcBiorhythm(birthDate: Date, targetDate: Date): BiorhythmValues {
  const days = daysBetween(birthDate, targetDate);
  return {
    physical: Math.sin((2 * Math.PI * days) / PHYSICAL_CYCLE),
    emotional: Math.sin((2 * Math.PI * days) / EMOTIONAL_CYCLE),
    intellectual: Math.sin((2 * Math.PI * days) / INTELLECTUAL_CYCLE),
    daysSinceBirth: days,
  };
}

export function calcBiorhythmSeries(
  birthDate: Date,
  centerDate: Date,
  days: number,
): BiorhythmSeries {
  const msPerDay = 1000 * 60 * 60 * 24;
  const dates: Date[] = [];
  const physical: number[] = [];
  const emotional: number[] = [];
  const intellectual: number[] = [];

  const startMs = centerDate.getTime() - Math.floor(days / 2) * msPerDay;

  for (let i = 0; i < days; i++) {
    const date = new Date(startMs + i * msPerDay);
    const values = calcBiorhythm(birthDate, date);
    dates.push(date);
    physical.push(values.physical);
    emotional.push(values.emotional);
    intellectual.push(values.intellectual);
  }

  return { dates, physical, emotional, intellectual };
}
