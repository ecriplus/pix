import { render, within } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ActionsOnChildrenInOrganization from 'pix-admin/components/organizations/children/actions-on-children-in-organization';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';
import { waitForDialogClose } from '../../../../helpers/wait-for';

module('Integration | Component | organizations/children/actions-on-children-in-organization', function (hooks) {
  setupIntlRenderingTest(hooks);
  let store;
  let notificationService;
  let organizationAdapter;
  let detachChildOrganizationFromParentStub;

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store');

    notificationService = this.owner.lookup('service:pixToast');
    sinon.stub(notificationService, 'sendSuccessNotification');
    sinon.stub(notificationService, 'sendErrorNotification');

    organizationAdapter = store.adapterFor('organization');
    detachChildOrganizationFromParentStub = sinon.stub(organizationAdapter, 'detachChildOrganizationFromParent');
  });

  module('when clicking the Detach button', function () {
    test('it should display confirmation modal with orga id in modal text', async function (assert) {
      // given
      const organization = store.createRecord('organization', {
        id: '1',
        name: 'Orga 1',
      });

      // when
      const screen = await render(
        <template><ActionsOnChildrenInOrganization @childOrganization={{organization}} /></template>,
      );

      await click(
        screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
      );

      // then
      const modal = await screen.findByRole('dialog');
      assert.ok(
        within(modal).getByText(
          t('components.organizations.children-list.actions.detach.confirm-modal-message', {
            organizationId: '1',
          }),
        ),
      );
    });

    module('when clicking Confirm', function () {
      test('it should close modal, detach organization, send success notification and refresh model', async function (assert) {
        // given
        const organization = store.createRecord('organization', {
          id: '1',
          name: 'Orga 1',
        });

        detachChildOrganizationFromParentStub.withArgs({ childOrganizationId: organization.id }).resolves();

        const onRefreshOrganizationChildrenStub = sinon.stub();

        // when
        const screen = await render(
          <template>
            <ActionsOnChildrenInOrganization
              @childOrganization={{organization}}
              @onRefreshOrganizationChildren={{onRefreshOrganizationChildrenStub}}
            />
          </template>,
        );

        await click(
          screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
        );

        const modal = await screen.findByRole('dialog');

        await click(within(modal).getByRole('button', { name: t('common.actions.confirm') }));
        await waitForDialogClose();

        // then
        assert.notOk(
          screen.queryByRole('dialog', {
            name: t('components.organizations.children-list.actions.detach.confirm-modal-title'),
          }),
        );

        assert.ok(detachChildOrganizationFromParentStub.calledOnce);

        assert.ok(
          notificationService.sendSuccessNotification.calledOnceWithExactly({
            message: t('pages.organization-children.notifications.success.detach-child-organization'),
          }),
        );

        assert.ok(onRefreshOrganizationChildrenStub.calledOnce);
      });

      module('when detachChildOrganizationFromParent rejects', function () {
        test('it should send error notification for UNABLE_TO_DETACH_PARENT_ORGANIZATION_FROM_CHILD_ORGANIZATION error', async function (assert) {
          // given
          const organization = store.createRecord('organization', {
            id: '1',
            name: 'Orga 1',
          });

          detachChildOrganizationFromParentStub
            .withArgs({ childOrganizationId: organization.id })
            .rejects({ errors: [{ code: 'UNABLE_TO_DETACH_PARENT_ORGANIZATION_FROM_CHILD_ORGANIZATION' }] });

          // when
          const screen = await render(
            <template><ActionsOnChildrenInOrganization @childOrganization={{organization}} /></template>,
          );

          await click(
            screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
          );

          const modal = await screen.findByRole('dialog');

          await click(within(modal).getByRole('button', { name: t('common.actions.confirm') }));
          await waitForDialogClose();

          // then
          assert.ok(
            notificationService.sendErrorNotification.calledOnceWithExactly({
              message: t('pages.organization-children.notifications.error.unable-to-detach-child-organization'),
            }),
          );
        });

        test('it should send generic error notification for any other code', async function (assert) {
          // given
          const organization = store.createRecord('organization', {
            id: '1',
            name: 'Orga 1',
          });

          detachChildOrganizationFromParentStub
            .withArgs({ childOrganizationId: organization.id })
            .rejects({ errors: [{ code: 'ANY_CODE' }] });

          // when
          const screen = await render(
            <template><ActionsOnChildrenInOrganization @childOrganization={{organization}} /></template>,
          );

          await click(
            screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
          );

          const modal = await screen.findByRole('dialog');
          await click(within(modal).getByRole('button', { name: t('common.actions.confirm') }));

          // then
          assert.ok(
            notificationService.sendErrorNotification.calledOnceWithExactly({
              message: t('common.notifications.generic-error'),
            }),
          );
        });

        test('it should send generic error notification if error has no code', async function (assert) {
          // given
          const organization = store.createRecord('organization', {
            id: '1',
            name: 'Orga 1',
          });

          detachChildOrganizationFromParentStub
            .withArgs({ childOrganizationId: organization.id })
            .rejects({ errors: [] });

          // when
          const screen = await render(
            <template><ActionsOnChildrenInOrganization @childOrganization={{organization}} /></template>,
          );

          await click(
            screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
          );

          const modal = await screen.findByRole('dialog');

          await click(within(modal).getByRole('button', { name: t('common.actions.confirm') }));
          await waitForDialogClose();

          // then
          assert.ok(
            notificationService.sendErrorNotification.calledOnceWithExactly({
              message: t('common.notifications.generic-error'),
            }),
          );
        });

        test('it should send generic error notification if error response has no errors array', async function (assert) {
          // given
          const organization = store.createRecord('organization', {
            id: '1',
            name: 'Orga 1',
          });

          detachChildOrganizationFromParentStub.withArgs({ childOrganizationId: organization.id }).rejects();

          // when
          const screen = await render(
            <template><ActionsOnChildrenInOrganization @childOrganization={{organization}} /></template>,
          );

          await click(
            screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
          );

          const modal = await screen.findByRole('dialog');

          await click(within(modal).getByRole('button', { name: t('common.actions.confirm') }));
          await waitForDialogClose();

          // then
          assert.ok(
            notificationService.sendErrorNotification.calledOnceWithExactly({
              message: t('common.notifications.generic-error'),
            }),
          );
        });
      });
    });

    module('when clicking Cancel', function () {
      test('it should close modal and not detach organization', async function (assert) {
        // given
        const organization = store.createRecord('organization', {
          id: '1',
          name: 'Orga 1',
        });

        detachChildOrganizationFromParentStub.withArgs({ childOrganizationId: organization.id }).resolves();

        // when
        const screen = await render(
          <template><ActionsOnChildrenInOrganization @childOrganization={{organization}} /></template>,
        );

        await click(
          screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
        );

        const modal = await screen.findByRole('dialog');

        await click(within(modal).getByRole('button', { name: t('common.actions.cancel') }));
        await waitForDialogClose();

        // then
        assert.notOk(
          screen.queryByRole('dialog', {
            name: t('components.organizations.children-list.actions.detach.confirm-modal-title'),
          }),
        );

        assert.notOk(detachChildOrganizationFromParentStub.called);
      });
    });
  });
});
