import { render } from '@1024pix/ember-testing-library';
import { fillIn } from '@ember/test-helpers';
import AnnouncementsEditForm from 'pix-admin/components/announcements/edit-form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | announcements/edit-form', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it pre-fills textareas with existing announcement content', async function (assert) {
    // given
    const announcement = { content: { fr: 'Contenu français', en: 'English content' }, save: sinon.stub().resolves() };

    // when
    const screen = await render(<template><AnnouncementsEditForm @announcement={{announcement}} /></template>);

    // then
    assert.strictEqual(screen.getByLabelText('fr').value, 'Contenu français');
    assert.strictEqual(screen.getByLabelText('en').value, 'English content');
  });

  test('it saves the announcement with updated content on submit', async function (assert) {
    // given
    const announcement = { content: { fr: 'Ancien contenu' }, save: sinon.stub().resolves() };
    const pixToast = this.owner.lookup('service:pixToast');
    const successStub = sinon.stub(pixToast, 'sendSuccessNotification');

    const screen = await render(<template><AnnouncementsEditForm @announcement={{announcement}} /></template>);

    // when
    await fillIn(screen.getByLabelText('fr'), 'Nouveau contenu');
    await screen.getByRole('button', { name: 'Enregistrer' }).click();

    // then
    assert.ok(announcement.save.calledOnce);
    assert.deepEqual(announcement.content, { fr: 'Nouveau contenu' });
    assert.ok(successStub.calledOnceWith({ message: 'Annonce mise à jour avec succès.' }));
  });

  test('it shows an error notification when save fails', async function (assert) {
    // given
    const announcement = { content: { fr: 'Contenu' }, save: sinon.stub().rejects() };
    const pixToast = this.owner.lookup('service:pixToast');
    const errorStub = sinon.stub(pixToast, 'sendErrorNotification');

    const screen = await render(<template><AnnouncementsEditForm @announcement={{announcement}} /></template>);

    // when
    await screen.getByRole('button', { name: 'Enregistrer' }).click();

    // then
    assert.ok(announcement.save.calledOnce);
    assert.ok(errorStub.calledOnceWith({ message: "Une erreur est survenue lors de la mise à jour de l'annonce." }));
  });
});
