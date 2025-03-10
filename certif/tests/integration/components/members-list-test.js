import { clickByName, render, within } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { waitForDialog, waitForDialogClose } from '../../helpers/wait-for';

module('Integration | Component | MembersList', function (hooks) {
  setupIntlRenderingTest(hooks);
  let store;
  let currentUser;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
    currentUser = this.owner.lookup('service:current-user');
    sinon.stub(currentUser, 'isAdminOfCurrentCertificationCenter').value(true);
    sinon.stub(currentUser, 'currentAllowedCertificationCenterAccess').value({ name: 'Certif NextGen' });
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  module('For edit role button', function () {
    test('displays a modal', async function (assert) {
      // given
      const connectedUserWithAdminRole = store.createRecord('member', {
        id: '1',
        firstName: 'Jacques',
        lastName: 'Ouzi',
        role: 'ADMIN',
      });
      const memberWithMemberRole = store.createRecord('member', {
        id: '3',
        firstName: 'Franck',
        lastName: 'Ofone',
        role: 'MEMBER',
      });
      const members = [connectedUserWithAdminRole, memberWithMemberRole];

      sinon.stub(currentUser, 'certificationPointOfContact').value({ id: connectedUserWithAdminRole.id });
      this.set('members', members);
      const screen = await render(hbs`<MembersList @members={{this.members}} />`);
      const table = screen.getByRole('table', { name: t('pages.team.table.caption') });

      // when
      await click(within(table).getByRole('button', { name: t('pages.team.members.actions.edit-role') }));
      await waitForDialog();

      // then
      assert
        .dom(screen.getByRole('heading', { level: 1, name: t('pages.team.members.modals.change-member-role.title') }))
        .exists();
    });
  });

  module('For remove member button', function () {
    test('displays a modal', async function (assert) {
      // given
      const connectedUserWithAdminRole = store.createRecord('member', {
        id: '1',
        firstName: 'Jacques',
        lastName: 'Ouzi',
        role: 'ADMIN',
      });
      const memberWithMemberRole = store.createRecord('member', {
        id: '3',
        firstName: 'Franck',
        lastName: 'Ofone',
        role: 'MEMBER',
      });
      const members = [connectedUserWithAdminRole, memberWithMemberRole];
      sinon.stub(currentUser, 'certificationPointOfContact').value({ id: connectedUserWithAdminRole.id });
      this.set('members', members);
      const screen = await render(hbs`<MembersList @members={{this.members}} />`);

      // when
      await click(screen.getByRole('button', { name: t('pages.team.members.actions.remove-membership') }));
      await waitForDialog();

      // then
      assert
        .dom(screen.getByRole('heading', { level: 1, name: t('pages.team.members.remove-membership-modal.title') }))
        .exists();
    });
  });

  module('For leaving centre button', function (hooks) {
    hooks.beforeEach(function () {
      const connectedUserWithAdminRole = store.createRecord('member', {
        id: '1',
        firstName: 'Jacques',
        lastName: 'Ouzi',
        role: 'ADMIN',
      });
      const memberWithAdminRole = store.createRecord('member', {
        id: '2',
        firstName: 'Annie',
        lastName: 'Versaire',
        role: 'ADMIN',
      });
      const members = [connectedUserWithAdminRole, memberWithAdminRole];

      sinon.stub(currentUser, 'certificationPointOfContact').value({ id: connectedUserWithAdminRole.id });
      this.set('members', members);
    });

    test('displays a modal', async function (assert) {
      // given
      const screen = await render(hbs`<MembersList @members={{this.members}} />`);

      // when
      await clickByName('Quitter cet espace Pix Certif');
      await waitForDialog();

      // then
      assert.dom(screen.getByRole('heading', { level: 1, name: 'Quitter cet espace Pix Certif' })).exists();
      assert.dom(screen.getByText('Certif NextGen')).exists();
    });

    module('when leave certification center modal is displayed', function () {
      module('when clicking on "Annuler" button', function () {
        test('closes the modal', async function (assert) {
          // given
          const screen = await render(hbs`<MembersList @members={{this.members}} />`);

          await clickByName('Quitter cet espace Pix Certif');
          await waitForDialog();

          // when
          await clickByName('Annuler');
          await waitForDialogClose();

          // then
          assert.dom(screen.queryByRole('heading', { level: 1, name: 'Quitter cet espace Pix Certif' })).doesNotExist();
        });
      });

      module('when clicking on "Confirmer" button', function () {
        test('calls "onLeaveCertificationCenter" event handler and closes the modal', async function (assert) {
          // given
          const onLeaveCertificationCenter = sinon.stub();
          this.set('onLeaveCertificationCenter', onLeaveCertificationCenter);
          const session = this.owner.lookup('service:session');
          sinon.stub(session, 'waitBeforeInvalidation');

          const screen = await render(
            hbs`<MembersList @members={{this.members}} @onLeaveCertificationCenter={{this.onLeaveCertificationCenter}} />`,
          );

          await clickByName('Quitter cet espace Pix Certif');
          await waitForDialog();

          // when
          await clickByName('Confirmer');
          await waitForDialogClose();

          // then
          sinon.assert.called(session.waitBeforeInvalidation);
          assert.dom(screen.queryByRole('heading', { level: 1, name: 'Quitter cet espace Pix Certif' })).doesNotExist();
          assert.true(onLeaveCertificationCenter.calledOnce);
        });
      });
    });
  });
});
