import { render } from '@1024pix/ember-testing-library';
import { fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import CombinedCourseBlueprintForm from 'pix-admin/components/combined-course-blueprints/form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | CombinedCourseBlueprints::form', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should render combined course form component', async function (assert) {
    // when
    const screen = await render(<template><CombinedCourseBlueprintForm /></template>);

    // then
    assert.ok(screen.getByRole('heading', { level: 1, name: t('components.combined-course-blueprints.create.title') }));
  });
  test('it should save blueprint in store and transition to combined course blueprint screen when data is valid', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const pixToast = this.owner.lookup('service:pixToast');
    const blueprintStub = { save: sinon.stub().resolves(), content: [] };
    const pixToastSuccessStub = sinon.stub(pixToast, 'sendSuccessNotification');

    sinon.stub(store, 'createRecord').withArgs('combined-course-blueprint').returns(blueprintStub);

    //when

    const screen = await render(<template><CombinedCourseBlueprintForm /></template>);

    await fillIn(
      screen.getByLabelText(t('components.combined-course-blueprints.create.labels.itemId'), { exact: false }),
      1,
    );
    await screen.getByRole('button', { name: t('components.combined-course-blueprints.create.addItemButton') }).click();
    await screen.getByLabelText(t('components.combined-course-blueprints.create.labels.module')).click();
    await fillIn(
      screen.getByLabelText(t('components.combined-course-blueprints.create.labels.itemId'), { exact: false }),
      'module-123',
    );
    await screen.getByRole('button', { name: t('components.combined-course-blueprints.create.addItemButton') }).click();
    await fillIn(
      screen.getByLabelText(t('components.combined-course-blueprints.create.labels.name'), { exact: false }),
      'name',
    );
    await fillIn(
      screen.getByLabelText(t('components.combined-course-blueprints.create.labels.internal-name'), { exact: false }),
      'internalName',
    );

    await fillIn(
      screen.getByLabelText(t('components.combined-course-blueprints.create.labels.illustration')),
      'illustrations/hello.svg',
    );

    await fillIn(
      screen.getByLabelText(t('components.combined-course-blueprints.create.labels.description')),
      'description',
    );

    await screen.getByRole('button', { name: t('components.combined-course-blueprints.create.createButton') }).click();

    //then
    assert.ok(blueprintStub.save.calledOnce);
    assert.strictEqual(blueprintStub.name, 'name');
    assert.strictEqual(blueprintStub.internalName, 'internalName');
    assert.deepEqual(blueprintStub.content, [
      { type: 'evaluation', value: 1 },
      { type: 'module', value: 'module-123' },
    ]);
    assert.strictEqual(blueprintStub.illustration, 'illustrations/hello.svg');
    assert.strictEqual(blueprintStub.description, 'description');
    assert.ok(
      pixToastSuccessStub.calledOnceWith({
        message: t('components.combined-course-blueprints.create.notifications.success'),
      }),
    );
  });

  module('error cases', function () {
    test('it should display a generic error message', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const pixToast = this.owner.lookup('service:pixToast');
      const blueprintStub = { save: sinon.stub().rejects(), content: [] };
      const pixToastSuccessStub = sinon.stub(pixToast, 'sendSuccessNotification');
      const pixToastErrorStub = sinon.stub(pixToast, 'sendErrorNotification');

      sinon.stub(store, 'createRecord').withArgs('combined-course-blueprint').returns(blueprintStub);

      //when
      const screen = await render(<template><CombinedCourseBlueprintForm /></template>);

      await screen
        .getByRole('button', { name: t('components.combined-course-blueprints.create.createButton') })
        .click();

      //then
      assert.ok(blueprintStub.save.calledOnce);
      assert.ok(pixToastSuccessStub.notCalled);
      assert.ok(
        pixToastErrorStub.calledOnceWith({
          message: t('components.combined-course-blueprints.create.notifications.error'),
        }),
      );
    });

    test('it should display validation error messages from API', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const pixToast = this.owner.lookup('service:pixToast');
      const blueprintStub = {
        save: sinon.stub().rejects({ errors: [{ status: '400', detail: 'Une donnée est invalide' }] }),
        content: [],
      };
      const pixToastSuccessStub = sinon.stub(pixToast, 'sendSuccessNotification');
      const pixToastErrorStub = sinon.stub(pixToast, 'sendErrorNotification');

      sinon.stub(store, 'createRecord').withArgs('combined-course-blueprint').returns(blueprintStub);

      //when
      const screen = await render(<template><CombinedCourseBlueprintForm /></template>);

      await screen
        .getByRole('button', { name: t('components.combined-course-blueprints.create.createButton') })
        .click();

      //then
      assert.ok(blueprintStub.save.calledOnce);
      assert.ok(pixToastSuccessStub.notCalled);
      assert.ok(
        pixToastErrorStub.calledOnceWith({
          message: 'Une donnée est invalide',
        }),
      );
    });

    test('it should display mutliple validation error messages from API', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const pixToast = this.owner.lookup('service:pixToast');
      const blueprintStub = {
        save: sinon.stub().rejects({
          errors: [
            { status: '400', detail: 'Une donnée est invalide' },
            { status: '404', detail: "Une donnée n'existe pas" },
            { status: '412', detail: 'Une erreur est survenue' },
          ],
        }),
        content: [],
      };
      const pixToastSuccessStub = sinon.stub(pixToast, 'sendSuccessNotification');
      const pixToastErrorStub = sinon.stub(pixToast, 'sendErrorNotification');

      sinon.stub(store, 'createRecord').withArgs('combined-course-blueprint').returns(blueprintStub);

      //when
      const screen = await render(<template><CombinedCourseBlueprintForm /></template>);

      await screen
        .getByRole('button', { name: t('components.combined-course-blueprints.create.createButton') })
        .click();

      //then
      assert.ok(blueprintStub.save.calledOnce);
      assert.ok(pixToastSuccessStub.notCalled);
      assert.ok(
        pixToastErrorStub.calledWith({
          message: 'Une donnée est invalide',
        }),
      );
      assert.ok(
        pixToastErrorStub.calledWith({
          message: "Une donnée n'existe pas",
        }),
      );
      assert.ok(
        pixToastErrorStub.calledWith({
          message: 'Une erreur est survenue',
        }),
      );
    });
  });
});
