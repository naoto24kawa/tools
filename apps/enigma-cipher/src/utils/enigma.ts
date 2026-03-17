const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Historical rotor wirings (Enigma I)
const ROTORS = {
  I: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
  II: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  III: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
} as const;

const REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'; // Reflector B

type RotorName = keyof typeof ROTORS;

interface EnigmaConfig {
  rotors: [RotorName, RotorName, RotorName];
  positions: [number, number, number];
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function rotorForward(c: number, rotor: string, position: number): number {
  const shifted = mod(c + position, 26);
  const encoded = ALPHABET.indexOf(rotor[shifted]);
  return mod(encoded - position, 26);
}

function rotorBackward(c: number, rotor: string, position: number): number {
  const shifted = mod(c + position, 26);
  const encoded = rotor.indexOf(ALPHABET[shifted]);
  return mod(encoded - position, 26);
}

export function enigmaEncrypt(text: string, config: EnigmaConfig): string {
  const positions = [...config.positions] as [number, number, number];
  const [r1, r2, r3] = config.rotors.map((name) => ROTORS[name]);
  let result = '';

  for (const char of text.toUpperCase()) {
    if (!ALPHABET.includes(char)) {
      result += char;
      continue;
    }

    // Step rotors (simplified - right rotor always steps)
    positions[2] = mod(positions[2] + 1, 26);
    if (positions[2] === 0) {
      positions[1] = mod(positions[1] + 1, 26);
      if (positions[1] === 0) {
        positions[0] = mod(positions[0] + 1, 26);
      }
    }

    let c = ALPHABET.indexOf(char);
    // Forward through rotors
    c = rotorForward(c, r3, positions[2]);
    c = rotorForward(c, r2, positions[1]);
    c = rotorForward(c, r1, positions[0]);
    // Reflector
    c = ALPHABET.indexOf(REFLECTOR[c]);
    // Backward through rotors
    c = rotorBackward(c, r1, positions[0]);
    c = rotorBackward(c, r2, positions[1]);
    c = rotorBackward(c, r3, positions[2]);

    result += ALPHABET[c];
  }

  return result;
}

export const DEFAULT_CONFIG: EnigmaConfig = {
  rotors: ['I', 'II', 'III'],
  positions: [0, 0, 0],
};

export type { EnigmaConfig, RotorName };
