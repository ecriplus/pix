import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../../../helpers/setup-intl-rendering';

module('Integration | Components | Campaigns | Assessment | Evaluation Results Tabs | Trainings', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display the trainings list', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const training1 = store.createRecord('training', {
      title: 'Mon super training',
      link: 'https://exemple.net/',
      duration: { days: 2 },
    });
    const training2 = store.createRecord('training', {
      title: 'Mon autre super training',
      link: 'https://exemple.net/',
      duration: { days: 2 },
    });

    const campaignParticipationResult = {
      isDisabled: false,
    };

    this.set('campaignParticipationResult', campaignParticipationResult);
    this.set('trainings', [training1, training2]);

    // when
    const screen = await render(
      hbs`<Campaigns::Assessment::Results::EvaluationResultsTabs::Trainings
  @trainings={{this.trainings}}
  @campaignParticipationResult={{this.campaignParticipationResult}}
/>`,
    );

    // then
    assert.dom(screen.getByRole('heading', { name: t('pages.skill-review.tabs.trainings.title') })).isVisible();
    assert.dom(screen.getByText(t('pages.skill-review.tabs.trainings.description'))).isVisible();

    assert.strictEqual(screen.getAllByRole('link').length, 2);
    assert.dom(screen.getByText('Mon super training')).isVisible();
    assert.dom(screen.getByText('Mon autre super training')).isVisible();
  });
});
