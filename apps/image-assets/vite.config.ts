import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite-plus';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Pages直接アクセス用にルートパスを使用
  base: '/',
  server: {
    port: 5175,
  },
  resolve: {
    alias: {
      '@': `${__dirname}/src`,
      '@components': `${__dirname}/src/components`,
      '@utils': `${__dirname}/src/utils`,
      '@types': `${__dirname}/src/types`,
      '@config': `${__dirname}/src/config`,
      '@hooks': `${__dirname}/src/hooks`,
      '@services': `${__dirname}/src/services`,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
