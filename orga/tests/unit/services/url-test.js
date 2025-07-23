import Service from '@ember/service';
import { setLocale } from 'ember-intl/test-support';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../../helpers/setup-intl';

module('Unit | Service | url', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  module('#campaignsRootUrl', function () {
    test('returns default campaigns root url when is defined', function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      service.definedCampaignsRootUrl = 'pix.test.fr';

      // when
      const campaignsRootUrl = service.campaignsRootUrl;

      // then
      assert.strictEqual(campaignsRootUrl, service.definedCampaignsRootUrl);
    });

    test('returns "pix.test" url when current domain contains pix.test', function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      const expectedCampaignsRootUrl = 'https://app.pix.test/campagnes/';
      service.definedCampaignsRootUrl = undefined;
      service.currentDomain = { getExtension: sinon.stub().returns('test') };

      // when
      const campaignsRootUrl = service.campaignsRootUrl;

      // then
      assert.strictEqual(campaignsRootUrl, expectedCampaignsRootUrl);
    });
  });

  module('#homeUrl', function () {
    test('returns home url with current locale', function (assert) {
      // given
      const currentLocale = 'en';
      setLocale([currentLocale, 'fr']);

      const service = this.owner.lookup('service:url');
      const expectedHomeUrl = `${service.definedHomeUrl}?lang=${currentLocale}`;

      // when
      const homeUrl = service.homeUrl;

      // then
      assert.strictEqual(homeUrl, expectedHomeUrl);
    });
  });

  module('#legalNoticeUrl', function () {
    module('when domain is pix.fr', function () {
      test('returns "pix.fr" url', function (assert) {
        // given
        const service = this.owner.lookup('service:url');
        const expectedUrl = 'https://pix.fr/mentions-legales';
        service.currentDomain = { isFranceDomain: true };
        service.locale = { currentLocale: 'fr' };

        // when
        const url = service.legalNoticeUrl;

        // then
        assert.strictEqual(url, expectedUrl);
      });
    });

    module('when domain is pix.org', function () {
      [
        {
          currentLocale: 'en',
          expectedUrl: 'https://pix.org/en/legal-notice',
        },
        {
          currentLocale: 'fr',
          expectedUrl: 'https://pix.org/fr/mentions-legales',
        },
        {
          currentLocale: 'nl',
          expectedUrl: 'https://pix.org/nl-BE/wettelijke-vermeldingen',
        },
      ].forEach(({ currentLocale, expectedUrl }) => {
        test(`returns "pix.org" ${currentLocale} url when locale is ${currentLocale}`, function (assert) {
          // given
          const service = this.owner.lookup('service:url');
          sinon.stub(service.locale, 'currentLocale').value(currentLocale);

          service.currentDomain = { isFranceDomain: false };

          // when
          const url = service.legalNoticeUrl;

          // then
          assert.strictEqual(url, expectedUrl);
        });
      });
    });
  });

  module('#forgottenPasswordUrl', function () {
    [
      {
        locale: 'en',
        currentDomain: 'org',
        expectedUrl: 'https://app.pix.org/mot-de-passe-oublie?lang=en',
      },
      {
        locale: 'fr',
        currentDomain: 'fr',
        expectedUrl: 'https://app.pix.fr/mot-de-passe-oublie',
      },
      {
        locale: 'fr',
        currentDomain: 'org',
        expectedUrl: 'https://app.pix.org/mot-de-passe-oublie',
      },
      {
        locale: 'nl',
        currentDomain: 'org',
        expectedUrl: 'https://app.pix.org/mot-de-passe-oublie?lang=nl',
      },
    ].forEach(({ locale, expectedUrl, currentDomain }) => {
      test(`returns forgotten password url when locale is ${locale} and domain is ${currentDomain}`, function (assert) {
        // given
        const urlService = this.owner.lookup('service:url');
        class CurrentDomainServiceStub extends Service {
          getExtension() {
            return currentDomain;
          }
        }
        this.owner.register('service:currentDomain', CurrentDomainServiceStub);

        sinon.stub(urlService.locale, 'currentLocale').value(locale);

        // when
        const url = urlService.forgottenPasswordUrl;

        // then
        assert.strictEqual(url, expectedUrl);
      });
    });
  });

  module('#dataProtectionPolicyUrl', function () {
    module('when domain is pix.fr', function () {
      test('returns "pix.fr" url', function (assert) {
        // given
        const service = this.owner.lookup('service:url');
        const expectedUrl = 'https://pix.fr/politique-protection-donnees-personnelles-app';
        service.currentDomain = { isFranceDomain: true };

        sinon.stub(service.locale, 'currentLocale').value('fr');

        // when
        const cguUrl = service.dataProtectionPolicyUrl;

        // then
        assert.strictEqual(cguUrl, expectedUrl);
      });
    });

    module('when domain is pix.org', function () {
      [
        {
          currentLocale: 'en',
          expectedUrl: 'https://pix.org/en/personal-data-protection-policy',
        },
        {
          currentLocale: 'fr',
          expectedUrl: 'https://pix.org/fr/politique-protection-donnees-personnelles-app',
        },
        {
          currentLocale: 'nl',
          expectedUrl: 'https://pix.org/nl-BE/beleid-inzake-de-bescherming-van-persoonsgegevens',
        },
      ].forEach(({ currentLocale, expectedUrl }) => {
        test(`returns "pix.org" ${currentLocale} url when locale is ${currentLocale}`, function (assert) {
          // given
          const service = this.owner.lookup('service:url');
          service.currentDomain = { isFranceDomain: false };
          sinon.stub(service.locale, 'currentLocale').value(currentLocale);

          // when
          const url = service.dataProtectionPolicyUrl;

          // then
          assert.strictEqual(url, expectedUrl);
        });
      });
    });
  });

  module('#cguUrl', function () {
    module('when domain is pix.fr', function () {
      test('returns "pix.fr" url', function (assert) {
        // given
        const service = this.owner.lookup('service:url');
        const expectedUrl = 'https://pix.fr/conditions-generales-d-utilisation';
        service.currentDomain = { isFranceDomain: true };
        sinon.stub(service.locale, 'currentLocale').value('fr');

        // when
        const url = service.cguUrl;

        // then
        assert.strictEqual(url, expectedUrl);
      });
    });

    module('when domain is pix.org', function () {
      [
        {
          currentLocale: 'en',
          expectedUrl: 'https://pix.org/en/terms-and-conditions',
        },
        {
          currentLocale: 'fr',
          expectedUrl: 'https://pix.org/fr/conditions-generales-d-utilisation',
        },
        {
          currentLocale: 'nl',
          expectedUrl: 'https://pix.org/nl-BE/algemene-gebruiksvoorwaarden',
        },
      ].forEach(({ currentLocale, expectedUrl }) => {
        test(`returns "pix.org" ${currentLocale} url when locale is ${currentLocale}`, function (assert) {
          // given
          const service = this.owner.lookup('service:url');
          service.currentDomain = { isFranceDomain: false };
          sinon.stub(service.locale, 'currentLocale').value(currentLocale);

          // when
          const url = service.cguUrl;

          // then
          assert.strictEqual(url, expectedUrl);
        });
      });
    });
  });

  module('#accessibilityUrl', function () {
    module('when domain is pix.fr', function () {
      test('returns "pix.fr"', function (assert) {
        // given
        const service = this.owner.lookup('service:url');
        const expectedUrl = 'https://pix.fr/accessibilite-pix-orga';
        service.currentDomain = { isFranceDomain: true };
        sinon.stub(service.locale, 'currentLocale').value('fr');

        // when
        const url = service.accessibilityUrl;

        // then
        assert.strictEqual(url, expectedUrl);
      });
    });

    module('when domain is pix.org', function () {
      [
        {
          currentLocale: 'en',
          expectedUrl: 'https://pix.org/en/accessibility-pix-orga',
        },
        {
          currentLocale: 'fr',
          expectedUrl: 'https://pix.org/fr/accessibilite-pix-orga',
        },
        {
          currentLocale: 'nl',
          expectedUrl: 'https://pix.org/nl-BE/toegankelijkheid-pix-orga',
        },
      ].forEach(({ currentLocale, expectedUrl }) => {
        test(`returns "pix.org" ${currentLocale} url when locale is ${currentLocale}`, function (assert) {
          // given
          const service = this.owner.lookup('service:url');
          service.currentDomain = { isFranceDomain: false };
          sinon.stub(service.locale, 'currentLocale').value(currentLocale);

          // when
          const url = service.accessibilityUrl;

          // then
          assert.strictEqual(url, expectedUrl);
        });
      });
    });
  });

  module('#serverStatusUrl', function () {
    test('returns "status.pix.org" in english when current language is en', function (assert) {
      // given
      const expectedUrl = 'https://status.pix.org?locale=en';
      const service = this.owner.lookup('service:url');
      sinon.stub(service.locale, 'currentLocale').value('en');

      // when
      const serverStatusUrl = service.serverStatusUrl;

      // then
      assert.strictEqual(serverStatusUrl, expectedUrl);
    });

    test('returns "status.pix.org" in french when current language is fr', function (assert) {
      // given
      const expectedUrl = 'https://status.pix.org?locale=fr';
      const service = this.owner.lookup('service:url');
      sinon.stub(service.locale, 'currentLocale').value('fr');

      // when
      const serverStatusUrl = service.serverStatusUrl;

      // then
      assert.strictEqual(serverStatusUrl, expectedUrl);
    });

    test('returns "status.pix.org" in french when current language is nl', function (assert) {
      // given
      const expectedUrl = 'https://status.pix.org?locale=nl';
      const service = this.owner.lookup('service:url');
      sinon.stub(service.locale, 'currentLocale').value('nl');

      // when
      const serverStatusUrl = service.serverStatusUrl;

      // then
      assert.strictEqual(serverStatusUrl, expectedUrl);
    });
  });

  module('#pixJuniorSchoolUrl', function () {
    test('returns pix junior url for current organization', function (assert) {
      const service = this.owner.lookup('service:url');
      service.pixJuniorUrl = 'https://junior.pix.fr';
      service.currentUser = { organization: { schoolCode: 'MINIPIXOU' } };
      service.currentDomain = { getJuniorBaseUrl: () => 'https://junior.pix.fr' };

      const pixJuniorSchoolUrl = service.pixJuniorSchoolUrl;

      assert.strictEqual(pixJuniorSchoolUrl, 'https://junior.pix.fr/schools/MINIPIXOU');
    });
    test('returns empty string if the current organization has not any school code', function (assert) {
      const service = this.owner.lookup('service:url');
      service.pixJuniorUrl = 'https://junior.pix.fr';
      service.currentUser = { organization: {} };

      const pixJuniorSchoolUrl = service.pixJuniorSchoolUrl;

      assert.strictEqual(pixJuniorSchoolUrl, '');
    });
  });

  module('#getLegalDocumentUrl', function () {
    [
      {
        locale: 'en',
        currentDomain: 'org',
        expectedUrl: 'https://pix.org/en/my-custom-path',
      },
      {
        locale: 'fr',
        currentDomain: 'fr',
        expectedUrl: 'https://pix.fr/my-custom-path',
      },
      {
        locale: 'fr',
        currentDomain: 'org',
        expectedUrl: 'https://pix.org/fr/my-custom-path',
      },
      {
        locale: 'nl',
        currentDomain: 'org',
        expectedUrl: 'https://pix.org/nl-BE/my-custom-path',
      },
    ].forEach(({ locale, expectedUrl, currentDomain }) => {
      test(`returns legal document URL when locale is ${locale} and domain is ${currentDomain}`, function (assert) {
        // given
        const urlService = this.owner.lookup('service:url');
        sinon.stub(urlService.locale, 'currentLocale').value(locale);

        class CurrentDomainServiceStub extends Service {
          isFranceDomain = currentDomain === 'fr';
        }
        this.owner.register('service:currentDomain', CurrentDomainServiceStub);

        // when
        const url = urlService.getLegalDocumentUrl('my-custom-path');

        // then
        assert.strictEqual(url, expectedUrl);
      });
    });
  });
});
