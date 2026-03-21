import { beforeAll } from "vitest";
import { bcrypt_hash } from "wasm-utils";

// Ensure WASM module is loaded before tests run
beforeAll(() => {
  bcrypt_hash("init", 4);
});
