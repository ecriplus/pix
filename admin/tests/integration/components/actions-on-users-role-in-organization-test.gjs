import { clickByName, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import ActionsOnUsersRoleInOrganization from 'pix-admin/components/actions-on-users-role-in-organization';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | actions-on-users-role-in-organization', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when user has access to organization actions scope', function () {
    test('it should be possible to modify user role', async function (assert) {
      // given
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);

      const store = this.owner.lookup('service:store');
      const organizationMembership = store.createRecord('organization-membership', {
        role: 'ADMIN',
        save: sinon.stub(),
      });

      const notificationSuccessStub = sinon.stub();
      class NotificationsStub extends Service {
        sendSuccessNotification = notificationSuccessStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      // when
      const screen = await render(
        <template><ActionsOnUsersRoleInOrganization @organizationMembership={{organizationMembership}} /></template>,
      );
      await clickByName('Modifier le rôle');

      await click(screen.getByRole('button', { name: 'Sélectionner un rôle' }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'Membre' }));
      await clickByName('Enregistrer');

      // then
      assert.ok(organizationMembership.save.called);
      sinon.assert.calledWith(notificationSuccessStub, { message: 'Le rôle du membre a été mis à jour avec succès.' });
      assert.dom(screen.queryByRole('button', { name: 'Modifier le rôle' })).exists();
      assert.dom(screen.getByText('Membre')).exists();
    });

    test('it should be possible to disable user in a specific organization', async function (assert) {
      // given
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);

      const store = this.owner.lookup('service:store');

      const organizationMembership = store.createRecord('organization-membership', {
        role: 'ADMIN',
        reload: sinon.stub(),
      });

      sinon.stub(organizationMembership, 'destroyRecord').resolves();

      const notificationSuccessStub = sinon.stub();
      class NotificationsStub extends Service {
        sendSuccessNotification = notificationSuccessStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      // when
      const screen = await render(
        <template><ActionsOnUsersRoleInOrganization @organizationMembership={{organizationMembership}} /></template>,
      );

      await clickByName("Désactiver l'agent");

      await screen.findByRole('dialog');

      await clickByName('Confirmer');

      // then
      sinon.assert.calledWith(notificationSuccessStub, { message: 'Le membre a été désactivé avec succès.' });
      assert.ok(organizationMembership.destroyRecord.calledWith({ adapterOptions: { disable: true } }));
    });
  });

  module('when user has not access to organization actions scope', function () {
    test('it should not show actions buttons', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const organizationMembership = store.createRecord('organization-membership', {
        role: 'ADMIN',
        save: sinon.stub(),
      });
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = false;
      }
      this.owner.register('service:access-control', AccessControlStub);

      // when
      const screen = await render(
        <template><ActionsOnUsersRoleInOrganization @organizationMembership={{organizationMembership}} /></template>,
      );

      // expect
      assert.dom(screen.queryByRole('button', { name: 'Modifier le rôle' })).doesNotExist();
      assert.dom(screen.queryByRole('button', { name: 'Désactiver' })).doesNotExist();
    });
  });

  module('Error handling', function () {
    test('it should show error notification when update role fails', async function (assert) {
      // given
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);

      const store = this.owner.lookup('service:store');
      const organizationMembership = store.createRecord('organization-membership', {
        role: 'ADMIN',
        save: sinon.stub().rejects(new Error('Save failed')),
      });

      const notificationErrorStub = sinon.stub();
      class NotificationsStub extends Service {
        sendErrorNotification = notificationErrorStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      // when
      const screen = await render(
        <template><ActionsOnUsersRoleInOrganization @organizationMembership={{organizationMembership}} /></template>,
      );
      await clickByName('Modifier le rôle');

      await click(screen.getByRole('button', { name: 'Sélectionner un rôle' }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'Membre' }));
      await clickByName('Enregistrer');

      // then
      sinon.assert.calledWith(notificationErrorStub, {
        message: 'Une erreur est survenue lors de la mise à jour du rôle du membre.',
      });
      assert.dom(screen.queryByRole('button', { name: 'Modifier le rôle' })).exists();
    });

    test('it should show error notification when disable membership fails', async function (assert) {
      // given
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);

      const store = this.owner.lookup('service:store');
      const organizationMembership = store.createRecord('organization-membership', {
        role: 'ADMIN',
        reload: sinon.stub(),
      });

      sinon.stub(organizationMembership, 'destroyRecord').rejects(new Error('Disable failed'));

      const notificationErrorStub = sinon.stub();
      class NotificationsStub extends Service {
        sendErrorNotification = notificationErrorStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      // when
      const screen = await render(
        <template><ActionsOnUsersRoleInOrganization @organizationMembership={{organizationMembership}} /></template>,
      );

      await clickByName("Désactiver l'agent");
      await screen.findByRole('dialog');
      await clickByName('Confirmer');

      // then
      sinon.assert.calledWith(notificationErrorStub, {
        message: 'Une erreur est survenue lors de la désactivation du membre.',
      });
      assert.ok(true);
    });
  });
});
