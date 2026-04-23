import { render } from '@1024pix/ember-testing-library';
import AcquiredBadgesCompact from 'mon-pix/components/campaigns/assessment/results-recommendation-engine/evaluation-results-hero-recommendation-engine/acquired-badges-compact';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../../../helpers/setup-intl-rendering';

module(
  'Integration | Components | Campaigns | Assessment | ResultsRecommendationEngine | EvaluationResultsHeroRecommendationEngine | AcquiredBadgesCompact',
  function (hooks) {
    setupIntlRenderingTest(hooks);

    module('when there are 2 badges or fewer', function () {
      test('it displays all badge icons', async function (assert) {
        // given
        const badges = [
          { altMessage: 'Badge 1', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 1' },
          { altMessage: 'Badge 2', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 2' },
        ];

        // when
        const screen = await render(<template><AcquiredBadgesCompact @acquiredBadges={{badges}} /></template>);

        // then
        assert.dom(screen.getByRole('img', { name: 'Badge 1' })).exists();
        assert.dom(screen.getByRole('img', { name: 'Badge 2' })).exists();
        assert.strictEqual(screen.getAllByRole('listitem').length, 2);
      });

      test('it does not display an overflow counter', async function (assert) {
        // given
        const badges = [
          { altMessage: 'Badge 1', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 1' },
          { altMessage: 'Badge 2', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 2' },
        ];

        // when
        const screen = await render(<template><AcquiredBadgesCompact @acquiredBadges={{badges}} /></template>);

        // then
        assert.dom(screen.queryByText('+0')).doesNotExist();
        assert.strictEqual(screen.getAllByRole('listitem').length, 2);
      });
    });

    module('when there are more than 2 badges', function () {
      test('it displays only the first 2 badge icons', async function (assert) {
        // given
        const badges = [
          { altMessage: 'Badge 1', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 1' },
          { altMessage: 'Badge 2', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 2' },
          { altMessage: 'Badge 3', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 3' },
          { altMessage: 'Badge 4', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 4' },
        ];

        // when
        const screen = await render(<template><AcquiredBadgesCompact @acquiredBadges={{badges}} /></template>);

        // then
        assert.dom(screen.getByRole('img', { name: 'Badge 1' })).exists();
        assert.dom(screen.getByRole('img', { name: 'Badge 2' })).exists();
        assert.dom(screen.queryByRole('img', { name: 'Badge 3' })).doesNotExist();
        assert.dom(screen.queryByRole('img', { name: 'Badge 4' })).doesNotExist();
      });

      test('it displays an overflow counter with the remaining count', async function (assert) {
        // given
        const badges = [
          { altMessage: 'Badge 1', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 1' },
          { altMessage: 'Badge 2', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 2' },
          { altMessage: 'Badge 3', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 3' },
          { altMessage: 'Badge 4', imageUrl: '/images/background/hexa-pix.svg', title: 'Badge 4' },
        ];

        // when
        const screen = await render(<template><AcquiredBadgesCompact @acquiredBadges={{badges}} /></template>);

        // then
        assert.dom(screen.getByText('+2')).exists();
      });
    });
  },
);
