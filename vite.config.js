import { defineConfig } from 'vite';
import dsv from '@rollup/plugin-dsv';

export default defineConfig({
  // base: '/',
  server: {
    port: 3000,
  },
  publicDir: 'estaticos',
  build: {
    outDir: 'publico',
    assetsDir: 'recursos',
    sourcemap: true,
  },
  plugins: [dsv()],
});
