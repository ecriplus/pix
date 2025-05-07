import { visit } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import authenticateSession from '../helpers/authenticate-session';
import setupIntl from '../helpers/setup-intl';
import {
  createPrescriberByUser,
  createPrescriberForOrganization,
  createUserWithMembershipAndTermsOfServiceAccepted,
} from '../helpers/test-init';

module('Acceptance | Campaign Analysis', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    const user = createUserWithMembershipAndTermsOfServiceAccepted();
    createPrescriberByUser({ user });

    const campaignAnalysis = server.create('campaign-analysis', 'withTubeRecommendations');
    const campaignCollectiveResult = server.create('campaign-collective-result');
    server.create('campaign', {
      campaignAnalysis,
      campaignCollectiveResult,
      sharedParticipationsCount: 2,
      participationsCount: 2,
    });

    await authenticateSession(user.id);
  });

  test('it should display old campaign analysis page when toggle is false', async function (assert) {
    //given
    class FeatureTogglesStub extends Service {
      featureToggles = { shouldDisplayNewAnalysisPage: false };

      load() {}
    }
    this.owner.register('service:featureToggles', FeatureTogglesStub);

    // when
    const screen = await visit('/campagnes/1/analyse');

    // then
    assert.ok(screen.getByRole('table', { name: t('pages.campaign-review.table.analysis.caption') }));
    assert.ok(screen.getByText(t('pages.campaign-review.table.analysis.column.subjects', { count: 2 })));
  });

  test('it should display new campaign analysis page when toggle is true', async function (assert) {
    //given
    class FeatureTogglesStub extends Service {
      featureToggles = { shouldDisplayNewAnalysisPage: true };

      load() {}
    }
    this.owner.register('service:featureToggles', FeatureTogglesStub);

    // when
    const screen = await visit('/campagnes/1/analyse');

    // then
    assert.ok(
      screen.getByRole('heading', {
        level: 2,
        name: t('components.analysis-per-tubes-and-competences.detailed-positioning'),
      }),
    );
  });

  module('when organization uses "GAR" as identity provider for campaigns', function () {
    module('when there is no activity', function () {
      test('displays an empty state message without copy button', async function (assert) {
        // given
        const userAttributes = {
          id: 777,
          firstName: 'Luc',
          lastName: 'Harne',
          email: 'luc@har.ne',
          lang: 'fr',
        };
        const organizationAttributes = {
          id: 777,
          name: 'Cali Ber',
          externalId: 'EXT_CALIBER',
          identityProviderForCampaigns: 'GAR',
        };
        const organizationRole = 'ADMIN';
        const user = createPrescriberForOrganization(userAttributes, organizationAttributes, organizationRole);

        const campaignAnalysis = server.create('campaign-analysis', 'withTubeRecommendations');
        const campaignCollectiveResult = server.create('campaign-collective-result');
        server.create('campaign', 'ofTypeAssessment', {
          id: 7654,
          participationsCount: 0,
          ownerId: user.id,
          campaignAnalysis,
          campaignCollectiveResult,
        });

        await authenticateSession(user.id);

        // when
        const screen = await visit('/campagnes/7654/analyse');
        // then
        assert.dom(screen.getByText(t('pages.campaign.empty-state'))).exists();
        assert.dom(screen.queryByRole('button', { name: t('pages.campaign.copy.link.default') })).doesNotExist();
      });
    });
  });
});
