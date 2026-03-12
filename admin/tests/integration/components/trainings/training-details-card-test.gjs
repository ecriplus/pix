import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import TrainingDetailsCard from 'pix-admin/components/trainings/training-details-card';
import { module, test } from 'qunit';
import sinon from 'sinon';

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
    editorLogoUrl: 'http://localhost:4202/logo-placeholder.png',
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
    assert.dom(screen.getByText('http://localhost:4202/logo-placeholder.png')).exists();
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
          editorLogoUrl: 'http://localhost:4202/logo-placeholder.png',
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

  module('when multipleLocalesForTrainingsEnabled feature toggle is enabled', function (hooks) {
    hooks.beforeEach(function () {
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ multipleLocalesForTrainingsEnabled: true });
    });

    test('it should not display locale information', async function (assert) {
      // given
      const trainingWithOneLocale = { ...training, locales: ['fr', 'en'] };

      // when
      const screen = await render(<template><TrainingDetailsCard @training={{trainingWithOneLocale}} /></template>);

      // then
      assert.dom(screen.queryByText('Langue localisée')).doesNotExist();
      assert.dom(screen.queryByText('Franco-français (fr-fr)')).doesNotExist();
    });

    module('when there is one value in locales', function () {
      test('it should display locales with a singular label', async function (assert) {
        // given
        const trainingWithOneLocale = { ...training, locales: ['fr'] };

        // when
        const screen = await render(<template><TrainingDetailsCard @training={{trainingWithOneLocale}} /></template>);

        // then
        assert.dom(screen.getByText(t('pages.trainings.training.details.locales', { count: 1 }))).exists();
        assert.dom(screen.getByText('Francophone (fr)')).exists();
      });
    });

    module('when there are multiple value in locales', function () {
      test('it should display locales with a plural label', async function (assert) {
        // given
        const trainingWithMultipleLocales = { ...training, locales: ['fr', 'en'] };

        // when
        const screen = await render(
          <template><TrainingDetailsCard @training={{trainingWithMultipleLocales}} /></template>,
        );

        // then
        assert.dom(screen.getByText(t('pages.trainings.training.details.locales', { count: 2 }))).exists();
        assert.dom(screen.getByText('Francophone (fr), Anglophone (en)')).exists();
      });
    });
  });

  module('when multipleLocalesForTrainingsEnabled feature toggle is disabled', function () {
    test('it should not display locales and continue to display locale label', async function (assert) {
      // given
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ multipleLocalesForTrainingsEnabled: false });
      const trainingWithLocales = { ...training, locales: ['fr', 'en'] };

      // when
      const screen = await render(<template><TrainingDetailsCard @training={{trainingWithLocales}} /></template>);

      // then
      assert.dom(screen.queryByText(t('pages.trainings.training.details.locales', { count: 2 }))).doesNotExist();
      assert.dom(screen.getByText(t('pages.trainings.training.details.localizedLanguage'))).exists();
    });
  });

  module('when training type is modulix', function () {
    test('should display a link to a Pix App module', async function (assert) {
      // given
      const domainService = this.owner.lookup('service:current-domain');
      sinon.stub(domainService, 'getExtension').returns('fr');

      const training = {
        title: 'Un contenu formatif',
        internalTitle: 'Mon titre interne',
        link: '/modules/123/soleil',
        type: 'modulix',
        locale: 'fr-fr',
        editorName: 'Un éditeur de contenu formatif',
        editorLogoUrl: 'http://localhost:4202/logo-placeholder.png',
        duration: {
          days: 2,
        },
        isRecommendable: true,
      };

      // when
      const screen = await render(<template><TrainingDetailsCard @training={{training}} /></template>);

      // then
      assert
        .dom(screen.getByRole('link', { name: 'https://app.pix.fr/modules/123/soleil (nouvelle fenêtre)' }))
        .exists();
    });
  });
});
