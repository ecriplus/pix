import { clickByName, render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import DeleteAccountSection from 'mon-pix/components/user-account/delete-account-section';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { waitForDialog, waitForDialogClose } from '../../../helpers/wait-for.js';

const I18N_KEYS = {
  title: 'pages.user-account.delete-account.title',
  contactSupport: 'pages.user-account.delete-account.more-information-contact-support',
  buttonLabel: 'pages.user-account.delete-account.actions.delete',
};

module('Integration | Component | UserAccount | DeleteAccountSection', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when user has an email', function () {
    test('it displays the delete account section with account email', async function (assert) {
      //given
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        profile: { pixScore: 42 },
      };

      // when
      const screen = await render(<template><DeleteAccountSection @user={{user}} /></template>);

      // then
      const title = await screen.findByRole('heading', { name: t(I18N_KEYS.title) });
      assert.dom(title).exists();

      const pixScore = screen.getByText(/42 pix/i);
      assert.dom(pixScore).exists();

      const emails = screen.getAllByText(/john.doe@email.com/i);
      assert.strictEqual(emails.length, 2);

      const supportLink = screen.getByRole('link', { name: t(I18N_KEYS.contactSupport) });
      assert.dom(supportLink).hasAttribute('href', 'https://pix.org/fr/support');

      const button = screen.getByRole('button', { name: t(I18N_KEYS.buttonLabel) });
      assert.dom(button).exists();
    });

    test('it opens and close the modal', async function (assert) {
      //given
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        profile: { pixScore: 42 },
      };
      const screen = await render(<template><DeleteAccountSection @user={{user}} /></template>);

      // when
      await clickByName(t('pages.user-account.delete-account.actions.delete'));

      // then
      await waitForDialog();
      const dialog = screen.getByRole('dialog');

      assert.dom(within(dialog).getByText('john.doe@email.com')).exists();

      // when
      await clickByName(t('common.actions.cancel'));

      // then
      await waitForDialogClose();

      assert.ok(true);
    });
  });

  module('when user does not have an email', function () {
    test('it displays the delete account section with account fullname', async function (assert) {
      //given
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: null,
        profile: { pixScore: 42 },
      };

      // when
      const screen = await render(<template><DeleteAccountSection @user={{user}} /></template>);

      // then
      const title = await screen.findByRole('heading', { name: t(I18N_KEYS.title) });
      assert.dom(title).exists();

      const pixScore = screen.getByText(/42 pix/i);
      assert.dom(pixScore).exists();

      const fullnames = screen.getAllByText(/John Doe/i);
      assert.strictEqual(fullnames.length, 2);
    });

    test('it opens and close the modal', async function (assert) {
      //given
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: null,
        profile: { pixScore: 42 },
      };
      const screen = await render(<template><DeleteAccountSection @user={{user}} /></template>);

      // when
      await clickByName(t('pages.user-account.delete-account.actions.delete'));

      // then
      await waitForDialog();
      const dialog = screen.getByRole('dialog');

      assert.dom(within(dialog).getByText('John Doe')).exists();

      // when
      await clickByName(t('common.actions.cancel'));

      // then
      await waitForDialogClose();

      assert.ok(true);
    });
  });
});
