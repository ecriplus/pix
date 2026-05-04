import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/certification-centers/get/invitations', function (hooks) {
  setupTest(hooks);

  module('#beforeModel', function () {
    test('it should transition to get route when certification center is archived', async function (assert) {
      // given
      const certificationCenter = { id: 1, isArchived: true };
      const route = this.owner.lookup('route:authenticated/certification-centers/get/invitations');
      sinon.stub(route.router, 'replaceWith');
      sinon.stub(route, 'modelFor').returns({ certificationCenter });

      // when
      await route.beforeModel();

      // then
      assert.ok(route.router.replaceWith.calledWith('authenticated.certification-centers.get'));
    });
  });

  test('it should return certification center with its invitations', async function (assert) {
    // given
    const route = this.owner.lookup('route:authenticated/certification-centers/get/invitations');

    const certificationCenterInvitations = Symbol('some certification center invitations');
    const certificationCenter = {
      id: 777,
      certificationCenterInvitations,
    };
    route.modelFor = sinon.stub();
    route.modelFor.withArgs('authenticated.certification-centers.get').returns({ certificationCenter });

    // when
    const result = await route.model();

    // then
    assert.deepEqual(result, { certificationCenter, certificationCenterId: 777, certificationCenterInvitations });
  });
});
