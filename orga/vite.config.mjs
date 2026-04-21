import { classicEmberSupport, ember, extensions } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import url from 'postcss-url';
import sassEmbedded, { NodePackageImporter } from 'sass-embedded';
import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [
        url({
          url: (asset) => {
            if (asset.url.startsWith('../@1024pix/')) {
              // Pix UI static files are referenced by url starting with "../"
              // but vite is bunlding those files in root asset folder
              // so we need to remove the "../" prefix
              // ../@1024pix/pix-ui/fonts/Nunito/Nunito-Bold.woff2
              return asset.url.replace('..', '');
            }
            return undefined;
          },
        }),
      ],
    },
    preprocessorOptions: {
      scss: {
        api: 'modern',
        implementation: sassEmbedded,
        includePaths: ['app/styles'],
        importers: [
          new NodePackageImporter(),
          // avoid error loading sass files from pix-ui addon
          {
            findFileUrl(url) {
              if (url.startsWith('pix-design-token')) {
                return new URL(`file://${process.cwd()}/node_modules/@1024pix/pix-ui/addon/styles/${url}`);
              }
              return null;
            },
          },
        ],
      },
    },
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
