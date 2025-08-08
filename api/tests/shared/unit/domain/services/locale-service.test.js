import * as localeService from '../../../../../src/shared/domain/services/locale-service.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Shared | Domain | Service | Locale', function () {
  describe('getSupportedLanguages', function () {
    it('returns languages computed from the supported locales', function () {
      // when
      const result = localeService.getSupportedLanguages();

      // then
      expect(result).to.deep.equal(['en', 'es', 'fr', 'nl']);
    });
  });

  describe('getNearestSupportedLocale', function () {
    context('when given a supported locale in canonical form', function () {
      it('returns the locale', function () {
        // given
        const name = 'fr-FR';

        // when
        const locale = localeService.getNearestSupportedLocale(name);

        // then
        expect(locale).to.equal('fr-FR');
      });
    });

    context('when given a supported locale but not in canonical form', function () {
      it('returns the canonical locale form', function () {
        // given
        const name = 'fr-fr';

        // when
        const locale = localeService.getNearestSupportedLocale(name);

        // then
        expect(locale).to.equal('fr-FR');
      });
    });

    context('when given an unsupported locale but the base language is supported', function () {
      it('returns the base language locale', function () {
        // given
        const name = 'fr-CA';

        // when
        const locale = localeService.getNearestSupportedLocale(name);

        // then
        expect(locale).to.equal('fr');
      });
    });

    context('when given a locale and base language are both not supported', function () {
      it('returns the default locale', function () {
        // given
        const name = 'br_FR';

        // when
        const locale = localeService.getNearestSupportedLocale(name);

        // then
        expect(locale).to.equal('fr');
      });
    });

    context('when given an invalid name', function () {
      it('returns the default locale', function () {
        // given
        const name = 'anInvalidLocaleName';

        // when
        const locale = localeService.getNearestSupportedLocale(name);

        // then
        expect(locale).to.equal('fr');
      });
    });
  });

  describe('getBaseLocale', function () {
    context('when locale is valid', function () {
      [
        { locale: 'fr-fr', expectedBaseLocale: 'fr' },
        { locale: 'fr-FR', expectedBaseLocale: 'fr' },
        { locale: 'en', expectedBaseLocale: 'en' },
        { locale: 'en-GB', expectedBaseLocale: 'en' },
      ].forEach(({ locale, expectedBaseLocale }) => {
        it(`returns the corresponding base locale ${expectedBaseLocale} for ${locale}`, function () {
          // given / when
          const baseLocale = localeService.getBaseLocale(locale);

          // then
          expect(baseLocale).to.equal(expectedBaseLocale);
        });
      });
    });

    context('when locale is invalid', function () {
      ['fr_FR', 'yo-yo-yo', null].forEach((invalidLocale) => {
        it(`returns the default base locale for ${invalidLocale}`, function () {
          // given / when
          const baseLocale = localeService.getBaseLocale(invalidLocale);

          // then
          const defaultBaseLocale = new Intl.Locale(localeService.getDefaultLocale()).language;
          expect(baseLocale).to.equal(defaultBaseLocale);
        });
      });
    });
  });

  describe('isFranceLocale', function () {
    context('when locale from France', function () {
      ['fr-fr', 'fr-FR'].forEach((franceLocale) => {
        it(`returns true for ${franceLocale}`, function () {
          // given / when
          const isFranceLocale = localeService.isFranceLocale(franceLocale);

          // then
          expect(isFranceLocale).to.be.true;
        });
      });
    });

    context('when locale is not from France', function () {
      ['fr', 'en', 'en-GB', null].forEach((franceLocale) => {
        it(`returns true for ${franceLocale}`, function () {
          // given / when
          const isFranceLocale = localeService.isFranceLocale(franceLocale);

          // then
          expect(isFranceLocale).to.be.false;
        });
      });
    });
  });
});
