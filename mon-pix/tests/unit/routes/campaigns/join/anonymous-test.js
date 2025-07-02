import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | Join | Anonymous', function (hooks) {
  setupTest(hooks);

  let route, verifiedCode;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:campaigns.join.anonymous');
    route.modelFor = sinon.stub();
    route.session = { authenticate: sinon.stub() };
    route.currentUser = { load: sinon.stub() };
    const campaign = { code: 'YOLOCODE', organizationId: 1 };
    verifiedCode = { id: campaign.code, type: 'campaign', campaign };
  });

  module('#model', function () {
    test('should load model', async function (assert) {
      //when
      await route.model();

      //then
      sinon.assert.calledWith(route.modelFor, 'campaigns');
      assert.ok(true);
    });
  });

  module('#afterModel', function () {
    test('should authenticate as anonymous', async function (assert) {
      //given & when
      await route.afterModel({ verifiedCode });

      //then
      sinon.assert.calledWith(route.session.authenticate, 'authenticator:anonymous', { campaignCode: 'YOLOCODE' });
      assert.ok(true);
    });

    test('should load user', async function (assert) {
      //given & when
      await route.afterModel({ verifiedCode });

      //then
      sinon.assert.called(route.currentUser.load);
      assert.ok(true);
    });
  });
});
