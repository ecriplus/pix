import { compatBuild } from '@embroider/compat';
import EmberApp from 'ember-cli/lib/broccoli/ember-app.js';

export default async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');
  const app = new EmberApp(defaults, {
    'ember-cli-template-lint': {
      testGenerator: 'qunit', // or 'mocha', etc.
    },
    '@embroider/macros': {
      setConfig: {
        '@ember-data/store': {
          polyfillUUID: true,
        },
      },
    },
    emberData: {
      deprecations: {},
    },
  });

  return compatBuild(app, buildOnce, {
    staticModifiers: true,
  });
}
