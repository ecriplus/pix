import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import TrainingDetailsCard from 'pix-admin/components/trainings/training-details-card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Trainings::TrainingDetailsCard', function (hooks) {
  setupIntlRenderingTest(hooks);

  const training = {
    title: 'Un contenu formatif',
    internalTitle: 'Mon titre interne',
    link: 'https://un-contenu-formatif',
    type: 'webinaire',
    locale: 'fr-fr',
    editorName: 'Un éditeur de contenu formatif',
    editorLogoUrl: 'un-logo.svg',
    duration: {
      days: 2,
    },
    isRecommendable: true,
  };

  test('it should display the details', async function (assert) {
    // when
    const screen = await render(<template><TrainingDetailsCard @training={{training}} /></template>);

    // then
    assert.dom(screen.getByRole('heading', { level: 1, name: training.internalTitle })).exists();
    assert.dom(screen.getByText(training.title)).exists();
    assert.dom(screen.getByText('https://un-contenu-formatif')).exists();
    assert.dom(screen.getByText('webinaire')).exists();
    assert.dom(screen.getByText('2j')).exists();
    assert.dom(screen.getByText('Franco-français (fr-fr)')).exists();
    assert.dom(screen.getByText('Un éditeur de contenu formatif')).exists();
    assert.dom(screen.getByText('un-logo.svg')).exists();
    assert.dom(screen.getByAltText('Un éditeur de contenu formatif')).exists();
  });

  test('it should display "Déclenchable" when training is recommendable', async function (assert) {
    // given
    training.isRecommendable = true;
    const screen = await render(<template><TrainingDetailsCard @training={{training}} /></template>);

    // then
    assert.dom(screen.getByText(t('pages.trainings.training.details.status-label.enabled'))).exists();
  });

  test('it should display "Non déclenchable" when training is not recommendable', async function (assert) {
    // given
    training.isRecommendable = false;
    const screen = await render(<template><TrainingDetailsCard @training={{training}} /></template>);

    // then
    assert.dom(screen.getByText(t('pages.trainings.training.details.status-label.disabled'))).exists();
  });

  test('it should display "Actif" when training is not disabled', async function (assert) {
    // given
    training.isDisabled = false;
    const screen = await render(<template><TrainingDetailsCard @training={{training}} /></template>);

    // then
    assert.dom(screen.getByText('Actif')).exists();
  });

  test('it should display "En pause" when training is disabled', async function (assert) {
    // given
    training.isDisabled = true;
    const screen = await render(<template><TrainingDetailsCard @training={{training}} /></template>);

    // then
    assert.dom(screen.getByText('En pause')).exists();
  });

  module('Duration formatting', function () {
    [
      { duration: { days: 2 }, expectedResult: '2j' },
      { duration: { hours: 2 }, expectedResult: '2h' },
      { duration: { minutes: 2 }, expectedResult: '2min' },
      { duration: { hours: 10, minutes: 2 }, expectedResult: '10h 2min' },
      { duration: { days: 1, hours: 4 }, expectedResult: '1j 4h' },
      { duration: { days: 1, minutes: 30 }, expectedResult: '1j 30min' },
      { duration: { days: 1, hours: 4, minutes: 30 }, expectedResult: '1j 4h 30min' },
    ].forEach(function ({ duration, expectedResult }) {
      test(`should display "${expectedResult}" for duration ${JSON.stringify(duration)}`, async function (assert) {
        // given
        const trainingWithDuration = {
          title: 'Un contenu formatif',
          internalTitle: 'Mon titre interne',
          link: 'https://un-contenu-formatif',
          type: 'webinaire',
          locale: 'fr-fr',
          editorName: 'Un éditeur de contenu formatif',
          editorLogoUrl: 'un-logo.svg',
          duration,
          isRecommendable: true,
        };

        // when
        const screen = await render(<template><TrainingDetailsCard @training={{trainingWithDuration}} /></template>);

        // then
        assert.dom(screen.getByText(expectedResult)).exists();
      });
    });
  });
});
