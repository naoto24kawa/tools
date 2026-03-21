import { bcrypt_hash as wasmBcryptHash, bcrypt_verify as wasmBcryptVerify } from "wasm-utils";

export async function generateHash(password: string, rounds: number): Promise<string> {
  return wasmBcryptHash(password, rounds);
}

export async function verifyHash(password: string, hash: string): Promise<boolean> {
  return wasmBcryptVerify(password, hash);
}
