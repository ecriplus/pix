import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import createGlimmerComponent from '../../../../../../helpers/create-glimmer-component';

module(
  'Unit | Component | Campaigns | Assessment | Results | EvaluationResultsTabs | ResultsDetails | CompetenceRow',
  function (hooks) {
    setupTest(hooks);

    module('#showRewardsTab', function () {
      module('when there is no badge', function () {
        test('should return false', async function (assert) {
          // given
          const component = createGlimmerComponent('campaigns/assessment/results/evaluation-results-tabs/index');

          component.args.campaignParticipationResult = {
            campaignParticipationBadges: [],
          };

          // then
          assert.false(component.showRewardsTab);
        });
      });

      module('when there is badges', function () {
        module('when there is only not-acquired and no always visible badge', function () {
          test('should return false', async function (assert) {
            // given
            const store = this.owner.lookup('service:store');
            const notAlwaysVisibledBadge = store.createRecord('campaign-participation-badge', {
              isAcquired: false,
              isAlwaysVisible: false,
            });

            const component = createGlimmerComponent('campaigns/assessment/results/evaluation-results-tabs/index');

            component.args.campaignParticipationResult = {
              campaignParticipationBadges: [notAlwaysVisibledBadge],
            };

            // then
            assert.false(component.showRewardsTab);
          });
        });

        module('when there is at least a not-acquired but always visible badge', function () {
          test('should return true', async function (assert) {
            // given
            const store = this.owner.lookup('service:store');
            const alwaysVisibledBadge = store.createRecord('campaign-participation-badge', {
              isAcquired: false,
              isAlwaysVisible: true,
            });

            const component = createGlimmerComponent('campaigns/assessment/results/evaluation-results-tabs/index');

            component.args.campaignParticipationResult = {
              campaignParticipationBadges: [alwaysVisibledBadge],
            };

            // then
            assert.true(component.showRewardsTab);
          });
        });

        module('when there is at least one acquired badge', function () {
          test('should return true', async function (assert) {
            // given
            const store = this.owner.lookup('service:store');
            const acquiredBadge = store.createRecord('campaign-participation-badge', {
              isAcquired: true,
            });

            const component = createGlimmerComponent('campaigns/assessment/results/evaluation-results-tabs/index');

            component.args.campaignParticipationResult = {
              campaignParticipationBadges: [acquiredBadge],
            };

            // then
            assert.true(component.showRewardsTab);
          });
        });
      });
    });
  },
);
