import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import setupIntl from '../../helpers/setup-intl';

module('Unit | Authenticator | anonymous', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  module('restore', function () {
    module('when there is no access_token', function () {
      test('it rejects', async function (assert) {
        // given
        const authenticator = this.owner.lookup('authenticator:anonymous');
        const data = {};

        // when & then
        await assert.rejects(authenticator.restore(data));
      });
    });

    module('when there is an access_token', function () {
      module('when the access_token is expired', function () {
        test('it rejects', async function (assert) {
          // given
          const authenticator = this.owner.lookup('authenticator:anonymous');
          const data = { expiresAt: new Date().getTime(), access_token: 'accessTokenData' };

          // when & then
          await assert.rejects(authenticator.restore(data));
        });
      });

      module('when the access_token is not expired', function () {
        test('it returns the still valid data', async function (assert) {
          // given
          const authenticator = this.owner.lookup('authenticator:anonymous');
          const data = { expiresAt: new Date().getTime() + 60000, access_token: 'accessTokenData' };

          // when
          const result = await authenticator.restore(data);

          // then
          assert.strictEqual(result, data);
        });
      });
    });
  });
});
