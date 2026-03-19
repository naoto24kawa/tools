export interface Element {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  electronConfig: string;
  group: number;
  period: number;
  state: string;
}

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth-metal': 'Alkaline Earth Metal',
  'transition-metal': 'Transition Metal',
  'post-transition-metal': 'Post-Transition Metal',
  metalloid: 'Metalloid',
  nonmetal: 'Nonmetal',
  halogen: 'Halogen',
  'noble-gas': 'Noble Gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
};

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': '#ff6b6b',
  'alkaline-earth-metal': '#ffa94d',
  'transition-metal': '#ffd43b',
  'post-transition-metal': '#69db7c',
  metalloid: '#38d9a9',
  nonmetal: '#4dabf7',
  halogen: '#748ffc',
  'noble-gas': '#da77f2',
  lanthanide: '#f783ac',
  actinide: '#e599f7',
};

// prettier-ignore
export const elements: Element[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', electronConfig: '1s1', group: 1, period: 1, state: 'Gas' },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.003, category: 'noble-gas', electronConfig: '1s2', group: 18, period: 1, state: 'Gas' },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.941, category: 'alkali-metal', electronConfig: '[He] 2s1', group: 1, period: 2, state: 'Solid' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, category: 'alkaline-earth-metal', electronConfig: '[He] 2s2', group: 2, period: 2, state: 'Solid' },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', electronConfig: '[He] 2s2 2p1', group: 13, period: 2, state: 'Solid' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'nonmetal', electronConfig: '[He] 2s2 2p2', group: 14, period: 2, state: 'Solid' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'nonmetal', electronConfig: '[He] 2s2 2p3', group: 15, period: 2, state: 'Gas' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'nonmetal', electronConfig: '[He] 2s2 2p4', group: 16, period: 2, state: 'Gas' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'halogen', electronConfig: '[He] 2s2 2p5', group: 17, period: 2, state: 'Gas' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, category: 'noble-gas', electronConfig: '[He] 2s2 2p6', group: 18, period: 2, state: 'Gas' },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, category: 'alkali-metal', electronConfig: '[Ne] 3s1', group: 1, period: 3, state: 'Solid' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'alkaline-earth-metal', electronConfig: '[Ne] 3s2', group: 2, period: 3, state: 'Solid' },
  { number: 13, symbol: 'Al', name: 'Aluminium', mass: 26.982, category: 'post-transition-metal', electronConfig: '[Ne] 3s2 3p1', group: 13, period: 3, state: 'Solid' },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.086, category: 'metalloid', electronConfig: '[Ne] 3s2 3p2', group: 14, period: 3, state: 'Solid' },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'nonmetal', electronConfig: '[Ne] 3s2 3p3', group: 15, period: 3, state: 'Solid' },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'nonmetal', electronConfig: '[Ne] 3s2 3p4', group: 16, period: 3, state: 'Solid' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', electronConfig: '[Ne] 3s2 3p5', group: 17, period: 3, state: 'Gas' },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, category: 'noble-gas', electronConfig: '[Ne] 3s2 3p6', group: 18, period: 3, state: 'Gas' },
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'alkali-metal', electronConfig: '[Ar] 4s1', group: 1, period: 4, state: 'Solid' },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'alkaline-earth-metal', electronConfig: '[Ar] 4s2', group: 2, period: 4, state: 'Solid' },
  { number: 21, symbol: 'Sc', name: 'Scandium', mass: 44.956, category: 'transition-metal', electronConfig: '[Ar] 3d1 4s2', group: 3, period: 4, state: 'Solid' },
  { number: 22, symbol: 'Ti', name: 'Titanium', mass: 47.867, category: 'transition-metal', electronConfig: '[Ar] 3d2 4s2', group: 4, period: 4, state: 'Solid' },
  { number: 23, symbol: 'V', name: 'Vanadium', mass: 50.942, category: 'transition-metal', electronConfig: '[Ar] 3d3 4s2', group: 5, period: 4, state: 'Solid' },
  { number: 24, symbol: 'Cr', name: 'Chromium', mass: 51.996, category: 'transition-metal', electronConfig: '[Ar] 3d5 4s1', group: 6, period: 4, state: 'Solid' },
  { number: 25, symbol: 'Mn', name: 'Manganese', mass: 54.938, category: 'transition-metal', electronConfig: '[Ar] 3d5 4s2', group: 7, period: 4, state: 'Solid' },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'transition-metal', electronConfig: '[Ar] 3d6 4s2', group: 8, period: 4, state: 'Solid' },
  { number: 27, symbol: 'Co', name: 'Cobalt', mass: 58.933, category: 'transition-metal', electronConfig: '[Ar] 3d7 4s2', group: 9, period: 4, state: 'Solid' },
  { number: 28, symbol: 'Ni', name: 'Nickel', mass: 58.693, category: 'transition-metal', electronConfig: '[Ar] 3d8 4s2', group: 10, period: 4, state: 'Solid' },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'transition-metal', electronConfig: '[Ar] 3d10 4s1', group: 11, period: 4, state: 'Solid' },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition-metal', electronConfig: '[Ar] 3d10 4s2', group: 12, period: 4, state: 'Solid' },
  { number: 31, symbol: 'Ga', name: 'Gallium', mass: 69.723, category: 'post-transition-metal', electronConfig: '[Ar] 3d10 4s2 4p1', group: 13, period: 4, state: 'Solid' },
  { number: 32, symbol: 'Ge', name: 'Germanium', mass: 72.63, category: 'metalloid', electronConfig: '[Ar] 3d10 4s2 4p2', group: 14, period: 4, state: 'Solid' },
  { number: 33, symbol: 'As', name: 'Arsenic', mass: 74.922, category: 'metalloid', electronConfig: '[Ar] 3d10 4s2 4p3', group: 15, period: 4, state: 'Solid' },
  { number: 34, symbol: 'Se', name: 'Selenium', mass: 78.971, category: 'nonmetal', electronConfig: '[Ar] 3d10 4s2 4p4', group: 16, period: 4, state: 'Solid' },
  { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.904, category: 'halogen', electronConfig: '[Ar] 3d10 4s2 4p5', group: 17, period: 4, state: 'Liquid' },
  { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.798, category: 'noble-gas', electronConfig: '[Ar] 3d10 4s2 4p6', group: 18, period: 4, state: 'Gas' },
  { number: 37, symbol: 'Rb', name: 'Rubidium', mass: 85.468, category: 'alkali-metal', electronConfig: '[Kr] 5s1', group: 1, period: 5, state: 'Solid' },
  { number: 38, symbol: 'Sr', name: 'Strontium', mass: 87.62, category: 'alkaline-earth-metal', electronConfig: '[Kr] 5s2', group: 2, period: 5, state: 'Solid' },
  { number: 39, symbol: 'Y', name: 'Yttrium', mass: 88.906, category: 'transition-metal', electronConfig: '[Kr] 4d1 5s2', group: 3, period: 5, state: 'Solid' },
  { number: 40, symbol: 'Zr', name: 'Zirconium', mass: 91.224, category: 'transition-metal', electronConfig: '[Kr] 4d2 5s2', group: 4, period: 5, state: 'Solid' },
  { number: 41, symbol: 'Nb', name: 'Niobium', mass: 92.906, category: 'transition-metal', electronConfig: '[Kr] 4d4 5s1', group: 5, period: 5, state: 'Solid' },
  { number: 42, symbol: 'Mo', name: 'Molybdenum', mass: 95.95, category: 'transition-metal', electronConfig: '[Kr] 4d5 5s1', group: 6, period: 5, state: 'Solid' },
  { number: 43, symbol: 'Tc', name: 'Technetium', mass: 98, category: 'transition-metal', electronConfig: '[Kr] 4d5 5s2', group: 7, period: 5, state: 'Solid' },
  { number: 44, symbol: 'Ru', name: 'Ruthenium', mass: 101.07, category: 'transition-metal', electronConfig: '[Kr] 4d7 5s1', group: 8, period: 5, state: 'Solid' },
  { number: 45, symbol: 'Rh', name: 'Rhodium', mass: 102.906, category: 'transition-metal', electronConfig: '[Kr] 4d8 5s1', group: 9, period: 5, state: 'Solid' },
  { number: 46, symbol: 'Pd', name: 'Palladium', mass: 106.42, category: 'transition-metal', electronConfig: '[Kr] 4d10', group: 10, period: 5, state: 'Solid' },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.868, category: 'transition-metal', electronConfig: '[Kr] 4d10 5s1', group: 11, period: 5, state: 'Solid' },
  { number: 48, symbol: 'Cd', name: 'Cadmium', mass: 112.414, category: 'transition-metal', electronConfig: '[Kr] 4d10 5s2', group: 12, period: 5, state: 'Solid' },
  { number: 49, symbol: 'In', name: 'Indium', mass: 114.818, category: 'post-transition-metal', electronConfig: '[Kr] 4d10 5s2 5p1', group: 13, period: 5, state: 'Solid' },
  { number: 50, symbol: 'Sn', name: 'Tin', mass: 118.71, category: 'post-transition-metal', electronConfig: '[Kr] 4d10 5s2 5p2', group: 14, period: 5, state: 'Solid' },
  { number: 51, symbol: 'Sb', name: 'Antimony', mass: 121.76, category: 'metalloid', electronConfig: '[Kr] 4d10 5s2 5p3', group: 15, period: 5, state: 'Solid' },
  { number: 52, symbol: 'Te', name: 'Tellurium', mass: 127.6, category: 'metalloid', electronConfig: '[Kr] 4d10 5s2 5p4', group: 16, period: 5, state: 'Solid' },
  { number: 53, symbol: 'I', name: 'Iodine', mass: 126.904, category: 'halogen', electronConfig: '[Kr] 4d10 5s2 5p5', group: 17, period: 5, state: 'Solid' },
  { number: 54, symbol: 'Xe', name: 'Xenon', mass: 131.294, category: 'noble-gas', electronConfig: '[Kr] 4d10 5s2 5p6', group: 18, period: 5, state: 'Gas' },
  { number: 55, symbol: 'Cs', name: 'Caesium', mass: 132.905, category: 'alkali-metal', electronConfig: '[Xe] 6s1', group: 1, period: 6, state: 'Solid' },
  { number: 56, symbol: 'Ba', name: 'Barium', mass: 137.327, category: 'alkaline-earth-metal', electronConfig: '[Xe] 6s2', group: 2, period: 6, state: 'Solid' },
  { number: 57, symbol: 'La', name: 'Lanthanum', mass: 138.905, category: 'lanthanide', electronConfig: '[Xe] 5d1 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 58, symbol: 'Ce', name: 'Cerium', mass: 140.116, category: 'lanthanide', electronConfig: '[Xe] 4f1 5d1 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 59, symbol: 'Pr', name: 'Praseodymium', mass: 140.908, category: 'lanthanide', electronConfig: '[Xe] 4f3 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 60, symbol: 'Nd', name: 'Neodymium', mass: 144.242, category: 'lanthanide', electronConfig: '[Xe] 4f4 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 61, symbol: 'Pm', name: 'Promethium', mass: 145, category: 'lanthanide', electronConfig: '[Xe] 4f5 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 62, symbol: 'Sm', name: 'Samarium', mass: 150.36, category: 'lanthanide', electronConfig: '[Xe] 4f6 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 63, symbol: 'Eu', name: 'Europium', mass: 151.964, category: 'lanthanide', electronConfig: '[Xe] 4f7 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 64, symbol: 'Gd', name: 'Gadolinium', mass: 157.25, category: 'lanthanide', electronConfig: '[Xe] 4f7 5d1 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 65, symbol: 'Tb', name: 'Terbium', mass: 158.925, category: 'lanthanide', electronConfig: '[Xe] 4f9 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 66, symbol: 'Dy', name: 'Dysprosium', mass: 162.5, category: 'lanthanide', electronConfig: '[Xe] 4f10 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 67, symbol: 'Ho', name: 'Holmium', mass: 164.93, category: 'lanthanide', electronConfig: '[Xe] 4f11 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 68, symbol: 'Er', name: 'Erbium', mass: 167.259, category: 'lanthanide', electronConfig: '[Xe] 4f12 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 69, symbol: 'Tm', name: 'Thulium', mass: 168.934, category: 'lanthanide', electronConfig: '[Xe] 4f13 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 70, symbol: 'Yb', name: 'Ytterbium', mass: 173.045, category: 'lanthanide', electronConfig: '[Xe] 4f14 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 71, symbol: 'Lu', name: 'Lutetium', mass: 174.967, category: 'lanthanide', electronConfig: '[Xe] 4f14 5d1 6s2', group: 3, period: 6, state: 'Solid' },
  { number: 72, symbol: 'Hf', name: 'Hafnium', mass: 178.49, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d2 6s2', group: 4, period: 6, state: 'Solid' },
  { number: 73, symbol: 'Ta', name: 'Tantalum', mass: 180.948, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d3 6s2', group: 5, period: 6, state: 'Solid' },
  { number: 74, symbol: 'W', name: 'Tungsten', mass: 183.84, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d4 6s2', group: 6, period: 6, state: 'Solid' },
  { number: 75, symbol: 'Re', name: 'Rhenium', mass: 186.207, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d5 6s2', group: 7, period: 6, state: 'Solid' },
  { number: 76, symbol: 'Os', name: 'Osmium', mass: 190.23, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d6 6s2', group: 8, period: 6, state: 'Solid' },
  { number: 77, symbol: 'Ir', name: 'Iridium', mass: 192.217, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d7 6s2', group: 9, period: 6, state: 'Solid' },
  { number: 78, symbol: 'Pt', name: 'Platinum', mass: 195.084, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d9 6s1', group: 10, period: 6, state: 'Solid' },
  { number: 79, symbol: 'Au', name: 'Gold', mass: 196.967, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d10 6s1', group: 11, period: 6, state: 'Solid' },
  { number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.592, category: 'transition-metal', electronConfig: '[Xe] 4f14 5d10 6s2', group: 12, period: 6, state: 'Liquid' },
  { number: 81, symbol: 'Tl', name: 'Thallium', mass: 204.38, category: 'post-transition-metal', electronConfig: '[Xe] 4f14 5d10 6s2 6p1', group: 13, period: 6, state: 'Solid' },
  { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, category: 'post-transition-metal', electronConfig: '[Xe] 4f14 5d10 6s2 6p2', group: 14, period: 6, state: 'Solid' },
  { number: 83, symbol: 'Bi', name: 'Bismuth', mass: 208.98, category: 'post-transition-metal', electronConfig: '[Xe] 4f14 5d10 6s2 6p3', group: 15, period: 6, state: 'Solid' },
  { number: 84, symbol: 'Po', name: 'Polonium', mass: 209, category: 'post-transition-metal', electronConfig: '[Xe] 4f14 5d10 6s2 6p4', group: 16, period: 6, state: 'Solid' },
  { number: 85, symbol: 'At', name: 'Astatine', mass: 210, category: 'halogen', electronConfig: '[Xe] 4f14 5d10 6s2 6p5', group: 17, period: 6, state: 'Solid' },
  { number: 86, symbol: 'Rn', name: 'Radon', mass: 222, category: 'noble-gas', electronConfig: '[Xe] 4f14 5d10 6s2 6p6', group: 18, period: 6, state: 'Gas' },
  { number: 87, symbol: 'Fr', name: 'Francium', mass: 223, category: 'alkali-metal', electronConfig: '[Rn] 7s1', group: 1, period: 7, state: 'Solid' },
  { number: 88, symbol: 'Ra', name: 'Radium', mass: 226, category: 'alkaline-earth-metal', electronConfig: '[Rn] 7s2', group: 2, period: 7, state: 'Solid' },
  { number: 89, symbol: 'Ac', name: 'Actinium', mass: 227, category: 'actinide', electronConfig: '[Rn] 6d1 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 90, symbol: 'Th', name: 'Thorium', mass: 232.038, category: 'actinide', electronConfig: '[Rn] 6d2 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 91, symbol: 'Pa', name: 'Protactinium', mass: 231.036, category: 'actinide', electronConfig: '[Rn] 5f2 6d1 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 92, symbol: 'U', name: 'Uranium', mass: 238.029, category: 'actinide', electronConfig: '[Rn] 5f3 6d1 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 93, symbol: 'Np', name: 'Neptunium', mass: 237, category: 'actinide', electronConfig: '[Rn] 5f4 6d1 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 94, symbol: 'Pu', name: 'Plutonium', mass: 244, category: 'actinide', electronConfig: '[Rn] 5f6 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 95, symbol: 'Am', name: 'Americium', mass: 243, category: 'actinide', electronConfig: '[Rn] 5f7 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 96, symbol: 'Cm', name: 'Curium', mass: 247, category: 'actinide', electronConfig: '[Rn] 5f7 6d1 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 97, symbol: 'Bk', name: 'Berkelium', mass: 247, category: 'actinide', electronConfig: '[Rn] 5f9 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 98, symbol: 'Cf', name: 'Californium', mass: 251, category: 'actinide', electronConfig: '[Rn] 5f10 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 99, symbol: 'Es', name: 'Einsteinium', mass: 252, category: 'actinide', electronConfig: '[Rn] 5f11 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 100, symbol: 'Fm', name: 'Fermium', mass: 257, category: 'actinide', electronConfig: '[Rn] 5f12 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 101, symbol: 'Md', name: 'Mendelevium', mass: 258, category: 'actinide', electronConfig: '[Rn] 5f13 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 102, symbol: 'No', name: 'Nobelium', mass: 259, category: 'actinide', electronConfig: '[Rn] 5f14 7s2', group: 3, period: 7, state: 'Solid' },
  { number: 103, symbol: 'Lr', name: 'Lawrencium', mass: 266, category: 'actinide', electronConfig: '[Rn] 5f14 7s2 7p1', group: 3, period: 7, state: 'Solid' },
  { number: 104, symbol: 'Rf', name: 'Rutherfordium', mass: 267, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d2 7s2', group: 4, period: 7, state: 'Solid' },
  { number: 105, symbol: 'Db', name: 'Dubnium', mass: 268, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d3 7s2', group: 5, period: 7, state: 'Solid' },
  { number: 106, symbol: 'Sg', name: 'Seaborgium', mass: 269, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d4 7s2', group: 6, period: 7, state: 'Solid' },
  { number: 107, symbol: 'Bh', name: 'Bohrium', mass: 270, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d5 7s2', group: 7, period: 7, state: 'Solid' },
  { number: 108, symbol: 'Hs', name: 'Hassium', mass: 277, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d6 7s2', group: 8, period: 7, state: 'Solid' },
  { number: 109, symbol: 'Mt', name: 'Meitnerium', mass: 278, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d7 7s2', group: 9, period: 7, state: 'Solid' },
  { number: 110, symbol: 'Ds', name: 'Darmstadtium', mass: 281, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d8 7s2', group: 10, period: 7, state: 'Solid' },
  { number: 111, symbol: 'Rg', name: 'Roentgenium', mass: 282, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d9 7s2', group: 11, period: 7, state: 'Solid' },
  { number: 112, symbol: 'Cn', name: 'Copernicium', mass: 285, category: 'transition-metal', electronConfig: '[Rn] 5f14 6d10 7s2', group: 12, period: 7, state: 'Solid' },
  { number: 113, symbol: 'Nh', name: 'Nihonium', mass: 286, category: 'post-transition-metal', electronConfig: '[Rn] 5f14 6d10 7s2 7p1', group: 13, period: 7, state: 'Solid' },
  { number: 114, symbol: 'Fl', name: 'Flerovium', mass: 289, category: 'post-transition-metal', electronConfig: '[Rn] 5f14 6d10 7s2 7p2', group: 14, period: 7, state: 'Solid' },
  { number: 115, symbol: 'Mc', name: 'Moscovium', mass: 290, category: 'post-transition-metal', electronConfig: '[Rn] 5f14 6d10 7s2 7p3', group: 15, period: 7, state: 'Solid' },
  { number: 116, symbol: 'Lv', name: 'Livermorium', mass: 293, category: 'post-transition-metal', electronConfig: '[Rn] 5f14 6d10 7s2 7p4', group: 16, period: 7, state: 'Solid' },
  { number: 117, symbol: 'Ts', name: 'Tennessine', mass: 294, category: 'halogen', electronConfig: '[Rn] 5f14 6d10 7s2 7p5', group: 17, period: 7, state: 'Solid' },
  { number: 118, symbol: 'Og', name: 'Oganesson', mass: 294, category: 'noble-gas', electronConfig: '[Rn] 5f14 6d10 7s2 7p6', group: 18, period: 7, state: 'Solid' },
];

export function searchElements(
  query: string,
  categoryFilter?: string
): Element[] {
  let filtered = elements;

  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter((el) => el.category === categoryFilter);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (el) =>
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        String(el.number) === q
    );
  }

  return filtered;
}

export function getElementByNumber(num: number): Element | undefined {
  return elements.find((el) => el.number === num);
}

export function getElementBySymbol(symbol: string): Element | undefined {
  return elements.find((el) => el.symbol.toLowerCase() === symbol.toLowerCase());
}

// Grid position mapping for the periodic table layout
export interface GridPosition {
  row: number;
  col: number;
}

export function getGridPosition(el: Element): GridPosition {
  // Lanthanides (57-71) go in row 9, cols 4-18
  if (el.number >= 57 && el.number <= 71) {
    return { row: 9, col: el.number - 57 + 4 };
  }
  // Actinides (89-103) go in row 10, cols 4-18
  if (el.number >= 89 && el.number <= 103) {
    return { row: 10, col: el.number - 89 + 4 };
  }
  return { row: el.period, col: el.group };
}
