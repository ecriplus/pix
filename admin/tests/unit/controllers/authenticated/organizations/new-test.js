import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../../../../helpers/setup-intl';

module('Unit | Controller | authenticated/organizations/new', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  let controller;
  let store;
  let notifications;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/organizations/new');
    store = this.owner.lookup('service:store');
    notifications = this.owner.lookup('service:pixToast');
    sinon.stub(notifications, 'sendSuccessNotification');
  });

  module('#addOrganization', function (hooks) {
    let event;

    hooks.beforeEach(function () {
      event = {
        preventDefault: sinon.stub(),
      };
    });

    module('when creating child organization with parentOrganizationId', function () {
      test('it should call reload children model', async function (assert) {
        // given
        const reloadStub = sinon.stub();

        const organizationModelStub = {
          parentOrganizationId: '123',
          name: 'New Child Orga',
          type: 'SCO',
          administrationTeamId: '456',
          save: sinon.stub(),
        };
        controller.model = organizationModelStub;

        const parentOrganizationModelStub = {
          hasMany: sinon.stub(),
        };
        parentOrganizationModelStub.hasMany.withArgs('children').returns({ reload: reloadStub });

        const findParentOrganizationModelStub = sinon
          .stub(store, 'findRecord')
          .withArgs('organization', organizationModelStub.parentOrganizationId);

        findParentOrganizationModelStub.returns(parentOrganizationModelStub);

        // when
        await controller.addOrganization(event);

        // then
        assert.true(findParentOrganizationModelStub.calledOnce);
        assert.true(reloadStub.calledOnce);
      });
    });

    module('when creating organization with no parentOrganizationId', function (hooks) {
      let organizationModelStub;
      hooks.beforeEach(function () {
        organizationModelStub = {
          parentOrganizationId: null,
          name: 'New Orga',
          type: 'SCO',
          administrationTeamId: '456',
          save: sinon.stub(),
        };
        controller.model = organizationModelStub;
      });

      test('it should not call find parent organization model', async function (assert) {
        // given
        const findParentOrganizationModelStub = sinon.stub(store, 'findRecord');

        // when
        await controller.addOrganization(event);

        // then
        assert.true(findParentOrganizationModelStub.notCalled);
      });
    });
  });
});
