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
      assert.dom(screen.getByRole('textbox', { name: 'Nom *' })).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Lien vers la documentation' })).exists();
      assert.dom(screen.getByText("Sélectionner un type d'organisation")).exists();
      assert.ok(screen.getByRole('textbox', { name: 'Identifiant externe' }));
      assert
        .dom(screen.getByText(t('components.organizations.creation.administration-team.selector.placeholder')))
        .exists();
      assert.ok(screen.getByRole('textbox', { name: 'Département (en 3 chiffres)' }));
      assert.ok(screen.getByLabelText(`${t('components.organizations.creation.country.selector.label')} *`));
      assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
      assert.dom(screen.getByRole('button', { name: 'Ajouter' })).exists();
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
      await fillByLabel('Nom *', 'Organisation de Test');

      click(screen.getByRole('button', { name: `Sélectionner un type d'organisation *` }));
      await screen.findByRole('listbox');
      click(screen.getByRole('option', { name: 'Établissement scolaire' }));

      await fillByLabel(t('components.organizations.creation.external-id'), 'Mon identifiant externe');

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

      await fillByLabel('Lien vers la documentation', 'www.documentation.fr');

      await fillByLabel('Crédits', 120);

      await fillByLabel('Prénom du DPO', 'Justin');
      await fillByLabel('Nom du DPO', 'Ptipeu');
      await fillByLabel('Adresse e-mail du DPO', 'justin.ptipeu@example.net');

      // then
      assert.strictEqual(organization.name, 'Organisation de Test');
      assert.strictEqual(organization.type, 'SCO');
      assert.strictEqual(organization.externalId, 'Mon identifiant externe');
      assert.strictEqual(organization.administrationTeamId, 'team-2');
      assert.strictEqual(organization.provinceCode, '78');
      assert.strictEqual(organization.countryCode, '99100');
      assert.strictEqual(organization.documentationUrl, 'www.documentation.fr');
      assert.strictEqual(organization.credit, 120);
      assert.strictEqual(organization.dataProtectionOfficerFirstName, 'Justin');
      assert.strictEqual(organization.dataProtectionOfficerLastName, 'Ptipeu');
      assert.strictEqual(organization.dataProtectionOfficerEmail, 'justin.ptipeu@example.net');
    });
  });
});
