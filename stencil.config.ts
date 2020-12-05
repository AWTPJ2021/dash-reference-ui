import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';
export const config: Config = {
  namespace: 'dashjs',
  plugins: [
    sass({
      includePaths: ['./node_modules/'],
      injectGlobalPaths: ['src/app.scss'],
    }),
  ],
  rollupPlugins: {
    after: [nodePolyfills()],
  },
  globalStyle: 'src/app.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [{ src: 'static', warn: true }],
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      strict: true,
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [{ src: 'static', warn: true }],
    },
  ],
};
