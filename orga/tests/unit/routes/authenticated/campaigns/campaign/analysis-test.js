import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/campaigns/campaign/analysis', function (hooks) {
  setupTest(hooks);
  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/campaigns/campaign/analysis');
  });

  module('beforeModel', function () {
    module('When places limit is reached', function (hooks) {
      hooks.afterEach(function () {
        sinon.restore();
      });

      test('should redirect on main campaign page', function (assert) {
        //given
        const campaignId = Symbol('CampaignId');

        const modelForStub = sinon.stub(route, 'modelFor');
        const replaceWithStub = sinon.stub(route.router, 'replaceWith');

        modelForStub.withArgs('authenticated').returns({ hasReachedMaximumPlacesLimit: true });

        //when
        route.beforeModel({
          to: {
            parent: {
              params: {
                campaign_id: campaignId,
              },
            },
          },
        });

        //then
        assert.ok(replaceWithStub.calledWithExactly('authenticated.campaigns.campaign', campaignId));
      });
    });

    module('When places limit is not reached', function (hooks) {
      hooks.afterEach(function () {
        sinon.restore();
      });

      test('should not redirect on main campaign page', function (assert) {
        //given
        const campaignId = Symbol('CampaignId');

        const modelForStub = sinon.stub(route, 'modelFor');
        const replaceWithStub = sinon.stub(route.router, 'replaceWith');

        modelForStub.withArgs('authenticated').returns({ hasReachedMaximumPlacesLimit: false });

        //when
        route.beforeModel({
          to: {
            parent: {
              params: {
                campaign_id: campaignId,
              },
            },
          },
        });

        //then
        assert.notOk(replaceWithStub.called);
      });
    });
  });
});
