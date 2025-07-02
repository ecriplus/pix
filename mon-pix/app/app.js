import './deprecation-workflow';
import '@1024pix/epreuves-components';

import Application from '@ember/application';
import { init as initSentry } from '@sentry/ember';
import loadInitializers from 'ember-load-initializers';
import Resolver from 'ember-resolver';
import config from 'mon-pix/config/environment';

import { inspectorSupport } from './inspector-support';

if (config.sentry.enabled) {
  initSentry();
}

// This is a temporary solution, see https://github.com/emberjs/ember-inspector/issues/2612
if (config.emberInspector.enabled) {
  inspectorSupport();
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
