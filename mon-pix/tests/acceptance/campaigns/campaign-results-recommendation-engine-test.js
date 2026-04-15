import { visit } from '@1024pix/ember-testing-library';
import { currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { authenticate } from '../../helpers/authentication';
import setupIntl from '../../helpers/setup-intl';

module('Acceptance | Campaigns | Results | Recommendation Engine', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  let user;
  let campaignParticipation;

  hooks.beforeEach(function () {
    user = server.create('user', 'withEmail');
  });

  module('when campaign has recommendationEngine enabled', function (hooks) {
    let campaign;

    hooks.beforeEach(async function () {
      campaign = server.create('campaign', { isArchived: false, organizationId: 123, recommendationEngine: true });
      campaignParticipation = server.create('campaign-participation', { campaign });

      await authenticate(user);

      const competenceResult = server.create('competence-result', {
        name: 'Competence Nom',
        masteryPercentage: 75,
      });
      server.create('campaign-participation-result', {
        id: campaignParticipation.id,
        competenceResults: [competenceResult],
        masteryRate: 0.75,
        masteryPercentage: 75,
      });
    });

    test('should access the results page at the expected URL', async function (assert) {
      // when
      await visit(`/campagnes/${campaign.code}/evaluation/resultats`);

      // then
      assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/resultats`);
    });

    test('should display the recommendation engine results page', async function (assert) {
      // when
      await visit(`/campagnes/${campaign.code}/evaluation/resultats`);

      // then
      assert.dom('.evaluation-results-recommendation-engine').exists();
    });

    test('should not display the standard results page', async function (assert) {
      // when
      await visit(`/campagnes/${campaign.code}/evaluation/resultats`);

      // then
      assert.dom('.evaluation-results:not(.evaluation-results-recommendation-engine)').doesNotExist();
    });
  });

  module('when campaign does not have recommendationEngine enabled', function (hooks) {
    let campaign;

    hooks.beforeEach(async function () {
      campaign = server.create('campaign', { isArchived: false, organizationId: 123, recommendationEngine: false });
      campaignParticipation = server.create('campaign-participation', { campaign });

      await authenticate(user);

      const competenceResult = server.create('competence-result', {
        name: 'Competence Nom',
        masteryPercentage: 75,
      });
      server.create('campaign-participation-result', {
        id: campaignParticipation.id,
        competenceResults: [competenceResult],
        masteryPercentage: 75,
      });
    });

    test('should access the results page at the expected URL', async function (assert) {
      // when
      await visit(`/campagnes/${campaign.code}/evaluation/resultats`);

      // then
      assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/resultats`);
    });

    test('should display the standard results page', async function (assert) {
      // when
      await visit(`/campagnes/${campaign.code}/evaluation/resultats`);

      // then
      assert.dom('.evaluation-results').exists();
    });

    test('should not display the recommendation engine results page', async function (assert) {
      // when
      await visit(`/campagnes/${campaign.code}/evaluation/resultats`);

      // then
      assert.dom('.evaluation-results-recommendation-engine').doesNotExist();
    });
  });
});
