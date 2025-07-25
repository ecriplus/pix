import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | CampaignParticipationOverview | Card | Ended', function (hooks) {
  setupIntlRenderingTest(hooks);
  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });
  module('when card has "ENDED" status', function () {
    test('should render card info ', async function (assert) {
      // given
      const campaignParticipationOverview = store.createRecord('campaign-participation-overview', {
        isShared: true,
        createdAt: '2020-12-10T15:16:20.109Z',
        sharedAt: '2020-12-18T15:16:20.109Z',
        status: 'SHARED',
        campaignTitle: 'My campaign',
        organizationName: 'My organization',
      });
      this.set('campaignParticipationOverview', campaignParticipationOverview);

      // when
      const screen = await render(
        hbs`<CampaignParticipationOverview::Card::Ended @model={{this.campaignParticipationOverview}} />`,
      );

      // then
      assert.ok(screen.getByRole('heading', { name: 'My organization' }));
      assert.ok(screen.getByText('My campaign'));
      assert.ok(screen.getByText(t('pages.campaign-participation-overview.card.tag.finished')));
      assert.ok(screen.getByText(t('pages.campaign-participation-overview.card.see-more')));
      assert.ok(screen.getByText(t('pages.campaign-participation-overview.card.finished-at', { date: '18/12/2020' })));
    });

    module('when the campaign has no stages', function () {
      test('should render the result with percentage', async function (assert) {
        // given
        const campaignParticipationOverview = store.createRecord('campaign-participation-overview', {
          isShared: true,
          createdAt: '2020-12-10T15:16:20.109Z',
          sharedAt: '2020-12-18T15:16:20.109Z',
          status: 'SHARED',
          campaignTitle: 'My campaign',
          masteryRate: '0.20',
          totalStagesCount: 0,
        });
        this.set('campaignParticipationOverview', campaignParticipationOverview);

        // when
        const screen = await render(
          hbs`<CampaignParticipationOverview::Card::Ended @model={{this.campaignParticipationOverview}} />`,
        );

        // then
        assert.ok(screen.getByText('20 % de réussite'));
      });
    });

    module('when the campaign has stages', function () {
      test('should render the result with percentage', async function (assert) {
        // given
        const campaignParticipationOverview = store.createRecord('campaign-participation-overview', {
          isShared: true,
          createdAt: '2020-12-10T15:16:20.109Z',
          sharedAt: '2020-12-18T15:16:20.109Z',
          status: 'SHARED',
          campaignTitle: 'My campaign',
          masteryRate: '0.70',
          validatedStagesCount: 5,
          totalStagesCount: 7,
        });
        this.set('campaignParticipationOverview', campaignParticipationOverview);

        // when
        const screen = await render(
          hbs`<CampaignParticipationOverview::Card::Ended @model={{this.campaignParticipationOverview}} />`,
        );

        // then
        assert.ok(screen.getByText('4 étoiles sur 6'));
      });
    });

    module('when canRetry is true', function () {
      test('should display retry button text', async function (assert) {
        // given
        const campaignParticipationOverview = store.createRecord('campaign-participation-overview', {
          isShared: true,
          createdAt: '2020-12-10T15:16:20.109Z',
          sharedAt: '2020-12-18T15:16:20.109Z',
          status: 'SHARED',
          campaignTitle: 'My campaign',
          organizationName: 'My organization',
          canRetry: true,
        });
        this.set('campaignParticipationOverview', campaignParticipationOverview);

        // when
        const screen = await render(
          hbs`<CampaignParticipationOverview::Card::Ended @model={{this.campaignParticipationOverview}} />`,
        );

        // then
        assert.ok(screen.getByText(t('pages.campaign-participation-overview.card.retry')));
      });
    });

    module('when canRetry is false', function () {
      test('should display see-more button text', async function (assert) {
        // given
        const campaignParticipationOverview = store.createRecord('campaign-participation-overview', {
          isShared: true,
          createdAt: '2020-12-10T15:16:20.109Z',
          sharedAt: '2020-12-18T15:16:20.109Z',
          status: 'SHARED',
          campaignTitle: 'My campaign',
          organizationName: 'My organization',
          canRetry: false,
        });
        this.set('campaignParticipationOverview', campaignParticipationOverview);

        // when
        const screen = await render(
          hbs`<CampaignParticipationOverview::Card::Ended @model={{this.campaignParticipationOverview}} />`,
        );

        // then
        assert.ok(screen.getByText(t('pages.campaign-participation-overview.card.see-more')));
      });
    });

    module('#onClick', function () {
      test('should push event on click', async function (assert) {
        // given
        const router = this.owner.lookup('service:router');
        router.transitionTo = sinon.stub();
        const metrics = this.owner.lookup('service:pix-metrics');
        metrics.trackEvent = sinon.stub();

        const campaignParticipationOverview = store.createRecord('campaign-participation-overview', {
          isShared: true,
          createdAt: '2020-12-10T15:16:20.109Z',
          sharedAt: '2020-12-18T15:16:20.109Z',
          status: 'SHARED',
          campaignTitle: 'My campaign',
          campaignCode: 'qwertyui',
          masteryRate: '0.70',
          validatedStagesCount: 5,
          totalStagesCount: 7,
        });
        this.set('campaignParticipationOverview', campaignParticipationOverview);

        // when
        const screen = await render(
          hbs`<CampaignParticipationOverview::Card::Ended @model={{this.campaignParticipationOverview}} />`,
        );

        await click(screen.getByRole('button', { name: 'Voir le détail' }));

        // then
        sinon.assert.calledWithExactly(metrics.trackEvent, `Voir le détail d'une participation partagée`, {
          category: 'Campaign participation',
          action: `Voir le détail d'une participation partagée`,
          disabled: true,
        });
        assert.ok(true);
      });
    });
  });
});
