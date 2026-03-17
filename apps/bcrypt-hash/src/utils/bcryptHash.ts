import bcrypt from 'bcryptjs';

export function generateHash(password: string, rounds: number): string {
  const salt = bcrypt.genSaltSync(rounds);
  return bcrypt.hashSync(password, salt);
}

export function verifyHash(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}
