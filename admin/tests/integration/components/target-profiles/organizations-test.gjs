import { clickByName, fillByLabel, render } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import Organizations from 'pix-admin/components/target-profiles/organizations';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | target-profiles | Organizations', function (hooks) {
  setupIntlRenderingTest(hooks);

  const triggerFiltering = () => {};
  const goToOrganizationPage = () => {};
  const detachOrganizations = () => {};
  const queryParams = { hideArchived: false };

  hooks.beforeEach(function () {
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isSuperAdmin: true };
  });

  test('it should display the organizations', async function (assert) {
    // given
    const organization1 = EmberObject.create({ id: 123, name: 'Orga1', externalId: 'O1' });
    const organization2 = EmberObject.create({ id: 456, name: 'Orga2', externalId: 'O2' });
    const organizations = [organization1, organization2];
    organizations.meta = { page: 1, pageSize: 1 };

    // when
    const screen = await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );

    // then
    assert.dom(screen.getByText('Orga1')).exists();
    assert.dom(screen.getByText('Orga2')).exists();
  });

  test('it should display organization informations', async function (assert) {
    // given
    const organization1 = EmberObject.create({ id: 123, name: 'Orga1', externalId: 'O1' });
    const organizations = [organization1];
    organizations.meta = { page: 1, pageSize: 1 };

    // when
    const screen = await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );

    // then
    assert.dom(screen.getByText('Orga1')).exists();
    assert.dom(screen.getByText('123')).exists();
    assert.dom(screen.getByText('O1')).exists();
  });

  test('it displays a message when there is no organizations', async function (assert) {
    // given
    const organizations = [];
    organizations.meta = { page: 1, pageSize: 1 };
    this.organizations = [];

    // when
    const screen = await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );

    assert.dom(screen.getByText('Aucun résultat')).exists();
  });

  test('it should display a field to attach organizations', async function (assert) {
    // given
    const organizations = [];

    // when
    await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );
    await fillByLabel('Rattacher une ou plusieurs organisation(s)', '1, 2');
    await clickByName('Valider le rattachement');

    assert.dom('[placeholder="1, 2"]').hasValue('1, 2');
  });

  test('it should display a field to attach organizations from an existing target profile', async function (assert) {
    // given
    const organizations = [];

    // when
    await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );
    await fillByLabel("Rattacher les organisations d'un profil cible existant", 1);
    await clickByName('Valider le rattachement à partir de ce profil cible');

    assert.dom('[placeholder="1135"]').hasValue('1');
  });

  test('it should show a column to detach organization from profile-cible', async function (assert) {
    // given
    const organization1 = EmberObject.create({ id: 123, name: 'Orga1', externalId: 'O1' });
    const organizations = [organization1];
    organizations.meta = { page: 1, pageSize: 1 };

    // when
    const screen = await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );

    const detachButton = await screen.queryByRole('button', { name: 'Détacher' });
    assert.dom(detachButton).exists();
  });

  test('it should not show a column to detach organization from profile-cible if not super-admin', async function (assert) {
    // given
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isSuperAdmin: false };

    const organization1 = EmberObject.create({ id: 123, name: 'Orga1', externalId: 'O1' });
    const organizations = [organization1];
    organizations.meta = { page: 1, pageSize: 1 };

    // when
    const screen = await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );

    const detachButton = await screen.queryByRole('button', { name: 'Détacher' });
    assert.dom(detachButton).doesNotExist();
  });

  test('it should show a column to detach organization from profile-cible if metier', async function (assert) {
    // given
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isSuperAdmin: false, isMetier: true };

    const organization1 = EmberObject.create({ id: 123, name: 'Orga1', externalId: 'O1' });
    const organizations = [organization1];
    organizations.meta = { page: 1, pageSize: 1 };

    // when
    const screen = await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );

    const detachButton = await screen.queryByRole('button', { name: 'Détacher' });
    assert.dom(detachButton).exists();
  });

  test('it should disable buttons when the inputs are empty', async function (assert) {
    // given
    const organizations = [];
    organizations.meta = { page: 1, pageSize: 1 };

    // when
    const screen = await render(
      <template>
        <Organizations
          @organizations={{organizations}}
          @goToOrganizationPage={{goToOrganizationPage}}
          @triggerFiltering={{triggerFiltering}}
          @hideArchived={{queryParams.hideArchived}}
          @detachOrganizations={{detachOrganizations}}
        />
      </template>,
    );

    // then
    assert.dom(screen.getByLabelText('Valider le rattachement')).hasAttribute('aria-disabled');
    assert
      .dom(screen.getByLabelText('Valider le rattachement à partir de ce profil cible'))
      .hasAttribute('aria-disabled');
  });

  module('Organization attachment functionality', function (hooks) {
    let store;

    hooks.beforeEach(function () {
      store = this.owner.lookup('service:store');
    });

    test('it should enable button when input has content', async function (assert) {
      // given
      const organizations = [];
      const targetProfile = { id: 56 };

      // when
      const screen = await render(
        <template>
          <Organizations
            @organizations={{organizations}}
            @targetProfile={{targetProfile}}
            @goToOrganizationPage={{goToOrganizationPage}}
            @triggerFiltering={{triggerFiltering}}
            @hideArchived={{queryParams.hideArchived}}
            @detachOrganizations={{detachOrganizations}}
          />
        </template>,
      );
      await fillByLabel('Rattacher une ou plusieurs organisation(s)', '1, 2');

      // then
      assert.dom(screen.getByLabelText('Valider le rattachement')).doesNotHaveAttribute('aria-disabled');
    });

    test('it should call adapter when form is submitted', async function (assert) {
      // given
      const organizations = [];
      const targetProfile = { id: 56 };
      const adapter = store.adapterFor('target-profile');
      const attachOrganizationsStub = sinon.stub(adapter, 'attachOrganizations').resolves({
        data: { attributes: { 'duplicated-ids': [], 'attached-ids': [1, 2] } },
      });

      // when
      await render(
        <template>
          <Organizations
            @organizations={{organizations}}
            @targetProfile={{targetProfile}}
            @goToOrganizationPage={{goToOrganizationPage}}
            @triggerFiltering={{triggerFiltering}}
            @hideArchived={{queryParams.hideArchived}}
            @detachOrganizations={{detachOrganizations}}
          />
        </template>,
      );
      await fillByLabel('Rattacher une ou plusieurs organisation(s)', '1, 2');
      await clickByName('Valider le rattachement');

      // then
      assert.ok(attachOrganizationsStub.calledWith({ organizationIds: [1, 2], targetProfileId: 56 }));
    });

    test('it should enable button for existing target profile attachment', async function (assert) {
      // given
      const organizations = [];
      const targetProfile = { id: 56 };

      // when
      const screen = await render(
        <template>
          <Organizations
            @organizations={{organizations}}
            @targetProfile={{targetProfile}}
            @goToOrganizationPage={{goToOrganizationPage}}
            @triggerFiltering={{triggerFiltering}}
            @hideArchived={{queryParams.hideArchived}}
            @detachOrganizations={{detachOrganizations}}
          />
        </template>,
      );
      await fillByLabel("Rattacher les organisations d'un profil cible existant", '123');

      // then
      assert
        .dom(screen.getByLabelText('Valider le rattachement à partir de ce profil cible'))
        .doesNotHaveAttribute('aria-disabled');
    });
  });
});
