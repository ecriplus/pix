import { fillByLabel, render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import CreationForm from 'pix-admin/components/organizations/creation-form';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/creation-form', function (hooks) {
  setupIntlRenderingTest(hooks);
  const onSubmit = () => {};
  const onCancel = () => {};

  let store;

  const countries = [
    { code: '99100', name: 'France' },
    { code: '99101', name: 'Danemark' },
  ];

  const administrationTeams = [
    { id: 'team-1', name: 'Équipe 1' },
    { id: 'team-2', name: 'Équipe 2' },
  ];

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  module('Render', function () {
    test('it renders', async function (assert) {
      //given
      const organization = store.createRecord('organization', { type: '' });

      // when
      const screen = await render(
        <template>
          <CreationForm
            @organization={{organization}}
            @administrationTeams={{administrationTeams}}
            @countries={{countries}}
            @onSubmit={{onSubmit}}
            @onCancel={{onCancel}}
          />
        </template>,
      );

      // then
      assert.ok(screen.getByRole('textbox', { name: `${t('components.organizations.creation.name.label')} *` }));
      assert.ok(screen.getByLabelText(`${t('components.organizations.creation.type.label')} *`));
      assert.ok(screen.getByText(t('components.organizations.creation.administration-team.selector.placeholder')));
      assert.ok(screen.getByLabelText(`${t('components.organizations.creation.country.selector.label')} *`));
      assert.ok(screen.getByRole('textbox', { name: t('components.organizations.creation.province-code') }));
      assert.ok(screen.getByRole('textbox', { name: t('components.organizations.creation.external-id.label') }));
      assert.ok(screen.getByRole('textbox', { name: t('components.organizations.creation.documentation-link') }));
      assert.ok(screen.getByRole('textbox', { name: `${t('components.organizations.creation.dpo.lastname')}DPO` }));
      assert.ok(screen.getByRole('textbox', { name: `${t('components.organizations.creation.dpo.firstname')}DPO` }));
      assert.ok(screen.getByRole('textbox', { name: `${t('components.organizations.creation.dpo.email')}DPO` }));
      assert.ok(screen.getByRole('button', { name: t('common.actions.cancel') }));
      assert.ok(screen.getByRole('button', { name: t('common.actions.add') }));
    });

    test('should render countries options in list', async function (assert) {
      // given
      const organization = store.createRecord('organization', { type: '' });

      const screen = await render(
        <template>
          <CreationForm
            @organization={{organization}}
            @administrationTeams={{administrationTeams}}
            @countries={{countries}}
            @onSubmit={{onSubmit}}
            @onCancel={{onCancel}}
          />
        </template>,
      );

      // when
      await click(
        screen.getByRole('button', {
          name: `${t('components.organizations.creation.country.selector.label')} *`,
        }),
      );
      await screen.findByRole('listbox');
      const options = await screen.getAllByRole('option');

      // then
      assert.strictEqual(options.length, 2);
      assert.strictEqual(options[0].title, 'France (99100)');
      assert.strictEqual(options[1].title, 'Danemark (99101)');
    });
  });

  module('when filling form', function () {
    test('should update organization model', async function (assert) {
      // given
      const organization = store.createRecord('organization');

      const screen = await render(
        <template>
          <CreationForm
            @organization={{organization}}
            @administrationTeams={{administrationTeams}}
            @countries={{countries}}
            @onSubmit={{onSubmit}}
            @onCancel={{onCancel}}
          />
        </template>,
      );

      // when
      await fillByLabel(`${t('components.organizations.creation.name.label')} *`, 'Organisation de Test');

      click(screen.getByRole('button', { name: `${t('components.organizations.creation.type.label')} *` }));
      await screen.findByRole('listbox');
      click(screen.getByRole('option', { name: 'Établissement scolaire' }));

      await fillByLabel(t('components.organizations.creation.external-id.label'), 'Mon identifiant externe');

      click(
        screen.getByRole('button', {
          name: `${t('components.organizations.creation.administration-team.selector.label')} *`,
        }),
      );
      await screen.findByRole('listbox');
      click(await screen.findByRole('option', { name: 'Équipe 2' }));

      await fillByLabel(t('components.organizations.creation.province-code'), '78');

      click(
        screen.getByRole('button', {
          name: `${t('components.organizations.creation.country.selector.label')} *`,
        }),
      );
      await screen.findByRole('listbox');
      click(await screen.findByRole('option', { name: 'France (99100)' }));

      await fillByLabel(t('components.organizations.creation.documentation-link'), 'www.documentation.fr');

      await fillByLabel(`${t('components.organizations.creation.dpo.firstname')}DPO`, 'Justin');
      await fillByLabel(`${t('components.organizations.creation.dpo.lastname')}DPO`, 'Ptipeu');
      await fillByLabel(`${t('components.organizations.creation.dpo.email')}DPO`, 'justin.ptipeu@example.net');

      // then
      assert.strictEqual(organization.name, 'Organisation de Test');
      assert.strictEqual(organization.type, 'SCO');
      assert.strictEqual(organization.externalId, 'Mon identifiant externe');
      assert.strictEqual(organization.administrationTeamId, 'team-2');
      assert.strictEqual(organization.provinceCode, '78');
      assert.strictEqual(organization.countryCode, '99100');
      assert.strictEqual(organization.documentationUrl, 'www.documentation.fr');
      assert.strictEqual(organization.dataProtectionOfficerFirstName, 'Justin');
      assert.strictEqual(organization.dataProtectionOfficerLastName, 'Ptipeu');
      assert.strictEqual(organization.dataProtectionOfficerEmail, 'justin.ptipeu@example.net');
    });
  });
});
