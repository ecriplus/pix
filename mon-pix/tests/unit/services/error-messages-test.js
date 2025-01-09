import { t } from 'ember-intl/test-support';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import setupIntl from '../../helpers/setup-intl';

module('Unit | Service | errorMessages', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  module('getErrorMessage', function () {
    module('when no mapping is found', function () {
      [{ status: '500' }, { errors: [{ status: '500' }] }].forEach((simpleErrorOrJsonApiError) => {
        test('returns a default message', async function (assert) {
          // given
          const errorMessages = this.owner.lookup('service:errorMessages');

          // when
          const message = errorMessages.getErrorMessage(simpleErrorOrJsonApiError);

          // then
          assert.strictEqual(message, t('common.error'));
        });
      });
    });

    module('when only error status is present', function () {
      [{ status: '401' }, { errors: [{ status: '401' }] }].forEach((simpleErrorOrJsonApiError) => {
        test('matches on error status', async function (assert) {
          // given
          const errorMessages = this.owner.lookup('service:errorMessages');

          // when
          const message = errorMessages.getErrorMessage(simpleErrorOrJsonApiError);

          // then
          assert.strictEqual(message, t('pages.login-or-register-oidc.error.login-unauthorized-error'));
        });
      });
    });

    module('when both error code and error status are present', function () {
      [
        { status: '401', code: 'EXPIRED_AUTHENTICATION_KEY' },
        { errors: [{ status: '401', code: 'EXPIRED_AUTHENTICATION_KEY' }] },
      ].forEach((simpleErrorOrJsonApiError) => {
        test('matches first on error code', async function (assert) {
          // given
          const errorMessages = this.owner.lookup('service:errorMessages');

          // when
          const message = errorMessages.getErrorMessage(simpleErrorOrJsonApiError);

          // then
          assert.strictEqual(message, t('pages.login-or-register-oidc.error.expired-authentication-key'));
        });
      });
    });
  });
});
