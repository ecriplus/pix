import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/organizations/list', function (hooks) {
  setupTest(hooks);
  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/organizations/list');
  });

  module('#model', function (hooks) {
    const params = {};
    const expectedQueryArgs = {};

    hooks.beforeEach(function () {
      route.store.query = sinon.stub().resolves();
      route.store.findAll = sinon.stub().resolves();
      params.pageNumber = 'somePageNumber';
      params.pageSize = 'somePageSize';
      expectedQueryArgs.page = {
        number: 'somePageNumber',
        size: 'somePageSize',
      };
    });

    module('when queryParams filters are falsy', function () {
      test('it should call store with no filters on id, name, type and externalId', async function (assert) {
        // when
        await route.model(params);
        expectedQueryArgs.filter = {
          id: '',
          name: '',
          type: '',
          externalId: '',
          hideArchived: undefined,
          administrationTeamId: '',
        };

        // then
        sinon.assert.calledWith(route.store.query, 'organization', expectedQueryArgs);
        sinon.assert.calledWith(route.store.findAll, 'administration-team');
        assert.ok(true);
      });
    });

    module('when queryParams filters are  truthy', function () {
      test('it should call store with filters containing trimmed values', async function (assert) {
        // given
        params.id = ' someId';
        params.name = ' someName';
        params.type = 'someType ';
        params.externalId = 'someExternalId';
        params.hideArchived = true;
        params.administrationTeamId = ' someAdministrationTeamId ';
        expectedQueryArgs.filter = {
          id: 'someId',
          name: 'someName',
          type: 'someType',
          externalId: 'someExternalId',
          hideArchived: true,
          administrationTeamId: 'someAdministrationTeamId',
        };

        // when
        await route.model(params);

        // then
        sinon.assert.calledWith(route.store.query, 'organization', expectedQueryArgs);
        sinon.assert.calledWith(route.store.findAll, 'administration-team');
        assert.ok(true);
      });
    });

    module('when an error occurs', function () {
      test('returns an empty array', async function (assert) {
        // given
        const params = {};

        route.store.query = sinon.stub().rejects();

        // when
        const model = await route.model(params);

        // then
        assert.deepEqual(model, { organizations: [], administrationTeams: [] });
      });
    });
  });

  module('#resetController', function (hooks) {
    let controller;

    hooks.beforeEach(function () {
      controller = {
        pageNumber: 'somePageNumber',
        pageSize: 'somePageSize',
        id: 'someId',
        name: 'someName',
        type: 'someType',
        externalId: 'someExternalId',
        hideArchived: false,
        administrationTeamId: 'someAdministrationTeamId',
      };
    });

    module('when route is exiting', function () {
      test('it should reset controller', function (assert) {
        // when
        route.resetController(controller, true);

        // then
        assert.strictEqual(controller.pageNumber, 1);
        assert.strictEqual(controller.pageSize, 10);
        assert.strictEqual(controller.id, null);
        assert.strictEqual(controller.name, null);
        assert.strictEqual(controller.type, null);
        assert.strictEqual(controller.externalId, null);
        assert.false(controller.hideArchived);
        assert.strictEqual(controller.administrationTeamId, null);
      });
    });

    module('when route is not exiting', function () {
      test('it should not reset controller', function (assert) {
        // when
        route.resetController(controller, false);

        // then
        assert.strictEqual(controller.pageNumber, 'somePageNumber');
        assert.strictEqual(controller.pageSize, 'somePageSize');
        assert.strictEqual(controller.id, 'someId');
        assert.strictEqual(controller.name, 'someName');
        assert.strictEqual(controller.type, 'someType');
        assert.strictEqual(controller.externalId, 'someExternalId');
        assert.false(controller.hideArchived);
        assert.strictEqual(controller.administrationTeamId, 'someAdministrationTeamId');
      });
    });
  });
});
