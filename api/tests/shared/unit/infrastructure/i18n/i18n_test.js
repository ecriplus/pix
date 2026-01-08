import { getI18n, options } from '../../../../../src/shared/infrastructure/i18n/i18n.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Shared | Infrastucture | i18n', function () {
  describe('getI18n', function () {
    it('returns an instance of i18n with default locale', function () {
      const i18n = getI18n();
      expect(i18n.getLocale()).to.equal('fr');
    });

    it('returns an instance of i18n with the specified locale', function () {
      const locale = 'es';
      const i18n = getI18n(locale);
      expect(i18n.getLocale()).to.equal(locale);
    });

    it('returns the same instance for same base language', function () {
      const i18n_fr = getI18n('fr');
      const i18n_fr_fr = getI18n('fr-FR');

      expect(i18n_fr.getLocale()).to.equal('fr');
      expect(i18n_fr_fr.getLocale()).to.equal('fr');
      expect(i18n_fr).to.equal(i18n_fr_fr);
    });

    context('when the locale is BCP 47 format', function () {
      it('returns the correct locale instance of i18n', function () {
        const locale = 'nl-BE';
        const i18n = getI18n(locale);
        expect(i18n.getLocale()).to.equal('nl');
      });
    });

    context('when the locale is not supported', function () {
      it('returns the default locale instance of i18n', function () {
        const locale = 'foo';
        const i18n = getI18n(locale);
        expect(i18n.getLocale()).to.equal('fr');
      });
    });

    context('when the i18n setLocale is called on an i18n instance', function () {
      it('does not change the instance locale', function () {
        const i18n1 = getI18n('fr');
        i18n1.setLocale('en');
        expect(i18n1.getLocale()).to.equal('fr');
      });
    });

    describe('getI18n().__', function () {
      it('interpolates parameters with single mustache', async function () {
        // when
        const result = getI18n().__('Hello {name}', { name: 'Bob' });

        // then
        expect(result).to.equal('Hello Bob');
      });

      it('interpolates parameter with single mustach when first argument is an object with explicit locale', async function () {
        // when
        const result = getI18n().__({ phrase: 'Hello {name}', locale: 'fr' }, { name: 'Bob' });

        // then
        expect(result).to.equal('Hello Bob');
      });
    });
  });
});
