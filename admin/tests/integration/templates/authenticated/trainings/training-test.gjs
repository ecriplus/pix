/* eslint-disable ember/template-no-let-reference */
import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import Training from 'pix-admin/templates/authenticated/trainings/training';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Trainings | Training', function (hooks) {
  let model, router, store;
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    router = this.owner.lookup('service:router');
    store = this.owner.lookup('service:store');
    model = store.createRecord('training', {
      id: 12,
      title: 'title',
      internalTitle: 'internalTitle',
      link: 'my-training-link',
      type: 'type',
      locale: 'fr-fr',
      editorName: 'Albert',
      editorLogoUrl: 'my-logo-url',
      isRecommendable: true,
      isDisabled: false,
    });

    class AccessControlStub extends Service {
      hasAccessToTrainingsActionsScope = true;
    }
    this.owner.register('service:access-control', AccessControlStub);
  });

  test('should display training informations', async function (assert) {
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

  test('should display deletion button when trigger is defined', async function (assert) {
    // when
    store.createRecord('training-trigger', {
      type: 'goal',
      threshold: '80',
      areas: [],
      training: model,
    });
    store.createRecord('training-trigger', {
      type: 'prerequisite',
      threshold: '80',
      areas: [],
      training: model,
    });

    const screen = await render(<template><Training @model={{model}} /></template>);

    // then
    assert.ok(screen.getByRole('button', { name: t('pages.trainings.training.delete.button.goal-label') }));
    assert.ok(screen.getByRole('button', { name: t('pages.trainings.training.delete.button.prerequisite-label') }));
  });
});
