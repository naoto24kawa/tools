import { beforeAll } from "vitest";
import { crc32_hex } from "wasm-utils";

// Ensure WASM module is loaded before tests run
beforeAll(() => {
  // Trigger WASM initialization by calling a function
  // The bundler target auto-initializes on import
  crc32_hex("");
});
