import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { currentURL } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import authenticateSession from '../helpers/authenticate-session';
import {
  createPrescriberByUser,
  createUserWithMembershipAndTermsOfServiceAccepted,
  createUserWithMultipleMemberships,
} from '../helpers/test-init';

module('Acceptance | Switch Organization', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('When connected prescriber is linked to only one organization', function (hooks) {
    hooks.beforeEach(async function () {
      const user = createUserWithMembershipAndTermsOfServiceAccepted();
      createPrescriberByUser({ user });

      await authenticateSession(user.id);
    });

    test('should display the main organization name and externalId in summary', async function (assert) {
      // when
      const screen = await visit('/');

      // then
      assert.ok(screen.getByText('BRO & Evil Associates (EXTBRO)'));
    });
  });

  module('When connected prescriber is linked to multiples organizations', function (hooks) {
    hooks.beforeEach(async function () {
      const user = createUserWithMultipleMemberships();
      createPrescriberByUser({ user });

      await authenticateSession(user.id);
    });

    test('should have an organization in menu', async function (assert) {
      // when
      const screen = await visit('/');
      const button = screen.getByRole('button', { name: "Changer d'organisation" });
      await click(button);
      // then
      const listbox = await screen.findAllByRole('option');
      assert.strictEqual(listbox.length, 2);
      assert.ok(await screen.findByRole('option', { name: 'BRO & Evil Associates (EXTBRO)' }));
    });

    module('When prescriber click on an organization', function () {
      test('should find the selected organization in list', async function (assert) {
        // when
        const screen = await visit('/');

        const button = screen.getByRole('button', { name: "Changer d'organisation" });
        await click(button);
        const organizationSelected = await screen.findByRole('option', { name: 'My Heaven Company (HEAVEN)' });
        await click(organizationSelected);

        // then
        assert.ok(organizationSelected);
      });

      test('should have the old main organization in the menu after switching', async function (assert) {
        // when
        const screen = await visit('/');

        const button = screen.getByRole('button', { name: "Changer d'organisation" });
        await click(button);

        const oldOrganization = await screen.findByRole('option', { name: 'My Heaven Company (HEAVEN)' });
        await click(screen.getByText('My Heaven Company (HEAVEN)'));
        await click(button);
        const listbox = await screen.findAllByRole('option');

        //then
        assert.strictEqual(listbox.length, 2);
        assert.ok(oldOrganization);
      });

      module('When prescriber is on campaign page with pagination', function () {
        test('it should reset the queryParams when redirecting', async function (assert) {
          // given
          const screen = await visit('/campagnes/les-miennes?pageNumber=2&pageSize=10&name=test&status=archived');

          // when
          const button = screen.getByRole('button', { name: "Changer d'organisation" });
          await click(button);
          const oldOrganization = await screen.findByRole('option', { name: 'My Heaven Company (HEAVEN)' });
          await click(oldOrganization);

          // then
          assert.strictEqual(currentURL(), '/campagnes/les-miennes');
        });
      });

      module(
        'When user switch from a not managing student organization to a managing student organization',
        function () {
          test('it should display student menu item', async function (assert) {
            // when
            const screen = await visit('/');

            const button = screen.getByRole('button', { name: "Changer d'organisation" });
            await click(button);
            await click(screen.getByText('My Heaven Company (HEAVEN)'));

            // then
            assert.ok(screen.getByText('Élèves'));
          });
        },
      );
    });
  });
});
