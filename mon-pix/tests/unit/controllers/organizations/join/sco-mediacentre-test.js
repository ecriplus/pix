import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubCurrentUserService, stubSessionService } from '../../../../helpers/service-stubs.js';

module('Unit | Controller | campaigns | join | sco-mediacentre', function (hooks) {
  setupTest(hooks);

  let controller;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:organizations.join.sco-mediacentre');
    controller.set('model', { campaign: { code: 'AZERTY999' }, organizationToJoin: { id: 1 } });
  });

  module('#createAndReconcile', function () {
    test('should authenticate the user', async function (assert) {
      // given
      const accessToken = 'access-token';
      const externalUser = { save: sinon.stub().resolves({ accessToken }) };

      const sessionService = stubSessionService(this.owner);
      const currentUserService = stubCurrentUserService(this.owner);
      sessionService.authenticate.resolves();
      currentUserService.load.resolves();

      // when
      await controller.actions.createAndReconcile.call(controller, externalUser);

      // then
      sinon.assert.calledOnce(externalUser.save);
      sinon.assert.calledOnce(sessionService.revokeGarExternalUserToken);
      sinon.assert.calledWith(sessionService.authenticate, 'authenticator:oauth2', { token: accessToken });
      assert.ok(true);
    });
  });
});
