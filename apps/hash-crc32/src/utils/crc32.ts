import { crc32_hex as wasmCrc32Hex } from "wasm-utils";

export async function crc32(text: string): Promise<string> {
  return wasmCrc32Hex(text);
}
