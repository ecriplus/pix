import { fillByLabel, render } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import InformationSectionEdit from 'pix-admin/components/organizations/information-section-edit';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/information-section-edit', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('organization validation', function (hooks) {
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

    test("it should show error message if organization's name is empty", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillIn(screen.getByLabelText('Nom *', { exact: false }), '');

      // then
      assert.dom(screen.getByText('Le nom ne peut pas être vide')).exists();
    });

    test("it should show error message if organization's name is longer than 255 characters", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillIn(screen.getByLabelText('Nom *', { exact: false }), 'a'.repeat(256));

      // then
      assert.dom(screen.getByText('La longueur du nom ne doit pas excéder 255 caractères')).exists();
    });

    test("it should show error message if organization's external id is longer than 255 characters", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel('Identifiant externe', 'a'.repeat(256));

      // then
      assert.dom(screen.getByText("La longueur de l'identifiant externe ne doit pas excéder 255 caractères")).exists();
    });

    test("it should show error message if organization's province code is longer than 255 characters", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel('Département (en 3 chiffres)', 'a'.repeat(256));

      // then
      assert.dom(screen.getByText('La longueur du département ne doit pas excéder 255 caractères')).exists();
    });

    test("it should show error message if organization's data protection officer email is longer than 255 characters", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel('Adresse e-mail du DPO', 'a'.repeat(256));

      // then
      assert.dom(screen.getByText("La longueur de l'email ne doit pas excéder 255 caractères.")).exists();
    });

    test("it should show error message if organization's data protection officer email is not valid", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel('Adresse e-mail du DPO', 'not-valid-email-format');

      // then
      assert.dom(screen.getByText("L'e-mail n'a pas le bon format.")).exists();
    });

    test("it should show error message if organization's email is longer than 255 characters", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel("Adresse e-mail d'activation SCO", 'a'.repeat(256));

      // then
      assert.dom(screen.getByText("La longueur de l'email ne doit pas excéder 255 caractères.")).exists();
    });

    test("it should show error message if organization's email is not valid", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel("Adresse e-mail d'activation SCO", 'not-valid-email-format');

      // then
      assert.dom(screen.getByText("L'e-mail n'a pas le bon format.")).exists();
    });

    test("it should show error message if organization's credit is not valid", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel('Crédits', 'credit');

      // then
      assert.dom(screen.getByText('Le nombre de crédits doit être un nombre supérieur ou égal à 0.')).exists();
    });

    test("it should show error message if organization's documentationUrl is not valid", async function (assert) {
      // given
      const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

      // when
      await fillByLabel('Lien vers la documentation', 'not-valid-url-format');

      // then
      assert.dom(screen.getByText("Le lien n'est pas valide.")).exists();
    });

    module('#features', function () {
      test('should display place management features as deactivated', async function (assert) {
        organization.features = {
          PLACES_MANAGEMENT: {
            active: false,
            params: null,
          },
        };

        const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

        assert.false(
          screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT'))
            .checked,
        );
        assert.notOk(
          screen.queryByLabelText(
            t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT'),
          ),
        );
      });

      test('should display place management features as activated and lockThreshold deactivated', async function (assert) {
        organization.features = {
          PLACES_MANAGEMENT: {
            active: true,
            params: { enableMaximumPlacesLimit: false },
          },
        };

        const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

        assert.true(
          screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT'))
            .checked,
        );
        assert.false(
          screen.getByLabelText(
            t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT'),
          ).checked,
        );
      });

      test('should display place management features as activated  and lockThreshold activated', async function (assert) {
        organization.features = {
          PLACES_MANAGEMENT: {
            active: true,
            params: { enableMaximumPlacesLimit: true },
          },
        };

        const screen = await render(<template><InformationSectionEdit @organization={{organization}} /></template>);

        assert.true(
          screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT'))
            .checked,
        );
        assert.true(
          screen.getByLabelText(
            t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT'),
          ).checked,
        );
      });
    });
  });
});
