import { beforeAll } from 'vitest';
import { md5 } from 'wasm-utils';

// Ensure WASM module is loaded before tests run
beforeAll(() => {
  // Trigger WASM initialization by calling a function
  // The bundler target auto-initializes on import
  md5('');
});
