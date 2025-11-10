import { setupRenderingTest } from 'ember-qunit';

import setupIntl, { t } from './setup-intl';

export default function setupIntlRenderingTest(hooks, locale = 'fr') {
  setupRenderingTest(hooks);
  setupIntl(hooks, locale);
}

export { t };
