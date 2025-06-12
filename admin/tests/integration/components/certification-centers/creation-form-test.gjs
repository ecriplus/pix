import { fillByLabel, render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import CreationForm from 'pix-admin/components/certification-centers/creation-form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

const habilitations = [
  { id: '1', key: 'E', label: 'Pix+Edu' },
  { id: '2', key: 'S', label: 'Pix+Surf' },
];

module('Integration | Component | certification-centers/creation-form', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store, pixToast, router;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
    sinon.stub(store, 'createRecord').returns({
      save: sinon.stub().resolves(),
    });

    pixToast = this.owner.lookup('service:pixToast');
    sinon.stub(pixToast, 'sendSuccessNotification');
    sinon.stub(pixToast, 'sendErrorNotification');

    router = this.owner.lookup('service:router');
    sinon.stub(router, 'transitionTo');
  });

  test('fills the form and create a certification center', async function (assert) {
    // given
    const onCancel = () => {};

    const screen = await render(
      <template><CreationForm @habilitations={{habilitations}} @onCancel={{onCancel}} /></template>,
    );

    // when
    await fillByLabel('Nom du centre', 'Hello World');
    await click(screen.getByRole('button', { name: "Type d'établissement" }));
    await screen.findByRole('listbox');
    await click(screen.getByRole('option', { name: 'Établissement scolaire' }));
    await fillByLabel('Prénom du DPO', 'Jacques');
    await fillByLabel('Nom du DPO', 'Hadis');
    await fillByLabel('Adresse e-mail du DPO', 'jacques.hadis@example.com');
    await click(screen.getByRole('checkbox', { name: 'Pix+Edu' }));

    await click(screen.getByRole('button', { name: 'Ajouter' }));

    // then
    assert.ok(store.createRecord.called);
    assert.ok(pixToast.sendSuccessNotification.called);
    assert.ok(router.transitionTo.called);

    const recordName = store.createRecord.getCall(0).args[0];
    assert.deepEqual(recordName, 'certification-center');

    const record = store.createRecord.getCall(0).args[1];
    assert.deepEqual(record, {
      name: 'Hello World',
      type: 'SCO',
      externalId: null,
      dataProtectionOfficerFirstName: 'Jacques',
      dataProtectionOfficerLastName: 'Hadis',
      dataProtectionOfficerEmail: 'jacques.hadis@example.com',
      habilitations: [{ id: '1', key: 'E', label: 'Pix+Edu' }],
    });

    const message = pixToast.sendSuccessNotification.getCall(0).args[0];
    assert.deepEqual(message, { message: 'Le centre de certification a été créé avec succès.' });

    const transitionTo = router.transitionTo.getCall(0).args[0];
    assert.strictEqual(transitionTo, 'authenticated.certification-centers.get');
  });

  test('toggles habilitations', async function (assert) {
    // given
    const onCancel = () => {};

    const screen = await render(
      <template><CreationForm @habilitations={{habilitations}} @onCancel={{onCancel}} /></template>,
    );

    // when
    await fillByLabel('Nom du centre', 'Hello World');
    await click(screen.getByRole('button', { name: "Type d'établissement" }));
    await screen.findByRole('listbox');
    await click(screen.getByRole('option', { name: 'Établissement scolaire' }));

    await click(screen.getByRole('checkbox', { name: 'Pix+Surf' }));
    await click(screen.getByRole('checkbox', { name: 'Pix+Edu' }));
    await click(screen.getByRole('checkbox', { name: 'Pix+Surf' }));
    await click(screen.getByRole('checkbox', { name: 'Pix+Edu' }));
    await click(screen.getByRole('checkbox', { name: 'Pix+Surf' }));

    await click(screen.getByRole('button', { name: 'Ajouter' }));

    // then
    assert.ok(store.createRecord.called);

    const record = store.createRecord.getCall(0).args[1];
    assert.deepEqual(record, {
      name: 'Hello World',
      type: 'SCO',
      externalId: null,
      dataProtectionOfficerFirstName: '',
      dataProtectionOfficerLastName: '',
      dataProtectionOfficerEmail: '',
      habilitations: [{ id: '2', key: 'S', label: 'Pix+Surf' }],
    });
  });

  module('When an error occured', function () {
    test('displays default error toast for unexepected error', async function (assert) {
      // given
      const onCancel = () => {};
      store.createRecord.returns({ save: sinon.stub().rejects() });

      const screen = await render(
        <template><CreationForm @habilitations={{habilitations}} @onCancel={{onCancel}} /></template>,
      );

      // when
      await fillByLabel('Nom du centre', 'Hello World');
      await click(screen.getByRole('button', { name: "Type d'établissement" }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'Établissement scolaire' }));
      await click(screen.getByRole('button', { name: 'Ajouter' }));

      // then
      assert.ok(pixToast.sendErrorNotification.called);

      const message = pixToast.sendErrorNotification.getCall(0).args[0];
      assert.deepEqual(message, { message: 'Une erreur est survenue.' });
    });

    test('displays an error toast for API error', async function (assert) {
      // given
      const onCancel = () => {};
      store.createRecord.returns({ save: sinon.stub().rejects({ errors: [{ detail: 'BOOM!' }] }) });

      const screen = await render(
        <template><CreationForm @habilitations={{habilitations}} @onCancel={{onCancel}} /></template>,
      );

      // when
      await fillByLabel('Nom du centre', 'Hello World');
      await click(screen.getByRole('button', { name: "Type d'établissement" }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'Établissement scolaire' }));
      await click(screen.getByRole('button', { name: 'Ajouter' }));

      // then
      assert.ok(pixToast.sendErrorNotification.called);

      const message = pixToast.sendErrorNotification.getCall(0).args[0];
      assert.deepEqual(message, { message: 'BOOM!' });
    });
  });
});
