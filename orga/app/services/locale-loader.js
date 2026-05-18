import Service, { service } from '@ember/service';
import dayjs from 'dayjs';

export default class LocaleLoaderService extends Service {
  @service intl;

  #LOADERS = {
    de: {
      dayjs: () => import('dayjs/esm/locale/de.js'),
      intl: () => import('virtual:ember-intl/translations/de'),
    },
    en: {
      dayjs: () => import('dayjs/esm/locale/en.js'),
      intl: () => import('virtual:ember-intl/translations/en'),
    },
    es: {
      dayjs: () => import('dayjs/esm/locale/es.js'),
      intl: () => import('virtual:ember-intl/translations/es'),
    },
    fr: {
      dayjs: () => import('dayjs/esm/locale/fr.js'),
      intl: () => import('virtual:ember-intl/translations/fr'),
    },
    it: {
      dayjs: () => import('dayjs/esm/locale/it.js'),
      intl: () => import('virtual:ember-intl/translations/it'),
    },
    nl: {
      dayjs: () => import('dayjs/esm/locale/nl.js'),
      intl: () => import('virtual:ember-intl/translations/nl'),
    },
  };

  async load(locale) {
    const language = new Intl.Locale(locale).language;
    if (!Object.keys(this.#LOADERS).includes(language)) {
      throw new Error('Language not supported');
    }
    const { default: dayjsLocaleData } = await this.#LOADERS[language].dayjs();
    dayjs.locale(language, dayjsLocaleData);
    const { default: intlData } = await this.#LOADERS[language].intl();
    this.intl.addTranslations(language, intlData);
  }
}
