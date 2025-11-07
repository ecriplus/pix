import { render, within } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import TrainingCard from 'mon-pix/components/training/card';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Training | Card', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  test('it should render the component', async function (assert) {
    // given
    const training = _buildTraining();
    const trainingRecord = store.createRecord('training', training);

    // when
    const screen = await render(<template><TrainingCard @training={{trainingRecord}} /></template>);

    // then
    const list = screen.getByRole('list');

    assert.dom(screen.getByRole('link', 'https://training.net/')).exists();
    assert.dom(screen.getByRole('heading', { name: 'Mon super training', level: 3 })).exists();
    assert.dom(screen.getByTitle('Webinaire - 6h')).exists();
    assert.dom(within(list).getByText('Webinaire')).exists();
    assert.dom(within(list).getByText('6h')).exists();
    assert.dom(screen.getByRole('presentation', { name: '' })).exists();
    assert
      .dom(
        screen.getByRole('img', {
          name: "Contenu formatif proposé par Ministère de l'éducation nationale et de la jeunesse. Liberté égalité fraternité",
        }),
      )
      .hasAttribute(
        'src',
        'https://images.pix.fr/contenu-formatif/editeur/logo-ministere-education-nationale-et-jeunesse.svg',
      );
  });

  module('given different trainings duration value', function () {
    [
      { duration: { days: 2 }, expectedResult: '2j' },
      { duration: { hours: 2 }, expectedResult: '2h' },
      { duration: { minutes: 2 }, expectedResult: '2min' },
      { duration: { hours: 10, minutes: 2 }, expectedResult: '10h 2min' },
      { duration: { days: 1, hours: 4 }, expectedResult: '1j 4h' },
      { duration: { days: 1, minutes: 30 }, expectedResult: '1j 30min' },
      { duration: { days: 1, hours: 4, minutes: 30 }, expectedResult: '1j 4h 30min' },
    ].forEach(({ duration, expectedResult }) => {
      test(`it should display ${expectedResult} as duration in card`, async function (assert) {
        // given
        const training = _buildTraining({ duration });
        const trainingRecord = store.createRecord('training', training);

        // when
        const screen = await render(<template><TrainingCard @training={{trainingRecord}} /></template>);

        // then
        const list = screen.getByRole('list');

        assert.dom(within(list).getByText(expectedResult)).exists();
      });
    });
  });

  module('given different training type', function () {
    [
      {
        type: 'webinaire',
        src: new RegExp(/https:\/\/images.pix.fr\/contenu-formatif\/type\/Webinaire-[1-3].svg/g),
        tagName: 'tertiary',
      },
      {
        type: 'autoformation',
        src: new RegExp(/https:\/\/images.pix.fr\/contenu-formatif\/type\/Autoformation-[1-3].svg/g),
        tagName: 'primary',
      },
      { type: 'e-learning', src: 'https://images.pix.fr/contenu-formatif/type/E-learning-1.svg', tagName: 'success' },
      { type: 'hybrid-training', src: 'https://images.pix.fr/contenu-formatif/type/Hybrid-1.svg', tagName: 'error' },
      {
        type: 'in-person-training',
        src: 'https://images.pix.fr/contenu-formatif/type/In-person-1.svg',
        tagName: 'secondary',
      },
      {
        type: 'modulix',
        src: new RegExp(/https:\/\/images.pix.fr\/contenu-formatif\/type\/Modulix-[1-3].svg/g),
        tagName: 'primary',
      },
    ].forEach(({ type, src, tagName }) => {
      test(`should return appropriate image src and tags name for training type ${type}`, async function (assert) {
        // given
        const training = _buildTraining({ type });
        const trainingRecord = store.createRecord('training', training);

        // when
        const screen = await render(<template><TrainingCard @training={{trainingRecord}} /></template>);

        // then
        assert
          .dom(
            screen.getByRole('presentation', {
              name: '',
            }),
          )
          .hasAttribute('src', src);
        assert.dom(`.pix-tag--${tagName}`).exists();
      });
    });
  });

  module('when clicking on training link', function () {
    test('should call metrics service with right arguments', async function (assert) {
      // given
      const training = _buildTraining();
      const trainingRecord = store.createRecord('training', training);

      const serviceRouter = this.owner.lookup('service:router');
      const currentRouteName = 'current.route.name';
      sinon.stub(serviceRouter, 'currentRouteName').value(currentRouteName);

      const metrics = this.owner.lookup('service:pix-metrics');
      metrics.trackEvent = sinon.stub();

      // when
      const screen = await render(<template><TrainingCard @training={{trainingRecord}} /></template>);

      await click(screen.getByRole('link', training.link));

      // then
      sinon.assert.calledWithExactly(metrics.trackEvent, `Ouvre le cf`, {
        category: 'Accès Contenu Formatif',
        action: `Clic depuis : ${currentRouteName}`,
        title: training.title,
      });
      assert.ok(true);
    });
  });

  function _buildTraining({ duration, type } = {}) {
    return {
      title: 'Mon super training',
      link: 'https://training.net/',
      type: type ?? 'webinaire',
      locale: 'fr-fr',
      duration: duration ?? { hours: 6 },
      editorName: "Ministère de l'éducation nationale et de la jeunesse. Liberté égalité fraternité",
      editorLogoUrl:
        'https://images.pix.fr/contenu-formatif/editeur/logo-ministere-education-nationale-et-jeunesse.svg',
    };
  }
});
