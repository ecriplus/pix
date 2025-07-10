import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/campaigns/campaign/analysis', function (hooks) {
  setupTest(hooks);
  let route;
  let featureToggles;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/campaigns/campaign/analysis');
    featureToggles = this.owner.lookup('service:feature-toggles');
  });

  module('when feature toggle shouldDisplayNewAnalysisPage is true', function () {
    test('it sets isNewPage as true', async function (assert) {
      const campaign = {
        campaignAnalysis: {},
        belongsTo: () => ({ reload: () => {} }),
      };
      sinon.stub(route, 'modelFor').returns(campaign);
      featureToggles.featureToggles = {
        shouldDisplayNewAnalysisPage: true,
      };

      const result = await route.model();

      assert.true(result.isNewPage);
    });
  });

  module('when feature toggle shouldDisplayNewAnalysisPage is false', function () {
    test('it sets isNewPage as false', async function (assert) {
      const campaign = {
        campaignAnalysis: {},
        belongsTo: () => ({ reload: () => {} }),
      };
      sinon.stub(route, 'modelFor').returns(campaign);
      featureToggles.featureToggles = {
        shouldDisplayNewAnalysisPage: false,
      };

      const result = await route.model();

      assert.false(result.isNewPage);
    });
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

        modelForStub.withArgs('authenticated').returns({ hasReachMaximumPlacesWithThreshold: true });

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

        modelForStub.withArgs('authenticated').returns({ hasReachMaximumPlacesWithThreshold: false });

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
