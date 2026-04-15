import { classicEmberSupport, ember, extensions } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,
  },
  esbuild: {
    sourcemap: true,
    sourcesContent: true,
  },
  test: {
    sourcemap: true,
  },
  plugins: [
    classicEmberSupport(),
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
  server: {
    port: 4201,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        xfwd: true,
      },
    },
  },
});
