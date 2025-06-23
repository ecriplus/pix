import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Controller | organizations/invited/student-sco', function (hooks) {
  setupTest(hooks);

  let controller;
  const organizationId = 1;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:organizations.invited.student-sco');
    controller.accessStorage = { setAssociationDone: sinon.stub() };
    controller.router = { transitionTo: sinon.stub() };
    controller.set('model', {
      campaign: { code: 'AZERTY999', organizationId },
      organizationToJoin: { id: organizationId },
    });
  });

  module('#reconcile', function (hooks) {
    let scoOrganizationLearner;

    hooks.beforeEach(function () {
      scoOrganizationLearner = { save: sinon.stub() };
    });

    module('When withReconciliation is false', function () {
      test('should run reconciliation checks and not redirect', async function (assert) {
        // given
        scoOrganizationLearner.save.resolves();
        const adapterOptions = { withReconciliation: false };

        // when
        await controller.actions.reconcile.call(controller, scoOrganizationLearner, adapterOptions);

        // then
        sinon.assert.calledOnce(scoOrganizationLearner.save);
        sinon.assert.notCalled(controller.router.transitionTo);
        assert.ok(true);
      });
    });

    module('When withReconciliation is true', function () {
      test('should associate user with student and redirect to campaigns.fill-in-participant-external-id', async function (assert) {
        // given
        scoOrganizationLearner.save.resolves();
        const adapterOptions = { withReconciliation: true };

        // when
        await controller.actions.reconcile.call(controller, scoOrganizationLearner, adapterOptions);

        // then
        sinon.assert.calledOnce(scoOrganizationLearner.save);
        sinon.assert.calledWithExactly(controller.accessStorage.setAssociationDone, organizationId);
        sinon.assert.calledWith(
          controller.router.transitionTo,
          'campaigns.fill-in-participant-external-id',
          'AZERTY999',
        );
        assert.ok(true);
      });
    });
  });
});
