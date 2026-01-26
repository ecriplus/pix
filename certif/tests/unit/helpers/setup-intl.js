import { formats } from 'pix-certif/ember-intl';

export default function setupIntlForModels(hooks, locale = ['fr']) {
  hooks.beforeEach(function () {
    this.intl = this.owner.lookup('service:intl');
    this.intl.setFormats(formats);
    this.intl.setLocale(locale);
  });
}
