import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | organizations/invited/student-sco', function (hooks) {
  setupTest(hooks);

  module('#afterModel', function () {
    test('should redirect to campaigns.fill-in-participant-external-id when an association already exists', async function (assert) {
      // given
      const route = this.owner.lookup('route:organizations.invited.student-sco');
      const campaign = { code: 'campaignCode', organizationId: 1 };
      const organizationToJoin = { id: 1 };
      route.paramsFor = sinon.stub().returns(campaign);
      const user = { id: 'id' };
      const queryRecordStub = sinon.stub();
      route.set(
        'store',
        Service.create({
          queryRecord: queryRecordStub
            .withArgs({ organizationId: campaign.organizationId, userId: user.id })
            .resolves('a student user association'),
        }),
      );
      route.set(
        'currentUser',
        Service.create({
          user,
        }),
      );
      route.router = { replaceWith: sinon.stub() };

      // when
      await route.afterModel({ campaign, organizationToJoin });

      // then
      sinon.assert.calledWith(route.router.replaceWith, 'campaigns.fill-in-participant-external-id', campaign.code);
      assert.ok(true);
    });
  });
});
