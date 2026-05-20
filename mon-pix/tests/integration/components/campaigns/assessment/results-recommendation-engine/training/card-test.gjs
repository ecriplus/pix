import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import TrainingCard from 'mon-pix/components/campaigns/assessment/results-recommendation-engine/training/card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../../../helpers/setup-intl-rendering';

module(
  'Integration | Components | Campaigns | Assessment | ResultsRecommendationEngine | Training | Card',
  function (hooks) {
    setupIntlRenderingTest(hooks);

    test('it renders with correct fields', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const training = store.createRecord('training', _buildTraining({}));

      // when
      const screen = await render(<template><TrainingCard @training={{training}} /></template>);

      // then
      assert.dom(screen.getByRole('link', training.link)).exists();
      assert.dom(screen.getByRole('heading', { name: training.title, level: 3 })).exists();
      assert.dom(screen.getByText('Webinaire')).exists();
      assert.dom(screen.getByText('2h')).exists();
    });

    module('when delivery mode is hybrid', function () {
      test('it displays a corresponding information', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const training = store.createRecord('training', _buildTraining({ deliveryMode: 'hybrid' }));

        // when
        const screen = await render(<template><TrainingCard @training={{training}} /></template>);

        // then
        assert
          .dom(screen.getByText(t('pages.skill-review.recommended-engine.training-card.delivery-mode.hybrid')))
          .exists();
      });
    });

    module('when delivery mode is on-site', function () {
      test('it displays a corresponding information', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const training = store.createRecord('training', _buildTraining({ deliveryMode: 'on-site' }));

        // when
        const screen = await render(<template><TrainingCard @training={{training}} /></template>);

        // then
        assert
          .dom(screen.getByText(t('pages.skill-review.recommended-engine.training-card.delivery-mode.on-site')))
          .exists();
      });
    });

    module('when delivery mode is remote', function () {
      test('it displays a corresponding information', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const training = store.createRecord('training', _buildTraining({ deliveryMode: 'remote' }));

        // when
        const screen = await render(<template><TrainingCard @training={{training}} /></template>);

        // then
        assert
          .dom(screen.getByText(t('pages.skill-review.recommended-engine.training-card.delivery-mode.remote')))
          .exists();
      });
    });

    module('when registration is required', function () {
      test('it displays a corresponding tag', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const training = store.createRecord('training', _buildTraining({ registrationRequired: true }));

        // when
        const screen = await render(<template><TrainingCard @training={{training}} /></template>);

        // then
        assert
          .dom(screen.getByText(t('pages.skill-review.recommended-engine.training-card.registration-required.yes')))
          .exists();
      });
    });

    module('when registration is not required', function () {
      test('it displays a corresponding tag', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const training = store.createRecord('training', _buildTraining({ registrationRequired: false }));

        // when
        const screen = await render(<template><TrainingCard @training={{training}} /></template>);

        // then
        assert
          .dom(screen.getByText(t('pages.skill-review.recommended-engine.training-card.registration-required.no')))
          .exists();
      });
    });

    module('when training type is e-learning, hybrid or in-person', function () {
      test('it displays "formation" information only', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const training = store.createRecord('training', _buildTraining({ type: 'e-learning' }));

        // when
        const screen = await render(<template><TrainingCard @training={{training}} /></template>);

        // then
        assert.dom(screen.getByText(t('pages.training.type.formation'))).exists();
      });
    });

    module('when training type is webinaire, modulix or autoformation', function () {
      test('it displays the type information', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const training = store.createRecord('training', _buildTraining({ type: 'modulix' }));

        // when
        const screen = await render(<template><TrainingCard @training={{training}} /></template>);

        // then
        assert.dom(screen.getByText(t('pages.training.type.modulix'))).exists();
      });
    });

    function _buildTraining({ deliveryMode = 'remote', registrationRequired = true, type = 'webinaire' }) {
      return {
        title: 'Apprendre à manger un croissant comme les français',
        link: 'https://example.net/',
        duration: { hours: 2 },
        editorLogoUrl:
          'https://assets.pix.org/contenu-formatif/editeur/logo-ministere-education-nationale-et-jeunesse.svg',
        editorName: "Ministère de l'éducation nationale et de la jeunesse. Liberté égalité fraternité",
        locale: 'fr-fr',
        type,
        deliveryMode,
        objectives: ['Repérer si le croissant est de bonne qualité', 'Rechercher un croissant pour le manger'],
        program: 'Heure 1 : Théorie & culture du croissant, Heure 2 : Pratique et technique de dégustation',
        registrationRequired,
      };
    }
  },
);
