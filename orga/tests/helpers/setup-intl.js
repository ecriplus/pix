import { getContext, settled } from '@ember/test-helpers';
import { setupIntl as setupIntlFromEmberIntl } from 'ember-intl/test-support';
import { formats } from 'pix-orga/ember-intl';

export async function setCurrentLocale(locale) {
  const { owner } = getContext();

  const intl = owner.lookup('service:intl');
  intl.setFormats(formats);

  const localeService = owner.lookup('service:locale');
  localeService.setCurrentLocale(locale);

  await settled();
}

export default function setupIntl(hooks, locale = 'fr') {
  setupIntlFromEmberIntl(hooks, locale);

  hooks.beforeEach(async function () {
    await setCurrentLocale(locale);
  });
}
