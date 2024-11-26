import { setupTest } from 'ember-qunit';
import ENV from 'mon-pix/config/environment';
import { module, test } from 'qunit';

import createGlimmerComponent from '../../../../../helpers/create-glimmer-component';

module('Unit | Component | Routes | Campaigns | Assessment | EvaluationResults', function (hooks) {
  setupTest(hooks);

  module('#isSharableCampaign', function () {
    module('when campaign is not an autonomous course and not for absolute novice', function () {
      test('should return true', async function (assert) {
        // given
        ENV.APP.AUTONOMOUS_COURSES_ORGANIZATION_ID = 9999;

        const component = createGlimmerComponent('routes/campaigns/assessment/evaluation-results');

        component.args.model = {
          campaign: {
            organizationId: 1,
            isForAbsoluteNovice: false,
          },
        };

        // then
        assert.true(component.isSharableCampaign);
      });
    });

    module('when campaign is an autonomous course', function () {
      test('should return false', async function (assert) {
        // given
        ENV.APP.AUTONOMOUS_COURSES_ORGANIZATION_ID = 1;

        const component = createGlimmerComponent('routes/campaigns/assessment/evaluation-results');

        component.args.model = {
          campaign: {
            organizationId: 1,
            isForAbsoluteNovice: false,
          },
        };

        // then
        assert.false(component.isSharableCampaign);
      });
    });

    module('when campaign is for absolute novice', function () {
      test('should return false', async function (assert) {
        // given
        ENV.APP.AUTONOMOUS_COURSES_ORGANIZATION_ID = 9999;

        const component = createGlimmerComponent('routes/campaigns/assessment/evaluation-results');

        component.args.model = {
          campaign: {
            organizationId: 1,
            isForAbsoluteNovice: true,
          },
        };

        // then
        assert.false(component.isSharableCampaign);
      });
    });
  });
});
