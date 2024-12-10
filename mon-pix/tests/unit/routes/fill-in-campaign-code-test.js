import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { stubSessionService } from '../../helpers/service-stubs.js';

module('Unit | Route | fill-in-campaign-code', function (hooks) {
  setupTest(hooks);

  module('#beforeModel', function () {
    test('should store externalUser queryParam in session', function (assert) {
      // given
      const externalUser = 'external-user-token';
      const route = this.owner.lookup('route:fill-in-campaign-code');

      const sessionStub = stubSessionService(this.owner);
      route.set('session', sessionStub);

      const transition = { to: { queryParams: { externalUser } } };

      // when
      route.beforeModel(transition);

      // then
      assert.strictEqual(sessionStub.externalUserTokenFromGar, externalUser);
    });
  });
});
