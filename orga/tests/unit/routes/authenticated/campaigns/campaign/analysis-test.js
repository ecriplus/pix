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
});
