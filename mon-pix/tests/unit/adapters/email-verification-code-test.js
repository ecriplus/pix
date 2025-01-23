import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { stubCurrentUserService } from '../../helpers/service-stubs';

module('Unit | Adapter | Email-Verification-Code', function (hooks) {
  setupTest(hooks);

  module('#buildURL', function () {
    test('should call API to send email verification code', async function (assert) {
      // given
      const currentUserService = stubCurrentUserService(this.owner, { id: '123' });
      currentUserService.user.get.returns(123);

      // when
      const adapter = this.owner.lookup('adapter:email-verification-code');
      const url = await adapter.buildURL();

      // then
      assert.true(url.endsWith('users/123'));
    });
  });
});
