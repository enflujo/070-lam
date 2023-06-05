import { defineConfig } from 'vite';

export default defineConfig({
  base: '/especiales/lam/',
  server: {
    port: 3000,
  },
  publicDir: './estaticos',
  build: {
    outDir: 'publico',
    assetsDir: 'recursos',
    sourcemap: true,
  },
});
