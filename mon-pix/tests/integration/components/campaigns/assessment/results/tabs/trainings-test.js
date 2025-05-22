import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubCurrentUserService } from '../../../../../../helpers/service-stubs';
import setupIntlRenderingTest from '../../../../../../helpers/setup-intl-rendering';

module('Integration | Components | Campaigns | Assessment | Evaluation Results Tabs | Trainings', function (hooks) {
  setupIntlRenderingTest(hooks);

  module("when participation can't be shared", function () {
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
  @isSharableCampaign={{false}}
  @campaignParticipationResult={{this.campaignParticipationResult}}
/>`,
      );

      // then
      assert.dom(screen.getByRole('heading', { name: t('pages.skill-review.tabs.trainings.title') })).isVisible();
      assert.dom(screen.getByText(t('pages.skill-review.tabs.trainings.description'))).isVisible();

      assert.strictEqual(screen.getAllByRole('link').length, 2);
      assert.dom(screen.getByText('Mon super training')).isVisible();
      assert.dom(screen.getByText('Mon autre super training')).isVisible();

      assert.dom(screen.queryByRole('dialog')).doesNotExist();
    });
  });

  module('when campaign is archived', function () {
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
        isDisabled: true,
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

      assert.dom(screen.queryByRole('dialog')).doesNotExist();
    });
  });

  module('when participation can be shared', function () {
    module('when participation is already shared', function () {
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
  @isParticipationShared={{true}}
  @isSharableCampaign={{true}}
  @campaignParticipationResult={{this.campaignParticipationResult}}
/>`,
        );

        // then
        assert.dom(screen.getByRole('heading', { name: t('pages.skill-review.tabs.trainings.title') })).isVisible();
        assert.dom(screen.getByText(t('pages.skill-review.tabs.trainings.description'))).isVisible();

        assert.strictEqual(screen.getAllByRole('link').length, 2);
        assert.dom(screen.getByText('Mon super training')).isVisible();
        assert.dom(screen.getByText('Mon autre super training')).isVisible();

        assert.dom(screen.queryByRole('dialog')).doesNotExist();
      });
    });

    module('when participation is not already shared', function (hooks) {
      let screen;
      let onResultsSharedStub;

      hooks.beforeEach(async function () {
        // given
        this.set('isParticipationShared', false);
        this.set('campaignId', 1);
        this.set('campaignParticipationResultId', 1);
        onResultsSharedStub = sinon.stub();
        this.set('onResultsShared', onResultsSharedStub);

        const campaignParticipationResult = {
          isDisabled: false,
        };

        this.set('campaignParticipationResult', campaignParticipationResult);

        // when
        screen = await render(
          hbs`<Campaigns::Assessment::Results::EvaluationResultsTabs::Trainings
  @isSharableCampaign={{true}}
  @isParticipationShared={{this.isParticipationShared}}
  @campaignParticipationResultId={{this.campaignParticipationResultId}}
  @campaignId={{this.campaignId}}
  @onResultsShared={{this.onResultsShared}}
  @campaignParticipationResult={{this.campaignParticipationResult}}
/>`,
        );
      });

      test('it should display a dialog with share results button', async function (assert) {
        // then
        assert.dom(screen.getByRole('dialog')).isVisible();
        assert.dom(screen.getByText(/Envoyez vos résultats pour permettre/)).isVisible();
        assert.dom(screen.getByRole('button', { name: t('pages.skill-review.actions.send') })).isVisible();
      });

      test('it should have an inert trainings list', async function (assert) {
        // then
        const trainingsListTitle = screen.getByRole('heading', {
          name: t('pages.skill-review.tabs.trainings.title'),
        });
        assert.dom(trainingsListTitle).isVisible();
        assert.dom(trainingsListTitle.closest('[role="presentation"]')).hasAttribute('inert');
      });

      module('when clicking on the share results button', function (hooks) {
        let shareStub;
        hooks.beforeEach(function () {
          const store = this.owner.lookup('service:store');
          sinon.stub(store, 'adapterFor');
          shareStub = sinon.stub();
          store.adapterFor.returns({ share: shareStub });

          stubCurrentUserService(this.owner, { id: '1' });
        });

        test('it should call the onResultsShared function', async function (assert) {
          // given
          shareStub.resolves();

          // when
          await click(screen.queryByRole('button', { name: t('pages.skill-review.actions.send') }));

          // then
          assert.true(onResultsSharedStub.calledOnce);
        });

        module('when share action fails', function () {
          test('it should display an error message', async function (assert) {
            // given
            shareStub.rejects();

            // when
            await click(screen.queryByRole('button', { name: t('pages.skill-review.actions.send') }));

            // then
            assert.dom(screen.queryByRole('dialog')).exists();
            assert.dom(screen.getByText(t('pages.skill-review.tabs.trainings.modal.share-error'))).exists();
          });
        });
      });
    });
  });
});
