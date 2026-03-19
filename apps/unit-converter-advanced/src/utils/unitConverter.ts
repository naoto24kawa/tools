export interface UnitCategory {
  name: string;
  units: UnitDef[];
}

export interface UnitDef {
  id: string;
  name: string;
  symbol: string;
}

export interface ConversionResult {
  value: number;
  formula: string;
}

// Temperature conversions (special case - not simple multiplication)
function tempConvert(value: number, from: string, to: string): ConversionResult {
  // Convert to Celsius first
  let celsius: number;
  let toFormula: string;
  let fromFormula: string;

  switch (from) {
    case 'celsius':
      celsius = value;
      fromFormula = 'C';
      break;
    case 'fahrenheit':
      celsius = (value - 32) * (5 / 9);
      fromFormula = '(F - 32) * 5/9';
      break;
    case 'kelvin':
      celsius = value - 273.15;
      fromFormula = 'K - 273.15';
      break;
    default:
      throw new Error(`Unknown temperature unit: ${from}`);
  }

  let result: number;
  switch (to) {
    case 'celsius':
      result = celsius;
      toFormula = 'C';
      break;
    case 'fahrenheit':
      result = celsius * (9 / 5) + 32;
      toFormula = 'C * 9/5 + 32';
      break;
    case 'kelvin':
      result = celsius + 273.15;
      toFormula = 'C + 273.15';
      break;
    default:
      throw new Error(`Unknown temperature unit: ${to}`);
  }

  const formula = from === to ? `${value}` : `${fromFormula} -> ${toFormula}`;
  return { value: result, formula };
}

// Linear conversion factors (to base unit)
const linearFactors: Record<string, Record<string, { factor: number; base: string }>> = {
  pressure: {
    pascal: { factor: 1, base: 'Pa' },
    atmosphere: { factor: 101325, base: 'Pa' },
    bar: { factor: 100000, base: 'Pa' },
    psi: { factor: 6894.757, base: 'Pa' },
    mmhg: { factor: 133.322, base: 'Pa' },
  },
  energy: {
    joule: { factor: 1, base: 'J' },
    calorie: { factor: 4.184, base: 'J' },
    kilocalorie: { factor: 4184, base: 'J' },
    kwh: { factor: 3600000, base: 'J' },
    ev: { factor: 1.602176634e-19, base: 'J' },
    btu: { factor: 1055.06, base: 'J' },
  },
  force: {
    newton: { factor: 1, base: 'N' },
    lbf: { factor: 4.44822, base: 'N' },
    dyne: { factor: 1e-5, base: 'N' },
    kgf: { factor: 9.80665, base: 'N' },
  },
  speed: {
    'meter-per-second': { factor: 1, base: 'm/s' },
    'km-per-hour': { factor: 1 / 3.6, base: 'm/s' },
    mph: { factor: 0.44704, base: 'm/s' },
    knots: { factor: 0.514444, base: 'm/s' },
  },
  power: {
    watt: { factor: 1, base: 'W' },
    kilowatt: { factor: 1000, base: 'W' },
    horsepower: { factor: 745.7, base: 'W' },
    'btu-per-hour': { factor: 0.29307, base: 'W' },
  },
};

// Data unit conversion (supports both 1000 and 1024 bases)
const dataUnits1000: Record<string, number> = {
  bit: 1,
  byte: 8,
  kilobyte: 8000,
  megabyte: 8e6,
  gigabyte: 8e9,
  terabyte: 8e12,
};

const dataUnits1024: Record<string, number> = {
  bit: 1,
  byte: 8,
  kibibyte: 8 * 1024,
  mebibyte: 8 * 1024 ** 2,
  gibibyte: 8 * 1024 ** 3,
  tebibyte: 8 * 1024 ** 4,
};

export const categories: UnitCategory[] = [
  {
    name: 'Temperature',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '\u00B0C' },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '\u00B0F' },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K' },
    ],
  },
  {
    name: 'Pressure',
    units: [
      { id: 'pascal', name: 'Pascal', symbol: 'Pa' },
      { id: 'atmosphere', name: 'Atmosphere', symbol: 'atm' },
      { id: 'bar', name: 'Bar', symbol: 'bar' },
      { id: 'psi', name: 'PSI', symbol: 'psi' },
      { id: 'mmhg', name: 'mmHg', symbol: 'mmHg' },
    ],
  },
  {
    name: 'Energy',
    units: [
      { id: 'joule', name: 'Joule', symbol: 'J' },
      { id: 'calorie', name: 'Calorie', symbol: 'cal' },
      { id: 'kilocalorie', name: 'Kilocalorie', symbol: 'kcal' },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh' },
      { id: 'ev', name: 'Electron Volt', symbol: 'eV' },
      { id: 'btu', name: 'BTU', symbol: 'BTU' },
    ],
  },
  {
    name: 'Force',
    units: [
      { id: 'newton', name: 'Newton', symbol: 'N' },
      { id: 'lbf', name: 'Pound-force', symbol: 'lbf' },
      { id: 'dyne', name: 'Dyne', symbol: 'dyn' },
      { id: 'kgf', name: 'Kilogram-force', symbol: 'kgf' },
    ],
  },
  {
    name: 'Speed',
    units: [
      { id: 'meter-per-second', name: 'Meters/second', symbol: 'm/s' },
      { id: 'km-per-hour', name: 'Kilometers/hour', symbol: 'km/h' },
      { id: 'mph', name: 'Miles/hour', symbol: 'mph' },
      { id: 'knots', name: 'Knots', symbol: 'kn' },
    ],
  },
  {
    name: 'Power',
    units: [
      { id: 'watt', name: 'Watt', symbol: 'W' },
      { id: 'kilowatt', name: 'Kilowatt', symbol: 'kW' },
      { id: 'horsepower', name: 'Horsepower', symbol: 'hp' },
      { id: 'btu-per-hour', name: 'BTU/hour', symbol: 'BTU/h' },
    ],
  },
  {
    name: 'Data (SI / 1000)',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b' },
      { id: 'byte', name: 'Byte', symbol: 'B' },
      { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB' },
      { id: 'megabyte', name: 'Megabyte', symbol: 'MB' },
      { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB' },
      { id: 'terabyte', name: 'Terabyte', symbol: 'TB' },
    ],
  },
  {
    name: 'Data (Binary / 1024)',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b' },
      { id: 'byte', name: 'Byte', symbol: 'B' },
      { id: 'kibibyte', name: 'Kibibyte', symbol: 'KiB' },
      { id: 'mebibyte', name: 'Mebibyte', symbol: 'MiB' },
      { id: 'gibibyte', name: 'Gibibyte', symbol: 'GiB' },
      { id: 'tebibyte', name: 'Tebibyte', symbol: 'TiB' },
    ],
  },
];

export function convert(
  value: number,
  from: string,
  to: string,
  categoryName: string
): ConversionResult {
  if (from === to) {
    return { value, formula: `1 ${from} = 1 ${to}` };
  }

  if (categoryName === 'Temperature') {
    return tempConvert(value, from, to);
  }

  if (categoryName === 'Data (SI / 1000)') {
    const fromBits = dataUnits1000[from];
    const toBits = dataUnits1000[to];
    if (fromBits === undefined || toBits === undefined) {
      throw new Error(`Unknown data unit: ${from} or ${to}`);
    }
    const result = (value * fromBits) / toBits;
    const ratio = fromBits / toBits;
    return { value: result, formula: `1 ${from} = ${ratio} ${to}` };
  }

  if (categoryName === 'Data (Binary / 1024)') {
    const fromBits = dataUnits1024[from];
    const toBits = dataUnits1024[to];
    if (fromBits === undefined || toBits === undefined) {
      throw new Error(`Unknown data unit: ${from} or ${to}`);
    }
    const result = (value * fromBits) / toBits;
    const ratio = fromBits / toBits;
    return { value: result, formula: `1 ${from} = ${ratio} ${to}` };
  }

  // Linear categories
  const catKey = categoryName.toLowerCase();
  const catFactors = linearFactors[catKey];
  if (!catFactors) {
    throw new Error(`Unknown category: ${categoryName}`);
  }

  const fromDef = catFactors[from];
  const toDef = catFactors[to];
  if (!fromDef || !toDef) {
    throw new Error(`Unknown unit: ${from} or ${to}`);
  }

  const baseValue = value * fromDef.factor;
  const result = baseValue / toDef.factor;
  const ratio = fromDef.factor / toDef.factor;

  return {
    value: result,
    formula: `1 ${from} = ${ratio} ${to} (via ${fromDef.base})`,
  };
}
