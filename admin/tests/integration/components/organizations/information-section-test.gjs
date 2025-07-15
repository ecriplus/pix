import { clickByName, fillByLabel, render } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { click, fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import InformationSection from 'pix-admin/components/organizations/information-section';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/information-section', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when editing organization', function (hooks) {
    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
    });

    const organization = EmberObject.create({
      id: 1,
      name: 'Organization SCO',
      externalId: 'VELIT',
      provinceCode: 'h50',
      email: 'sco.generic.account@example.net',
      isOrganizationSCO: true,
      credit: 0,
      documentationUrl: 'https://pix.fr/',
      features: {},
    });

    test('it should toggle edition mode on click to edit button', async function (assert) {
      // given
      const screen = await render(<template><InformationSection @organization={{organization}} /></template>);

      // when
      await clickByName('Modifier');

      // then
      assert.dom(screen.getByRole('textbox', { name: 'Nom *' })).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Identifiant externe' })).exists();
      assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
      assert.dom(screen.getByRole('button', { name: 'Enregistrer' })).exists();
    });

    test('it should toggle display mode on click to cancel button', async function (assert) {
      // given
      const screen = await render(<template><InformationSection @organization={{organization}} /></template>);
      await clickByName('Modifier');

      // when
      await clickByName('Annuler');

      // then
      assert.dom(screen.getByRole('heading', { name: 'Organization SCO' })).exists();
      assert.dom(screen.getByRole('button', { name: 'Modifier' })).exists();
      assert.dom(screen.getByRole('button', { name: "Archiver l'organisation" })).exists();
    });

    test('it should revert changes on click to cancel button', async function (assert) {
      // given
      const screen = await render(<template><InformationSection @organization={{organization}} /></template>);

      await clickByName('Modifier');

      await fillIn(screen.getByLabelText('Nom *', { exact: false }), 'new name');
      await fillByLabel('Identifiant externe', 'new externalId');
      await fillByLabel('Département (en 3 chiffres)', 'new provinceCode');
      await clickByName("Gestion d'élèves/étudiants");
      await fillByLabel('Lien vers la documentation', 'new documentationUrl');
      await clickByName("Affichage des acquis dans l'export de résultats");
      await clickByName("Envoi multiple sur les campagnes d'évaluation");

      // when
      await clickByName('Annuler');

      // then
      assert.dom(screen.getByRole('heading', { name: organization.name })).exists();
      assert.dom(screen.getByText('Identifiant externe').nextElementSibling).hasText(organization.externalId);
      assert.dom(screen.getByText('Département').nextElementSibling).hasText(organization.provinceCode);
      assert.dom(screen.getByRole('link', { name: organization.documentationUrl })).exists();
      assert
        .dom(
          screen.getByLabelText(
            `${t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS')} : ${t(
              'common.words.no',
            )}`,
          ),
        )
        .exists();
      assert
        .dom(
          screen.getByLabelText(
            `${t('components.organizations.information-section-view.features.SHOW_SKILLS')} : ${t('common.words.no')}`,
          ),
        )
        .exists();
      assert
        .dom(
          screen.getByLabelText(
            `${t('components.organizations.information-section-view.features.MULTIPLE_SENDING_ASSESSMENT')} : ${t(
              'common.words.no',
            )}`,
          ),
        )
        .exists();
    });

    test('it should submit the form if there is no error', async function (assert) {
      // given
      const onSubmit = () => {};
      const store = this.owner.lookup('service:store');
      const oidcIdentityProvider1 = store.createRecord('oidc-identity-provider', {
        code: 'OIDC-1',
        organizationName: 'organization 1',
        shouldCloseSession: false,
        source: 'source1',
      });
      const oidcIdentityProvider2 = store.createRecord('oidc-identity-provider', {
        code: 'OIDC-2',
        organizationName: 'organization 2',
        shouldCloseSession: false,
        source: 'source2',
      });
      class OidcIdentittyProvidersStub extends Service {
        list = [oidcIdentityProvider1, oidcIdentityProvider2];
      }
      this.owner.register('service:oidcIdentityProviders', OidcIdentittyProvidersStub);

      const screen = await render(
        <template><InformationSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );
      await clickByName('Modifier');

      await fillIn(screen.getByLabelText('Nom *', { exact: false }), 'new name');
      await fillByLabel('Identifiant externe', 'new externalId');
      await fillByLabel('Département (en 3 chiffres)', '');
      await fillByLabel('Crédits', 50);
      await clickByName("Gestion d'élèves/étudiants");
      await fillByLabel('Lien vers la documentation', 'https://pix.fr/');
      await clickByName('SSO');
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'organization 2' }));
      await clickByName("Affichage des acquis dans l'export de résultats");
      await clickByName("Envoi multiple sur les campagnes d'évaluation");
      await clickByName('Affichage de la page Places sur PixOrga');

      // when
      await clickByName('Enregistrer');

      // then
      assert.dom(screen.getByRole('heading', { name: 'new name' })).exists();
      assert.dom(screen.getByText('Identifiant externe').nextElementSibling).hasText('new externalId');
      assert.dom(screen.queryByText('Département')).doesNotExist();
      assert.dom(screen.getByText('Crédits').nextElementSibling).hasText('50');
      assert
        .dom(
          screen.getByLabelText(
            `${t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS')} : ${t(
              'common.words.yes',
            )}`,
          ),
        )
        .exists();
      assert.dom(screen.getByRole('link', { name: 'https://pix.fr/' })).exists();
      assert.dom(screen.getByText('SSO').nextElementSibling).hasText('organization 2');
      assert
        .dom(
          screen.getByLabelText(
            `${t('components.organizations.information-section-view.features.MULTIPLE_SENDING_ASSESSMENT')} : ${t(
              'common.words.yes',
            )}`,
          ),
        )
        .exists();
      assert
        .dom(
          screen.getByLabelText(
            `${t('components.organizations.information-section-view.features.PLACES_MANAGEMENT')} : ${t(
              'common.words.yes',
            )}`,
          ),
        )
        .exists();
    });
  });
});
