import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/organization/get/campaigns', function (hooks) {
  setupTest(hooks);
  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/organizations/get/campaigns');
  });

  module('#model', function (hooks) {
    let organization;

    hooks.beforeEach(function () {
      organization = {
        id: '123',
        hasMany: sinon.stub(),
      };
      route.modelFor = sinon.stub().returns(organization);
      route.store = { query: sinon.stub() };
    });

    module('when campaigns are already in cache and there are no pagination params', function () {
      test('it should return cached campaigns without calling store.query', async function (assert) {
        // given
        const cachedCampaigns = [{ id: '1' }, { id: '2' }];
        organization.hasMany.withArgs('campaigns').returns({ value: sinon.stub().returns(cachedCampaigns) });
        const params = { pageNumber: undefined, pageSize: undefined };

        // when
        const result = await route.model(params);

        // then
        sinon.assert.notCalled(route.store.query);
        assert.strictEqual(result.campaigns, cachedCampaigns);
        assert.strictEqual(result.organizationId, '123');
      });
    });

    module('when campaigns are already in cache but pagination params are set', function () {
      test('it should call store.query with the given pagination params', async function (assert) {
        // given
        const cachedCampaigns = [{ id: '1' }];
        organization.hasMany.withArgs('campaigns').returns({ value: sinon.stub().returns(cachedCampaigns) });

        const params = { pageNumber: 2, pageSize: 10 };
        const campaignsFromApi = [{ id: 3 }];
        route.store.query.resolves(campaignsFromApi);

        // when
        const result = await route.model(params);

        // then
        sinon.assert.calledWith(route.store.query, 'campaign', {
          'page[number]': params.pageNumber,
          'page[size]': params.pageSize,
          organizationId: '123',
        });
        assert.strictEqual(result.campaigns, campaignsFromApi);
      });
    });

    module('when campaigns are not in cache', function () {
      test('it should call store.query with default pagination params', async function (assert) {
        // given
        organization.hasMany.withArgs('campaigns').returns({ value: sinon.stub().returns(null) });

        const params = { pageNumber: undefined, pageSize: undefined };
        const defaultPageNumber = 1;
        const defaultPageSize = 10;
        const campaignsFromApi = [{ id: 3 }];
        route.store.query.resolves(campaignsFromApi);

        // when
        const result = await route.model(params);

        // then
        sinon.assert.calledWith(route.store.query, 'campaign', {
          'page[number]': defaultPageNumber,
          'page[size]': defaultPageSize,
          organizationId: '123',
        });
        assert.strictEqual(result.campaigns, campaignsFromApi);
      });
    });
  });

  module('#resetController', function (hooks) {
    let controller;

    hooks.beforeEach(function () {
      controller = {
        pageNumber: 'somePageNumber',
        pageSize: 'somePageSize',
      };
    });

    module('when route is exiting', function () {
      test('it should reset controller', function (assert) {
        // when
        route.resetController(controller, true);

        // then
        assert.strictEqual(controller.pageNumber, 1);
        assert.strictEqual(controller.pageSize, 10);
      });
    });

    module('when route is not exiting', function () {
      test('it should not reset controller', function (assert) {
        // when
        route.resetController(controller, false);

        // then
        assert.strictEqual(controller.pageNumber, 'somePageNumber');
        assert.strictEqual(controller.pageSize, 'somePageSize');
      });
    });
  });
});
