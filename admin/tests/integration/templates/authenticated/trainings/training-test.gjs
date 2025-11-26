/* eslint-disable ember/template-no-let-reference */
import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click, fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import Training from 'pix-admin/templates/authenticated/trainings/training';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Trainings | Training', function (hooks) {
  let model, store;

  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.lookup('service:router');
    store = this.owner.lookup('service:store');
    model = store.createRecord('training', {
      id: 12,
      title: 'title',
      internalTitle: 'internalTitle',
      link: 'my-training-link',
      type: 'type',
      locale: 'fr-fr',
      editorName: 'Albert',
      editorLogoUrl: 'https://assets.pix.org/contenu-formatif/editeur/my-logo-url',
      isRecommendable: true,
      isDisabled: false,
    });

    class AccessControlStub extends Service {
      hasAccessToTrainingsActionsScope = true;
    }
    this.owner.register('service:access-control', AccessControlStub);
  });

  test('should display training information', async function (assert) {
    // when
    const screen = await render(<template><Training @model={{model}} /></template>);

    // then
    assert.ok(screen.getByText('title'));
    assert.ok(screen.getByText('internalTitle'));
    assert.ok(screen.getByText('internalTitle'));
    assert.ok(screen.getByRole('link', { name: 'my-training-link (nouvelle fenêtre)' }));
    assert.ok(screen.getByText('type'));
    assert.ok(screen.getByText('Franco-français (fr-fr)'));
    assert.ok(screen.getByText('Albert'));
  });

  test('should not display deletion button when prerequisite is not defined', async function (assert) {
    // when
    store.createRecord('training-trigger', {
      type: 'goal',
      threshold: '80',
      areas: [],
    });

    const screen = await render(<template><Training @model={{model}} /></template>);

    // then
    assert.notOk(
      screen.queryByRole('button', { name: t('pages.trainings.training.delete.button.prerequisite-label') }),
    );
  });

  test('should not display deletion button when goal is not defined', async function (assert) {
    // when
    store.createRecord('training-trigger', {
      type: 'prerequisite',
      threshold: '80',
      areas: [],
    });

    const screen = await render(<template><Training @model={{model}} /></template>);

    // then
    assert.notOk(screen.queryByRole('button', { name: t('pages.trainings.training.delete.button.goal-label') }));
  });

  module('when trigger is defined', function (hooks) {
    hooks.beforeEach(function () {
      store.createRecord('training-trigger', {
        id: 6,
        type: 'goal',
        threshold: '80',
        areas: [],
        training: model,
      });
      store.createRecord('training-trigger', {
        id: 7,
        type: 'prerequisite',
        threshold: '80',
        areas: [],
        training: model,
      });
    });

    test('should display deletion button when trigger is defined', async function (assert) {
      // when
      const screen = await render(<template><Training @model={{model}} /></template>);

      // then
      assert.ok(screen.getByRole('button', { name: t('pages.trainings.training.delete.button.goal-label') }));
      assert.ok(screen.getByRole('button', { name: t('pages.trainings.training.delete.button.prerequisite-label') }));
    });

    test('should call adapter with correct parameter', async function (assert) {
      // given
      const reloadStub = sinon.stub(model, 'reload');
      const adapter = store.adapterFor('training-trigger');
      const deleteTriggerAdapterStub = sinon.stub(adapter, 'delete');
      const notificationSuccessStub = sinon.stub();
      class NotificationsStub extends Service {
        sendSuccessNotification = notificationSuccessStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      deleteTriggerAdapterStub.withArgs({ trainingId: 12, triggerId: 6 }).resolves();

      // when
      const screen = await render(<template><Training @model={{model}} /></template>);
      await click(screen.getByRole('button', { name: t('pages.trainings.training.delete.button.goal-label') }));
      await screen.findByRole('dialog');
      await click(screen.getByRole('button', { name: t('common.actions.validate') }));

      // then
      assert.ok(deleteTriggerAdapterStub.calledOnce);
      assert.ok(reloadStub.calledOnce);
      assert.ok(notificationSuccessStub.calledOnce);
    });
  });

  module('error cases', function () {
    module('when editorLogoURl format is incorrect', function () {
      test('should display an error', async function (assert) {
        // given
        sinon.stub(model, 'save').rejects({ errors: [{ status: '400', detail: 'data.attributes.editor-logo-url' }] });

        const notificationErrorStub = sinon.stub();
        class NotificationsStub extends Service {
          sendErrorNotification = notificationErrorStub;
        }
        this.owner.register('service:pixToast', NotificationsStub);

        // when
        const screen = await render(<template><Training @model={{model}} /></template>);
        await click(screen.getByRole('button', { name: 'Modifier' }));
        await fillIn(
          screen.getByRole('textbox', {
            name: "Url du logo de l'éditeur (.svg) Exemple : https://assets.pix.org/contenu-formatif/editeur/pix-logo.svg",
          }),
          'bonjour!',
        );
        await click(screen.getByRole('button', { name: 'Modifier le contenu formatif' }));

        // then
        sinon.assert.calledWith(notificationErrorStub, {
          message: t('pages.trainings.training.error-messages.incorrect-editor-logo-url-format'),
        });
        assert.ok(true);
      });
    });

    module('for other errors', function () {
      test('should display a default error', async function (assert) {
        // given
        sinon.stub(model, 'save').rejects();

        const notificationErrorStub = sinon.stub();
        class NotificationsStub extends Service {
          sendErrorNotification = notificationErrorStub;
        }
        this.owner.register('service:pixToast', NotificationsStub);

        // when
        const screen = await render(<template><Training @model={{model}} /></template>);
        await click(screen.getByRole('button', { name: 'Modifier' }));
        await fillIn(
          screen.getByRole('textbox', {
            name: "Url du logo de l'éditeur (.svg) Exemple : https://assets.pix.org/contenu-formatif/editeur/pix-logo.svg",
          }),
          'bonjour!',
        );
        await click(screen.getByRole('button', { name: 'Modifier le contenu formatif' }));

        // then
        sinon.assert.calledWith(notificationErrorStub, {
          message: 'Une erreur est survenue.',
        });
        assert.ok(true);
      });
    });
  });
});
/* eslint-enable ember/template-no-let-reference */
