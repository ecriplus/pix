import { RSVP } from '@ember/-internals/runtime';
import Application from '@ember/application';
import * as runtime from '@glimmer/runtime';
import * as tracking from '@glimmer/tracking';
import * as validator from '@glimmer/validator';
import Ember from 'ember';
import loadInitializers from 'ember-load-initializers';
import config from 'pix-admin/config/environment';

import Resolver from './resolver';

class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

// This is a temporary solution, see https://github.com/emberjs/ember-inspector/issues/2612
window.define('@glimmer/tracking', () => tracking);
window.define('@glimmer/runtime', () => runtime);
window.define('@glimmer/validator', () => validator);
window.define('rsvp', () => RSVP);
window.define('ember', () => ({ default: Ember }));
window.define('<my-app>/config/environment', () => ({
  default: config,
}));

loadInitializers(App, config.modulePrefix);

export default App;
