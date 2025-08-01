import { render, within } from '@1024pix/ember-testing-library';
import { setupRenderingTest } from 'ember-qunit';
import CertificationInformationState from 'pix-admin/components/certifications/certification/informations/state';
import { assessmentResultStatus } from 'pix-admin/models/certification';
import { module, test } from 'qunit';

module('Integration | Component | Certifications | Certification | Information | State', function (hooks) {
  setupRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  test('should display certification state informations', async function (assert) {
    // given
    const certification = store.createRecord('certification', {
      completedAt: new Date(),
      status: 'rejected',
      isPublished: false,
    });
    const session = store.createRecord('session', { id: 7404 });

    // when
    const screen = await render(
      <template><CertificationInformationState @certification={{certification}} @session={{session}} /></template>,
    );

    // then
    assert.dom(screen.getByRole('heading', { name: 'État' })).exists();
    assert.dom(screen.queryByText('Publiée')).doesNotExist();
    assert.dom(screen.queryByText('Annulée')).doesNotExist();

    const sessionInfo = screen.getByText('Session :');
    assert.dom(sessionInfo).exists();
    assert.dom(within(sessionInfo.parentNode).getByRole('link', { name: session.id })).exists();

    const statusInfo = screen.getByText('Statut :');
    assert.dom(statusInfo).exists();
    assert.dom(within(statusInfo.parentNode).getByText('Rejetée')).exists();

    const createdAtInfo = screen.getByText('Créée le :');
    assert.dom(createdAtInfo).exists();
    assert.dom(within(createdAtInfo.parentNode).getByText(certification.creationDate)).exists();

    const completedAtInfo = screen.getByText('Terminée le :');
    assert.dom(completedAtInfo).exists();
    assert.dom(within(completedAtInfo.parentNode).getByText(certification.completionDate)).exists();

    const isPublishedInfo = screen.getByText('Publiée :');
    assert.dom(isPublishedInfo).exists();
    assert.dom(within(isPublishedInfo.parentNode).getByText('Non')).exists();
  });

  module('when the certification is published', function () {
    test('it should display a tag and a specific text', async function (assert) {
      // given
      const certification = store.createRecord('certification', {
        isPublished: true,
      });
      const session = store.createRecord('session', { id: 7404 });

      // when
      const screen = await render(
        <template><CertificationInformationState @certification={{certification}} @session={{session}} /></template>,
      );

      // then
      assert.dom(screen.getByText('Publiée')).exists();

      const isPublishedInfo = screen.getByText('Publiée :');
      assert.dom(within(isPublishedInfo.parentNode).getByText('Oui')).exists();
    });
  });

  module('when the certification is cancelled', function () {
    test('it should display a tag and update the status', async function (assert) {
      // given
      const certification = store.createRecord('certification', {
        isPublished: false,
        status: assessmentResultStatus.CANCELLED,
      });
      const session = store.createRecord('session', { id: 7404 });

      // when
      const screen = await render(
        <template><CertificationInformationState @certification={{certification}} @session={{session}} /></template>,
      );

      // then
      const statusInfo = screen.getByText('Statut :');
      assert.dom(statusInfo).exists();
      assert.dom(within(statusInfo.parentNode).getByText('Annulée')).exists();
    });
  });
});
