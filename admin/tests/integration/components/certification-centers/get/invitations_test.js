import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@1024pix/ember-testing-library';

module('Integration | Component | Certification Centers | Invitations', function (hooks) {
  setupRenderingTest(hooks);

  module('when there is no certification center invitations', function () {
    test('should show "Aucune invitation en attente"', async function (assert) {
      // give & when
      const screen = await render(hbs`<CertificationCenters::Invitations />`);

      // then
      assert.dom(screen.getByText('Aucune invitation en attente')).exists();
    });
  });

  module('when there is one or more certification center invitations', function () {
    test('should show invitations list', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certificationCenterInvitation1 = store.createRecord('certification-center-invitation', {
        email: 'elo.dela@example.net',
      });
      const certificationCenterInvitation2 = store.createRecord('certification-center-invitation', {
        email: 'alain.finis@example.net',
      });
      this.certificationCenterInvitations = [certificationCenterInvitation1, certificationCenterInvitation2];

      // when
      const screen = await render(
        hbs`<CertificationCenters::Invitations @certificationCenterInvitations={{this.certificationCenterInvitations}} />`
      );

      // then
      assert.dom(screen.getByRole('heading', { name: 'Invitations' })).exists();
      assert.dom(screen.getByRole('columnheader', { name: 'Adresse e-mail' })).exists();
      assert.dom(screen.getByRole('columnheader', { name: 'Date de dernier envoi' })).exists();
      assert.dom(screen.getByRole('cell', { name: 'elo.dela@example.net' })).exists();
      assert.dom(screen.getByRole('cell', { name: 'alain.finis@example.net' })).exists();
    });
  });
});