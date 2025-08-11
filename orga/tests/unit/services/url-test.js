import { setupTest } from 'ember-qunit';
import ENV from 'pix-orga/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../../helpers/setup-intl';
import { setCurrentLocale } from '../../helpers/setup-intl.js';

module('Unit | Service | url', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  module('legalNoticeUrl', function () {
    test('returns the Pix website legal notice URL', function (assert) {
      // given
      const service = this.owner.lookup('service:url');

      // when
      const legalNoticeUrl = service.legalNoticeUrl;

      // then
      assert.strictEqual(legalNoticeUrl, 'https://pix.org/fr/mentions-legales');
    });

    test('returns the Pix website legal notice URL for a locale', async function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      await setCurrentLocale('en');

      // when
      const legalNoticeUrl = service.legalNoticeUrl;

      // then
      assert.strictEqual(legalNoticeUrl, 'https://pix.org/en/legal-notice');
    });
  });

  module('cguUrl', function () {
    test('returns the Pix website CGU URL', function (assert) {
      // given
      const service = this.owner.lookup('service:url');

      // when
      const cguUrl = service.cguUrl;

      // then
      assert.strictEqual(cguUrl, 'https://pix.org/fr/conditions-generales-d-utilisation');
    });

    test('returns the Pix website CGU URL for a locale', async function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      await setCurrentLocale('en');

      // when
      const cguUrl = service.cguUrl;

      // then
      assert.strictEqual(cguUrl, 'https://pix.org/en/terms-and-conditions');
    });
  });

  module('dataProtectionPolicyUrl', function () {
    test('returns the Pix website data protection policy URL', function (assert) {
      // given
      const service = this.owner.lookup('service:url');

      // when
      const dataProtectionPolicyUrl = service.dataProtectionPolicyUrl;

      // then
      assert.strictEqual(dataProtectionPolicyUrl, 'https://pix.org/fr/politique-protection-donnees-personnelles-app');
    });

    test('returns the Pix website data protection policy URL for a locale', async function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      await setCurrentLocale('en');

      // when
      const dataProtectionPolicyUrl = service.dataProtectionPolicyUrl;

      // then
      assert.strictEqual(dataProtectionPolicyUrl, 'https://pix.org/en/personal-data-protection-policy');
    });
  });

  module('accessibilityUrl', function () {
    test('returns the Pix website accessibility URL', function (assert) {
      // given
      const service = this.owner.lookup('service:url');

      // when
      const accessibilityUrl = service.accessibilityUrl;

      // then
      assert.strictEqual(accessibilityUrl, 'https://pix.org/fr/accessibilite-pix-orga');
    });

    test('returns the Pix website accessibility URL for a locale', async function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      await setCurrentLocale('en');

      // when
      const accessibilityUrl = service.accessibilityUrl;

      // then
      assert.strictEqual(accessibilityUrl, 'https://pix.org/en/accessibility-pix-orga');
    });
  });

  module('#campaignsRootUrl', function () {
    test('returns default campaigns root url when is defined', function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      sinon.stub(ENV, 'APP').value({ CAMPAIGNS_ROOT_URL: 'https://app.test.pix.fr/campagnes/' });

      // when
      const campaignsRootUrl = service.campaignsRootUrl;

      // then
      assert.strictEqual(campaignsRootUrl, 'https://app.test.pix.fr/campagnes/');
    });

    test('returns campaigns root url for current pix-app environement', function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      sinon
        .stub(ENV, 'APP')
        .value({ CAMPAIGNS_ROOT_URL: null, PIX_APP_URL_WITHOUT_EXTENSION: 'https://app.test.pix.' });

      const domainService = this.owner.lookup('service:currentDomain');
      sinon.stub(domainService, 'getExtension').returns('org');

      // when
      const campaignsRootUrl = service.campaignsRootUrl;

      // then
      assert.strictEqual(campaignsRootUrl, 'https://app.test.pix.org/campagnes/');
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
    test('returns the Pix legal document URL', function (assert) {
      // given
      const service = this.owner.lookup('service:url');

      // when
      const accessibilityUrl = service.getLegalDocumentUrl('my-legal-document-path');

      // then
      assert.strictEqual(accessibilityUrl, 'https://pix.org/fr/my-legal-document-path');
    });

    test('returns the Pix legal document URL for a locale', async function (assert) {
      // given
      const service = this.owner.lookup('service:url');
      await setCurrentLocale('en');

      // when
      const accessibilityUrl = service.getLegalDocumentUrl('my-legal-document-path');

      // then
      assert.strictEqual(accessibilityUrl, 'https://pix.org/en/my-legal-document-path');
    });
  });
});
