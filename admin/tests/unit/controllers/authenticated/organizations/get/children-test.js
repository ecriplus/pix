import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../../../../../helpers/setup-intl';

module('Unit | Controller | authenticated/organizations/get/children', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  let controller;
  let notifications;
  let store;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/organizations/get/children');
    notifications = this.owner.lookup('service:pixToast');
    store = this.owner.lookup('service:store');

    this.intl = this.owner.lookup('service:intl');
  });

  module('#handleFormSubmitted', function () {
    test('attaches child organization to parent organization and displays success notification', async function (assert) {
      // given
      const childOrganizationIds = '1234, 5678';
      const organizationAdapter = { attachChildOrganization: sinon.stub().resolves() };

      sinon.stub(store, 'adapterFor').returns(organizationAdapter);
      sinon.stub(notifications, 'sendSuccessNotification');
      controller.model = {
        organization: store.createRecord('organization', { id: '12' }),
      };
      const reloadStub = sinon.stub();
      controller.model.organization.hasMany = sinon.stub();
      controller.model.organization.hasMany.returns({
        reload: reloadStub,
      });

      // when
      await controller.handleFormSubmitted(childOrganizationIds);

      // then
      assert.true(store.adapterFor.calledWithExactly('organization'));
      assert.true(
        organizationAdapter.attachChildOrganization.calledWithExactly({
          childOrganizationIds: '1234, 5678',
          parentOrganizationId: '12',
        }),
      );
      assert.true(
        notifications.sendSuccessNotification.calledWithExactly({
          message: this.intl.t('pages.organization-children.notifications.success.attach-child-organization', {
            count: 2,
          }),
        }),
      );
      assert.true(reloadStub.calledOnce);
    });

    module('when form submit fails', function () {
      [
        {
          code: 'UNABLE_TO_ATTACH_CHILD_ORGANIZATION_TO_ITSELF',
          message: `Impossible d'attacher l'organisation à elle-même`,
        },
        {
          code: 'UNABLE_TO_ATTACH_ALREADY_ATTACHED_CHILD_ORGANIZATION',
          message: `L'organisation fille est déjà liée.`,
        },
        {
          code: 'UNABLE_TO_ATTACH_CHILD_ORGANIZATION_TO_ANOTHER_CHILD_ORGANIZATION',
          message: `Impossible d'attacher une organisation fille à une autre organisation fille.`,
        },
        {
          code: 'UNABLE_TO_ATTACH_PARENT_ORGANIZATION_AS_CHILD_ORGANIZATION',
          message: `Impossible d'attacher une organisation mère en tant qu'organisation fille.`,
        },
      ].forEach(({ code, message }) => {
        module(`when receiving ${code} error code`, function () {
          test('calls notification service error', async function (assert) {
            // given
            const childOrganizationId = '1234';
            const organizationAdapter = {
              attachChildOrganization: sinon.stub().rejects({
                errors: [{ code }],
              }),
            };

            sinon.stub(store, 'adapterFor').returns(organizationAdapter);
            sinon.stub(notifications, 'sendErrorNotification');

            controller.model = {
              organization: store.createRecord('organization', { id: '12' }),
              organizations: { reload: sinon.stub().resolves() },
            };

            // when
            await controller.handleFormSubmitted(childOrganizationId);

            // then
            assert.true(notifications.sendErrorNotification.calledWithExactly({ message }));
            assert.true(controller.model.organizations.reload.notCalled);
          });
        });
      });
    });
  });
});
