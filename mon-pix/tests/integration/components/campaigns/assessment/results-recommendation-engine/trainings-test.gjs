import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import Trainings from 'mon-pix/components/campaigns/assessment/results-recommendation-engine/trainings';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../../helpers/setup-intl-rendering';

module('Integration | Components | Campaigns | Assessment | ResultsRecommendationEngine | Trainings', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display the trainings list', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const trainings = [
      store.createRecord('training', {
        title: 'Mon super training',
        link: 'https://exemple.net/',
        duration: { days: 2 },
      }),
      store.createRecord('training', {
        title: 'Mon autre super training',
        link: 'https://exemple.net/',
        duration: { days: 2 },
      }),
    ];

    // when
    const screen = await render(<template><Trainings @trainings={{trainings}} /></template>);

    // then
    assert
      .dom(screen.getByRole('heading', { name: t('pages.skill-review.recommended-engine.trainings.title') }))
      .isVisible();
    assert.dom(screen.getByText(t('pages.skill-review.recommended-engine.trainings.description'))).isVisible();
  });
});
