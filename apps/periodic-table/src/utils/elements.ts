export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: ElementCategory;
  group: number;
  period: number;
  electronConfig: string;
  electronegativity: number | null;
  meltingPoint: number | null;
  boilingPoint: number | null;
}

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': 'bg-red-200 text-red-900',
  'alkaline-earth': 'bg-orange-200 text-orange-900',
  'transition-metal': 'bg-yellow-200 text-yellow-900',
  'post-transition-metal': 'bg-green-200 text-green-900',
  'metalloid': 'bg-teal-200 text-teal-900',
  'nonmetal': 'bg-blue-200 text-blue-900',
  'halogen': 'bg-indigo-200 text-indigo-900',
  'noble-gas': 'bg-purple-200 text-purple-900',
  'lanthanide': 'bg-pink-200 text-pink-900',
  'actinide': 'bg-rose-200 text-rose-900',
};

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth': 'Alkaline Earth Metal',
  'transition-metal': 'Transition Metal',
  'post-transition-metal': 'Post-transition Metal',
  'metalloid': 'Metalloid',
  'nonmetal': 'Nonmetal',
  'halogen': 'Halogen',
  'noble-gas': 'Noble Gas',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
};

// Compact data: [number, symbol, name, mass, category, group, period, electronConfig, electronegativity, meltingPoint, boilingPoint]
type RawElement = [number, string, string, number, ElementCategory, number, number, string, number | null, number | null, number | null];

const RAW_ELEMENTS: RawElement[] = [
  [1, 'H', 'Hydrogen', 1.008, 'nonmetal', 1, 1, '1s1', 2.20, -259, -253],
  [2, 'He', 'Helium', 4.003, 'noble-gas', 18, 1, '1s2', null, -272, -269],
  [3, 'Li', 'Lithium', 6.941, 'alkali-metal', 1, 2, '[He] 2s1', 0.98, 181, 1342],
  [4, 'Be', 'Beryllium', 9.012, 'alkaline-earth', 2, 2, '[He] 2s2', 1.57, 1287, 2469],
  [5, 'B', 'Boron', 10.81, 'metalloid', 13, 2, '[He] 2s2 2p1', 2.04, 2076, 3927],
  [6, 'C', 'Carbon', 12.01, 'nonmetal', 14, 2, '[He] 2s2 2p2', 2.55, 3550, 4027],
  [7, 'N', 'Nitrogen', 14.01, 'nonmetal', 15, 2, '[He] 2s2 2p3', 3.04, -210, -196],
  [8, 'O', 'Oxygen', 16.00, 'nonmetal', 16, 2, '[He] 2s2 2p4', 3.44, -218, -183],
  [9, 'F', 'Fluorine', 19.00, 'halogen', 17, 2, '[He] 2s2 2p5', 3.98, -220, -188],
  [10, 'Ne', 'Neon', 20.18, 'noble-gas', 18, 2, '[He] 2s2 2p6', null, -249, -246],
  [11, 'Na', 'Sodium', 22.99, 'alkali-metal', 1, 3, '[Ne] 3s1', 0.93, 98, 883],
  [12, 'Mg', 'Magnesium', 24.31, 'alkaline-earth', 2, 3, '[Ne] 3s2', 1.31, 650, 1090],
  [13, 'Al', 'Aluminium', 26.98, 'post-transition-metal', 13, 3, '[Ne] 3s2 3p1', 1.61, 660, 2519],
  [14, 'Si', 'Silicon', 28.09, 'metalloid', 14, 3, '[Ne] 3s2 3p2', 1.90, 1414, 2900],
  [15, 'P', 'Phosphorus', 30.97, 'nonmetal', 15, 3, '[Ne] 3s2 3p3', 2.19, 44, 280],
  [16, 'S', 'Sulfur', 32.07, 'nonmetal', 16, 3, '[Ne] 3s2 3p4', 2.58, 115, 445],
  [17, 'Cl', 'Chlorine', 35.45, 'halogen', 17, 3, '[Ne] 3s2 3p5', 3.16, -101, -34],
  [18, 'Ar', 'Argon', 39.95, 'noble-gas', 18, 3, '[Ne] 3s2 3p6', null, -189, -186],
  [19, 'K', 'Potassium', 39.10, 'alkali-metal', 1, 4, '[Ar] 4s1', 0.82, 64, 759],
  [20, 'Ca', 'Calcium', 40.08, 'alkaline-earth', 2, 4, '[Ar] 4s2', 1.00, 842, 1484],
  [21, 'Sc', 'Scandium', 44.96, 'transition-metal', 3, 4, '[Ar] 3d1 4s2', 1.36, 1541, 2830],
  [22, 'Ti', 'Titanium', 47.87, 'transition-metal', 4, 4, '[Ar] 3d2 4s2', 1.54, 1668, 3287],
  [23, 'V', 'Vanadium', 50.94, 'transition-metal', 5, 4, '[Ar] 3d3 4s2', 1.63, 1910, 3407],
  [24, 'Cr', 'Chromium', 52.00, 'transition-metal', 6, 4, '[Ar] 3d5 4s1', 1.66, 1907, 2671],
  [25, 'Mn', 'Manganese', 54.94, 'transition-metal', 7, 4, '[Ar] 3d5 4s2', 1.55, 1246, 2061],
  [26, 'Fe', 'Iron', 55.85, 'transition-metal', 8, 4, '[Ar] 3d6 4s2', 1.83, 1538, 2861],
  [27, 'Co', 'Cobalt', 58.93, 'transition-metal', 9, 4, '[Ar] 3d7 4s2', 1.88, 1495, 2927],
  [28, 'Ni', 'Nickel', 58.69, 'transition-metal', 10, 4, '[Ar] 3d8 4s2', 1.91, 1455, 2913],
  [29, 'Cu', 'Copper', 63.55, 'transition-metal', 11, 4, '[Ar] 3d10 4s1', 1.90, 1085, 2562],
  [30, 'Zn', 'Zinc', 65.38, 'transition-metal', 12, 4, '[Ar] 3d10 4s2', 1.65, 420, 907],
  [31, 'Ga', 'Gallium', 69.72, 'post-transition-metal', 13, 4, '[Ar] 3d10 4s2 4p1', 1.81, 30, 2204],
  [32, 'Ge', 'Germanium', 72.63, 'metalloid', 14, 4, '[Ar] 3d10 4s2 4p2', 2.01, 938, 2820],
  [33, 'As', 'Arsenic', 74.92, 'metalloid', 15, 4, '[Ar] 3d10 4s2 4p3', 2.18, 817, 614],
  [34, 'Se', 'Selenium', 78.97, 'nonmetal', 16, 4, '[Ar] 3d10 4s2 4p4', 2.55, 221, 685],
  [35, 'Br', 'Bromine', 79.90, 'halogen', 17, 4, '[Ar] 3d10 4s2 4p5', 2.96, -7, 59],
  [36, 'Kr', 'Krypton', 83.80, 'noble-gas', 18, 4, '[Ar] 3d10 4s2 4p6', null, -157, -153],
  [37, 'Rb', 'Rubidium', 85.47, 'alkali-metal', 1, 5, '[Kr] 5s1', 0.82, 39, 688],
  [38, 'Sr', 'Strontium', 87.62, 'alkaline-earth', 2, 5, '[Kr] 5s2', 0.95, 777, 1382],
  [39, 'Y', 'Yttrium', 88.91, 'transition-metal', 3, 5, '[Kr] 4d1 5s2', 1.22, 1526, 3345],
  [40, 'Zr', 'Zirconium', 91.22, 'transition-metal', 4, 5, '[Kr] 4d2 5s2', 1.33, 1855, 4409],
  [41, 'Nb', 'Niobium', 92.91, 'transition-metal', 5, 5, '[Kr] 4d4 5s1', 1.60, 2477, 4744],
  [42, 'Mo', 'Molybdenum', 95.95, 'transition-metal', 6, 5, '[Kr] 4d5 5s1', 2.16, 2623, 4639],
  [43, 'Tc', 'Technetium', 98.00, 'transition-metal', 7, 5, '[Kr] 4d5 5s2', 1.90, 2157, 4265],
  [44, 'Ru', 'Ruthenium', 101.1, 'transition-metal', 8, 5, '[Kr] 4d7 5s1', 2.20, 2334, 4150],
  [45, 'Rh', 'Rhodium', 102.9, 'transition-metal', 9, 5, '[Kr] 4d8 5s1', 2.28, 1964, 3695],
  [46, 'Pd', 'Palladium', 106.4, 'transition-metal', 10, 5, '[Kr] 4d10', 2.20, 1555, 2963],
  [47, 'Ag', 'Silver', 107.9, 'transition-metal', 11, 5, '[Kr] 4d10 5s1', 1.93, 962, 2162],
  [48, 'Cd', 'Cadmium', 112.4, 'transition-metal', 12, 5, '[Kr] 4d10 5s2', 1.69, 321, 767],
  [49, 'In', 'Indium', 114.8, 'post-transition-metal', 13, 5, '[Kr] 4d10 5s2 5p1', 1.78, 157, 2072],
  [50, 'Sn', 'Tin', 118.7, 'post-transition-metal', 14, 5, '[Kr] 4d10 5s2 5p2', 1.96, 232, 2602],
  [51, 'Sb', 'Antimony', 121.8, 'metalloid', 15, 5, '[Kr] 4d10 5s2 5p3', 2.05, 631, 1587],
  [52, 'Te', 'Tellurium', 127.6, 'metalloid', 16, 5, '[Kr] 4d10 5s2 5p4', 2.10, 450, 988],
  [53, 'I', 'Iodine', 126.9, 'halogen', 17, 5, '[Kr] 4d10 5s2 5p5', 2.66, 114, 184],
  [54, 'Xe', 'Xenon', 131.3, 'noble-gas', 18, 5, '[Kr] 4d10 5s2 5p6', null, -112, -108],
  [55, 'Cs', 'Caesium', 132.9, 'alkali-metal', 1, 6, '[Xe] 6s1', 0.79, 28, 671],
  [56, 'Ba', 'Barium', 137.3, 'alkaline-earth', 2, 6, '[Xe] 6s2', 0.89, 727, 1870],
  [57, 'La', 'Lanthanum', 138.9, 'lanthanide', 3, 6, '[Xe] 5d1 6s2', 1.10, 920, 3464],
  [58, 'Ce', 'Cerium', 140.1, 'lanthanide', 4, 6, '[Xe] 4f1 5d1 6s2', 1.12, 799, 3443],
  [59, 'Pr', 'Praseodymium', 140.9, 'lanthanide', 5, 6, '[Xe] 4f3 6s2', 1.13, 931, 3520],
  [60, 'Nd', 'Neodymium', 144.2, 'lanthanide', 6, 6, '[Xe] 4f4 6s2', 1.14, 1016, 3074],
  [61, 'Pm', 'Promethium', 145.0, 'lanthanide', 7, 6, '[Xe] 4f5 6s2', null, 1042, 3000],
  [62, 'Sm', 'Samarium', 150.4, 'lanthanide', 8, 6, '[Xe] 4f6 6s2', 1.17, 1074, 1794],
  [63, 'Eu', 'Europium', 152.0, 'lanthanide', 9, 6, '[Xe] 4f7 6s2', null, 822, 1529],
  [64, 'Gd', 'Gadolinium', 157.3, 'lanthanide', 10, 6, '[Xe] 4f7 5d1 6s2', 1.20, 1313, 3273],
  [65, 'Tb', 'Terbium', 158.9, 'lanthanide', 11, 6, '[Xe] 4f9 6s2', null, 1356, 3230],
  [66, 'Dy', 'Dysprosium', 162.5, 'lanthanide', 12, 6, '[Xe] 4f10 6s2', 1.22, 1412, 2567],
  [67, 'Ho', 'Holmium', 164.9, 'lanthanide', 13, 6, '[Xe] 4f11 6s2', 1.23, 1474, 2700],
  [68, 'Er', 'Erbium', 167.3, 'lanthanide', 14, 6, '[Xe] 4f12 6s2', 1.24, 1529, 2868],
  [69, 'Tm', 'Thulium', 168.9, 'lanthanide', 15, 6, '[Xe] 4f13 6s2', 1.25, 1545, 1950],
  [70, 'Yb', 'Ytterbium', 173.0, 'lanthanide', 16, 6, '[Xe] 4f14 6s2', null, 819, 1196],
  [71, 'Lu', 'Lutetium', 175.0, 'lanthanide', 17, 6, '[Xe] 4f14 5d1 6s2', 1.27, 1663, 3402],
  [72, 'Hf', 'Hafnium', 178.5, 'transition-metal', 4, 6, '[Xe] 4f14 5d2 6s2', 1.30, 2233, 4603],
  [73, 'Ta', 'Tantalum', 180.9, 'transition-metal', 5, 6, '[Xe] 4f14 5d3 6s2', 1.50, 3017, 5458],
  [74, 'W', 'Tungsten', 183.8, 'transition-metal', 6, 6, '[Xe] 4f14 5d4 6s2', 2.36, 3422, 5555],
  [75, 'Re', 'Rhenium', 186.2, 'transition-metal', 7, 6, '[Xe] 4f14 5d5 6s2', 1.90, 3186, 5596],
  [76, 'Os', 'Osmium', 190.2, 'transition-metal', 8, 6, '[Xe] 4f14 5d6 6s2', 2.20, 3033, 5012],
  [77, 'Ir', 'Iridium', 192.2, 'transition-metal', 9, 6, '[Xe] 4f14 5d7 6s2', 2.20, 2446, 4428],
  [78, 'Pt', 'Platinum', 195.1, 'transition-metal', 10, 6, '[Xe] 4f14 5d9 6s1', 2.28, 1768, 3825],
  [79, 'Au', 'Gold', 197.0, 'transition-metal', 11, 6, '[Xe] 4f14 5d10 6s1', 2.54, 1064, 2856],
  [80, 'Hg', 'Mercury', 200.6, 'transition-metal', 12, 6, '[Xe] 4f14 5d10 6s2', 2.00, -39, 357],
  [81, 'Tl', 'Thallium', 204.4, 'post-transition-metal', 13, 6, '[Xe] 4f14 5d10 6s2 6p1', 1.62, 304, 1473],
  [82, 'Pb', 'Lead', 207.2, 'post-transition-metal', 14, 6, '[Xe] 4f14 5d10 6s2 6p2', 1.87, 327, 1749],
  [83, 'Bi', 'Bismuth', 209.0, 'post-transition-metal', 15, 6, '[Xe] 4f14 5d10 6s2 6p3', 2.02, 271, 1564],
  [84, 'Po', 'Polonium', 209.0, 'post-transition-metal', 16, 6, '[Xe] 4f14 5d10 6s2 6p4', 2.00, 254, 962],
  [85, 'At', 'Astatine', 210.0, 'halogen', 17, 6, '[Xe] 4f14 5d10 6s2 6p5', 2.20, 302, 337],
  [86, 'Rn', 'Radon', 222.0, 'noble-gas', 18, 6, '[Xe] 4f14 5d10 6s2 6p6', null, -71, -62],
  [87, 'Fr', 'Francium', 223.0, 'alkali-metal', 1, 7, '[Rn] 7s1', 0.70, 27, 677],
  [88, 'Ra', 'Radium', 226.0, 'alkaline-earth', 2, 7, '[Rn] 7s2', 0.90, 700, 1737],
  [89, 'Ac', 'Actinium', 227.0, 'actinide', 3, 7, '[Rn] 6d1 7s2', 1.10, 1050, 3198],
  [90, 'Th', 'Thorium', 232.0, 'actinide', 4, 7, '[Rn] 6d2 7s2', 1.30, 1750, 4788],
  [91, 'Pa', 'Protactinium', 231.0, 'actinide', 5, 7, '[Rn] 5f2 6d1 7s2', 1.50, 1572, 4027],
  [92, 'U', 'Uranium', 238.0, 'actinide', 6, 7, '[Rn] 5f3 6d1 7s2', 1.38, 1135, 4131],
  [93, 'Np', 'Neptunium', 237.0, 'actinide', 7, 7, '[Rn] 5f4 6d1 7s2', 1.36, 644, 3902],
  [94, 'Pu', 'Plutonium', 244.0, 'actinide', 8, 7, '[Rn] 5f6 7s2', 1.28, 640, 3228],
  [95, 'Am', 'Americium', 243.0, 'actinide', 9, 7, '[Rn] 5f7 7s2', 1.30, 1176, 2011],
  [96, 'Cm', 'Curium', 247.0, 'actinide', 10, 7, '[Rn] 5f7 6d1 7s2', 1.30, 1345, 3110],
  [97, 'Bk', 'Berkelium', 247.0, 'actinide', 11, 7, '[Rn] 5f9 7s2', 1.30, 1050, 2627],
  [98, 'Cf', 'Californium', 251.0, 'actinide', 12, 7, '[Rn] 5f10 7s2', 1.30, 900, 1472],
  [99, 'Es', 'Einsteinium', 252.0, 'actinide', 13, 7, '[Rn] 5f11 7s2', 1.30, 860, 996],
  [100, 'Fm', 'Fermium', 257.0, 'actinide', 14, 7, '[Rn] 5f12 7s2', 1.30, 1527, null],
  [101, 'Md', 'Mendelevium', 258.0, 'actinide', 15, 7, '[Rn] 5f13 7s2', 1.30, 827, null],
  [102, 'No', 'Nobelium', 259.0, 'actinide', 16, 7, '[Rn] 5f14 7s2', 1.30, 827, null],
  [103, 'Lr', 'Lawrencium', 266.0, 'actinide', 17, 7, '[Rn] 5f14 7s2 7p1', 1.30, 1627, null],
  [104, 'Rf', 'Rutherfordium', 267.0, 'transition-metal', 4, 7, '[Rn] 5f14 6d2 7s2', null, null, null],
  [105, 'Db', 'Dubnium', 268.0, 'transition-metal', 5, 7, '[Rn] 5f14 6d3 7s2', null, null, null],
  [106, 'Sg', 'Seaborgium', 269.0, 'transition-metal', 6, 7, '[Rn] 5f14 6d4 7s2', null, null, null],
  [107, 'Bh', 'Bohrium', 270.0, 'transition-metal', 7, 7, '[Rn] 5f14 6d5 7s2', null, null, null],
  [108, 'Hs', 'Hassium', 277.0, 'transition-metal', 8, 7, '[Rn] 5f14 6d6 7s2', null, null, null],
  [109, 'Mt', 'Meitnerium', 278.0, 'transition-metal', 9, 7, '[Rn] 5f14 6d7 7s2', null, null, null],
  [110, 'Ds', 'Darmstadtium', 281.0, 'transition-metal', 10, 7, '[Rn] 5f14 6d8 7s2', null, null, null],
  [111, 'Rg', 'Roentgenium', 282.0, 'transition-metal', 11, 7, '[Rn] 5f14 6d9 7s2', null, null, null],
  [112, 'Cn', 'Copernicium', 285.0, 'transition-metal', 12, 7, '[Rn] 5f14 6d10 7s2', null, null, null],
  [113, 'Nh', 'Nihonium', 286.0, 'post-transition-metal', 13, 7, '[Rn] 5f14 6d10 7s2 7p1', null, null, null],
  [114, 'Fl', 'Flerovium', 289.0, 'post-transition-metal', 14, 7, '[Rn] 5f14 6d10 7s2 7p2', null, null, null],
  [115, 'Mc', 'Moscovium', 290.0, 'post-transition-metal', 15, 7, '[Rn] 5f14 6d10 7s2 7p3', null, null, null],
  [116, 'Lv', 'Livermorium', 293.0, 'post-transition-metal', 16, 7, '[Rn] 5f14 6d10 7s2 7p4', null, null, null],
  [117, 'Ts', 'Tennessine', 294.0, 'halogen', 17, 7, '[Rn] 5f14 6d10 7s2 7p5', null, null, null],
  [118, 'Og', 'Oganesson', 294.0, 'noble-gas', 18, 7, '[Rn] 5f14 6d10 7s2 7p6', null, null, null],
];

export const ELEMENTS: ChemicalElement[] = RAW_ELEMENTS.map(
  ([number, symbol, name, mass, category, group, period, electronConfig, electronegativity, meltingPoint, boilingPoint]) => ({
    number,
    symbol,
    name,
    mass,
    category,
    group,
    period,
    electronConfig,
    electronegativity,
    meltingPoint,
    boilingPoint,
  }),
);

export function filterElements(
  query: string,
  category?: ElementCategory,
): ChemicalElement[] {
  const lower = query.toLowerCase();
  return ELEMENTS.filter((el) => {
    if (category && el.category !== category) return false;
    if (!query) return true;
    return (
      el.name.toLowerCase().includes(lower) ||
      el.symbol.toLowerCase().includes(lower) ||
      String(el.number) === query
    );
  });
}

export function getElementById(number: number): ChemicalElement | undefined {
  return ELEMENTS.find((el) => el.number === number);
}

export function getElementBySymbol(symbol: string): ChemicalElement | undefined {
  return ELEMENTS.find((el) => el.symbol.toLowerCase() === symbol.toLowerCase());
}

// Grid position for standard periodic table layout
export function getGridPosition(el: ChemicalElement): { row: number; col: number } | null {
  if (el.category === 'lanthanide') {
    return { row: 9, col: el.number - 57 + 3 };
  }
  if (el.category === 'actinide') {
    return { row: 10, col: el.number - 89 + 3 };
  }
  return { row: el.period, col: el.group };
}
