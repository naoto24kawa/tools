import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react(), wasm()],
  // Pages直接アクセス用にルートパスを使用
  base: './',
  server: {
    port: 5232,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  test: {
    setupFiles: ['./src/utils/__tests__/setup.ts'],
  },
});
