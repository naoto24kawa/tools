import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5200,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
