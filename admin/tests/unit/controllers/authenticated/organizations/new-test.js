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
  let createRecordStub;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/organizations/new');
    controller.model = {};
    store = this.owner.lookup('service:store');
    notifications = this.owner.lookup('service:pixToast');
    sinon.stub(notifications, 'sendSuccessNotification');
    createRecordStub = sinon.stub(store, 'createRecord');
  });

  module('#addOrganization', function () {
    module('when creating child organization with parentOrganizationId', function () {
      test('it should call reload children model', async function (assert) {
        // given
        const reloadStub = sinon.stub();

        const formWithParentOrganizationId = {
          parentOrganizationId: '123',
          name: 'New Child Orga',
          type: 'SCO',
          administrationTeamId: '456',
          countryCode: '99100',
        };

        const organizationModelStub = {
          ...formWithParentOrganizationId,
          save: sinon.stub(),
          rollbackAttributes: sinon.stub(),
        };
        createRecordStub.withArgs('organization', formWithParentOrganizationId).returns(organizationModelStub);

        const parentOrganizationModelStub = {
          hasMany: sinon.stub(),
        };
        parentOrganizationModelStub.hasMany.withArgs('children').returns({ reload: reloadStub });

        const findParentOrganizationModelStub = sinon
          .stub(store, 'findRecord')
          .withArgs('organization', organizationModelStub.parentOrganizationId);

        findParentOrganizationModelStub.returns(parentOrganizationModelStub);

        // when
        await controller.addOrganization(formWithParentOrganizationId);

        // then
        assert.true(findParentOrganizationModelStub.calledOnce);
        assert.true(reloadStub.calledOnce);
      });
    });

    module('when creating organization with no parentOrganizationId', function () {
      test('it should not call find parent organization model', async function (assert) {
        // given
        const findParentOrganizationModelStub = sinon.stub(store, 'findRecord');

        const formWithoutParentOrganizationId = {
          parentOrganizationId: undefined,
          name: 'New Child Orga',
          type: 'SCO',
          administrationTeamId: '456',
          countryCode: '99100',
        };

        const organizationModelStub = {
          ...formWithoutParentOrganizationId,
          save: sinon.stub(),
          rollbackAttributes: sinon.stub(),
        };
        createRecordStub.withArgs('organization', formWithoutParentOrganizationId).returns(organizationModelStub);

        // when
        await controller.addOrganization(formWithoutParentOrganizationId);

        // then
        assert.true(findParentOrganizationModelStub.notCalled);
      });
    });

    module('Mandatory fields', function (hooks) {
      const mandatoryFields = { name: 'New Orga', type: 'SCO', administrationTeamId: '456', countryCode: '99100' };

      const form = {
        name: mandatoryFields.name,
        type: mandatoryFields.type,
        administrationTeamId: mandatoryFields.administrationTeamId,
        countryCode: mandatoryFields.countryCode,
      };

      Object.keys(mandatoryFields).forEach(function (mandatoryField) {
        hooks.afterEach(function () {
          form[mandatoryField] = mandatoryFields[mandatoryField];
        });
        test(`should not create model if ${mandatoryField} property is missing`, async function (assert) {
          // given
          form[mandatoryField] = undefined;

          // when
          await controller.addOrganization(form);

          // then
          assert.true(createRecordStub.notCalled);
        });
      });
    });
  });
});
