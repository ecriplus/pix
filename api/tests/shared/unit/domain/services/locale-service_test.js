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
});
