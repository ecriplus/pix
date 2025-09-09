import { render, within } from '@1024pix/ember-testing-library';
import { setupIntl } from 'ember-intl/test-support';
import { t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import Invitations from 'pix-admin/components/certification-centers/invitations';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | Certification Centers | Invitations', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'fr');

  module('when there is no certification center invitations', function () {
    test('should show "Aucune invitation en attente"', async function (assert) {
      // given
      const certificationCenterInvitations = [];

      // when
      const screen = await render(
        <template><Invitations @certificationCenterInvitations={{certificationCenterInvitations}} /></template>,
      );

      // then
      assert.dom(screen.getByText('Aucune invitation en attente')).exists();
    });
  });

  module('when there is one or more certification center invitations', function () {
    test('should show invitations list', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const dayjsService = this.owner.lookup('service:dayjs');

      const invitationUpdatedAt1 = new Date('2020-02-02T09:00:00Z');
      const invitationUpdatedAt2 = new Date('2022-02-02T15:12:00Z');
      const certificationCenterInvitation1 = store.createRecord('certification-center-invitation', {
        email: 'elo.dela@example.net',
        updatedAt: invitationUpdatedAt1,
        locale: 'fr-FR',
      });
      const certificationCenterInvitation2 = store.createRecord('certification-center-invitation', {
        email: 'alain.finis@example.net',
        updatedAt: invitationUpdatedAt2,
        locale: 'fr-BE',
      });
      const certificationCenterInvitations = [certificationCenterInvitation1, certificationCenterInvitation2];
      const cancelCertificationCenterInvitation = sinon.stub();

      // when
      const screen = await render(
        <template>
          <Invitations
            @certificationCenterInvitations={{certificationCenterInvitations}}
            @onCancelCertificationCenterInvitation={{cancelCertificationCenterInvitation}}
          />
        </template>,
      );

      // then
      const formattedInvitationUpdatedAt1 = dayjsService.self(invitationUpdatedAt1).format('DD/MM/YYYY [-] HH:mm');
      const formattedInvitationUpdatedAt2 = dayjsService.self(invitationUpdatedAt2).format('DD/MM/YYYY [-] HH:mm');

      const table = screen.getByRole('table', {
        name: t('components.certification-centers.invitations.table.caption'),
      });

      assert.dom(screen.getByRole('heading', { name: 'Invitations' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Adresse e-mail' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Date de dernier envoi' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Locale' })).exists();
      assert.dom(within(table).getByRole('cell', { name: 'elo.dela@example.net' })).exists();
      assert.dom(within(table).getByRole('cell', { name: formattedInvitationUpdatedAt1 })).exists();
      assert.dom(within(table).getByRole('cell', { name: 'fr-FR' })).exists();
      assert.dom(within(table).getByRole('cell', { name: 'alain.finis@example.net' })).exists();
      assert.dom(within(table).getByRole('cell', { name: formattedInvitationUpdatedAt2 })).exists();
      assert.dom(within(table).getByRole('cell', { name: 'fr-BE' })).exists();
    });
  });
});
