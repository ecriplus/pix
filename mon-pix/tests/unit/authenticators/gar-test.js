import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Authenticator | gar', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    sinon.restore();
  });

  module('#authenticate', function () {
    test('should authenticate the user', async function (assert) {
      // given
      const authenticator = this.owner.lookup('authenticator:gar');
      const token =
        'aaa.' +
        btoa(`{
        "user_id": 1,
        "source": "gar",
        "iat": 1545321469,
        "exp": 4702193958
      }`) +
        '.bbb';

      // when
      const result = await authenticator.authenticate(token);

      // then
      assert.deepEqual(result, {
        token_type: 'bearer',
        access_token: token,
        user_id: 1,
        expiresAt: 4702193958000,
        source: 'gar',
      });
    });
  });
});
