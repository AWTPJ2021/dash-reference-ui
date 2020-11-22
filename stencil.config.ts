import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';
export const config: Config = {
  namespace: 'dashjs',
  rollupPlugins: {
    after: [nodePolyfills()],
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
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
    },
  ],
};
