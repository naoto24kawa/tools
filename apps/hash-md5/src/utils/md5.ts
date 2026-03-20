import { md5 as wasmMd5 } from 'wasm-utils';

export async function md5(text: string): Promise<string> {
  return wasmMd5(text);
}
