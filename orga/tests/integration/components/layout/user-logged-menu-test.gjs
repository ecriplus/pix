import { clickByName, render } from '@1024pix/ember-testing-library';
import Object from '@ember/object';
import Service from '@ember/service';
import UserLoggedMenu from 'pix-orga/components/layout/user-logged-menu';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | UserLoggedMenu', function () {
  module('When user belongs to several organizations', function (hooks) {
    setupIntlRenderingTest(hooks);

    let prescriber, organization, organization2, organization3, loadStub;

    hooks.beforeEach(function () {
      organization = Object.create({ id: '1', name: 'Main organization', externalId: 'EXT' });
      prescriber = Object.create({
        firstName: 'givenFirstName',
        lastName: 'givenLastName',
        userOrgaSettings: Object.create({
          id: 234,
        }),
      });
      organization2 = Object.create({ id: '2', name: 'Organization 2', externalId: 'EXT2' });
      organization3 = Object.create({ id: '3', name: 'Organization 3' });
      loadStub = sinon.stub();

      class CurrentUserStub extends Service {
        organization = organization;
        prescriber = prescriber;
        memberships = [
          Object.create({ organization }),
          Object.create({ organization: organization2 }),
          Object.create({ organization: organization3 }),
        ];
        load = loadStub;
      }
      this.owner.register('service:current-user', CurrentUserStub);
    });

    test("should display user's firstName and lastName", async function (assert) {
      // when
      const screen = await render(<template><UserLoggedMenu /></template>);

      // then
      assert.ok(screen.getByText(`${prescriber.firstName} ${prescriber.lastName}`));
    });

    test('should display the user current organization name and externalId', async function (assert) {
      // when
      const screen = await render(<template><UserLoggedMenu /></template>);
      const currentOrganizationText = screen.getByText(`${organization.name} (${organization.externalId})`, {
        selector: 'p',
      });

      // then
      assert.ok(currentOrganizationText);
    });

    test('should display the disconnect link when menu is open', async function (assert) {
      // when
      const screen = await render(<template><UserLoggedMenu /></template>);
      await clickByName("Changer d'organisation");

      // then
      assert.ok(screen.getByRole('link', { name: 'Se déconnecter' }));
    });

    test('should display the organizations name when menu is open', async function (assert) {
      // when
      const screen = await render(<template><UserLoggedMenu /></template>);
      await clickByName("Changer d'organisation");

      // then
      assert.ok(await screen.findByRole('option', { name: `${organization2.name} (${organization2.externalId})` }));
      assert.ok(await screen.findByRole('option', { name: `${organization3.name}` }));
    });
  });
  module('When user belongs to only one organization', function (hooks) {
    setupIntlRenderingTest(hooks);

    let prescriber, organization, loadStub;

    hooks.beforeEach(function () {
      organization = Object.create({ id: '1', name: 'Main organization', externalId: 'EXT' });
      prescriber = Object.create({
        firstName: 'givenFirstName',
        lastName: 'givenLastName',
        userOrgaSettings: Object.create({
          id: 234,
        }),
      });
      loadStub = sinon.stub();

      class CurrentUserStub extends Service {
        organization = organization;
        prescriber = prescriber;
        memberships = [Object.create({ organization })];
        load = loadStub;
      }
      this.owner.register('service:current-user', CurrentUserStub);
      test('should not display organization switcher when user belongs to only one organization', async function (assert) {
        const screen = await render(<template><UserLoggedMenu /></template>);
        assert.notOk(screen.getByRole('button', { name: "Changer d'organisation" }));
      });
    });
  });
});
