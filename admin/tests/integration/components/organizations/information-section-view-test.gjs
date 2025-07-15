import { render } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import InformationSectionView from 'pix-admin/components/organizations/information-section-view';
import ENV from 'pix-admin/config/environment';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/information-section-view', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when user has access', function (hooks) {
    let features;
    let originalDashboardUrl;

    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
      features = {
        IS_MANAGING_STUDENTS: { active: false },
        SHOW_NPS: { active: false, params: { formNPSUrl: 'plop' } },
        SHOW_SKILLS: { active: false },
        LEARNER_IMPORT: { active: false },
        MULTIPLE_SENDING_ASSESSMENT: { active: false },
        PLACES_MANAGEMENT: { active: false },
        COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: false },
        ATTESTATIONS_MANAGEMENT: { active: false },
      };
      originalDashboardUrl = ENV.APP.ORGANIZATION_DASHBOARD_URL;
    });

    hooks.afterEach(function () {
      ENV.APP.ORGANIZATION_DASHBOARD_URL = originalDashboardUrl;
    });

    test('it renders general information about organization', async function (assert) {
      // given
      class OidcIdentityProvidersStub extends Service {
        list = [{ organizationName: 'super-sso', code: 'IDP' }];
      }
      this.owner.register('service:oidc-identity-providers', OidcIdentityProvidersStub);

      const organization = {
        type: 'SUP',
        name: 'SUPer Orga',
        credit: 350,
        documentationUrl: 'https://pix.fr',
        features: {
          SHOW_SKILLS: { active: true },
        },
        createdBy: 1,
        createdAtFormattedDate: '02/09/2022',
        creatorFullName: 'Gilles Parbal',
        identityProviderForCampaigns: 'IDP',
        dataProtectionOfficerFullName: 'Justin Ptipeu',
        dataProtectionOfficerEmail: 'justin.ptipeu@example.net',
      };

      // when
      const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

      // then
      assert.dom(screen.getByRole('heading', { name: 'SUPer Orga' })).exists();
      assert.dom(screen.getByText('Type').nextElementSibling).hasText('SUP');
      assert.dom(screen.getByText('Nom du DPO').nextElementSibling).hasText('Justin Ptipeu');
      assert.dom(screen.getByText('Adresse e-mail du DPO').nextElementSibling).hasText('justin.ptipeu@example.net');
      assert.dom(screen.getByText('Créée par').nextElementSibling).hasText('Gilles Parbal (1)');
      assert.dom(screen.getByText('Créée le').nextElementSibling).hasText('02/09/2022');
      assert
        .dom(
          screen.getByLabelText(
            `${t('components.organizations.information-section-view.features.SHOW_SKILLS')} : ${t('common.words.yes')}`,
          ),
        )
        .exists();
      assert.dom(screen.getByText('Crédits').nextElementSibling).hasText('350');
      assert.dom(screen.getByText('Lien vers la documentation').nextElementSibling).hasText('https://pix.fr');
      assert.dom(screen.getByText('SSO').nextElementSibling).hasText('super-sso');
    });

    test('it renders GAR identity provider correctly', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const oidcPartner = store.createRecord('oidc-identity-provider', {
        code: 'OIDC',
        organizationName: 'a super orga',
        shouldCloseSession: false,
        source: 'idp',
      });
      class OidcIdentityProvidersStub extends Service {
        list = [oidcPartner];
      }
      this.owner.register('service:oidc-identity-providers', OidcIdentityProvidersStub);

      const organization = {
        type: 'SUP',
        name: 'SUPer Orga',
        identityProviderForCampaigns: 'GAR',
        tags: [],
        children: [],
      };

      // when
      const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

      // then
      assert.dom(screen.getByText('SSO').nextElementSibling).hasText('GAR');
    });

    test('it generates correct external dashboard URL', async function (assert) {
      // given
      ENV.APP.ORGANIZATION_DASHBOARD_URL = 'https://metabase.pix.fr/dashboard/137/?id=';
      const organization = {
        id: 1,
        name: 'Test Organization',
        tags: [],
        children: [],
      };

      // when
      const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

      // then
      const dashboardLink = screen.getByRole('link', { name: 'Tableau de bord' });
      assert.dom(dashboardLink).hasAttribute('href', 'https://metabase.pix.fr/dashboard/137/?id=1');
    });

    module('data protection officer information', function () {
      test('it renders complete DPO information', async function (assert) {
        // given
        class OidcIdentityProvidersStub extends Service {
          list = [{ organizationName: 'super-sso', code: 'IDP' }];
        }
        this.owner.register('service:oidc-identity-providers', OidcIdentityProvidersStub);

        const organization = {
          type: 'SUP',
          name: 'SUPer Orga',
          credit: 350,
          documentationUrl: 'https://pix.fr',
          createdBy: 1,
          createdAtFormattedDate: '02/09/2022',
          creatorFullName: 'Gilles Parbal',
          identityProviderForCampaigns: 'IDP',
          dataProtectionOfficerFullName: 'Justin Ptipeu',
          dataProtectionOfficerEmail: 'justin.ptipeu@example.net',
        };

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText('Nom du DPO').nextElementSibling).hasText('Justin Ptipeu');
        assert.dom(screen.getByText('Adresse e-mail du DPO').nextElementSibling).hasText('justin.ptipeu@example.net');
      });

      test('it renders without DPO information', async function (assert) {
        // given
        class OidcIdentityProvidersStub extends Service {
          list = [{ organizationName: 'super-sso', code: 'IDP' }];
        }
        this.owner.register('service:oidc-identity-providers', OidcIdentityProvidersStub);

        const organization = {
          type: 'SUP',
          name: 'SUPer Orga',
          credit: 350,
          documentationUrl: 'https://pix.fr',
          features: { SHOW_SKILLS: { active: true } },
          createdBy: 1,
          createdAtFormattedDate: '02/09/2022',
          creatorFullName: 'Gilles Parbal',
          identityProviderForCampaigns: 'IDP',
          dataProtectionOfficerFullName: '',
          dataProtectionOfficerEmail: '',
        };

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText('Nom du DPO').nextElementSibling).hasText('');
        assert.dom(screen.getByText('Adresse e-mail du DPO').nextElementSibling).hasText('');
      });
    });

    test('it renders edit and archive button', async function (assert) {
      // given
      const organization = EmberObject.create({ type: 'SUP', name: 'SUPer Orga' });

      // when
      const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: 'Modifier' })).exists();
      assert.dom(screen.getByRole('button', { name: "Archiver l'organisation" })).exists();
    });

    test('it should display empty documentation link message', async function (assert) {
      // given
      const organization = EmberObject.create({});

      // when
      const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

      // then
      assert.dom(screen.getByText('Lien vers la documentation').nextElementSibling).hasText('Non spécifié');
    });

    test('it should display tags', async function (assert) {
      // given
      const organization = EmberObject.create({
        tags: [
          { id: 1, name: 'CFA' },
          { id: 2, name: 'PRIVE' },
          { id: 3, name: 'AGRICULTURE' },
        ],
      });

      // when
      const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

      // then
      assert.dom(screen.getByText('CFA')).exists();
      assert.dom(screen.getByText('PRIVE')).exists();
      assert.dom(screen.getByText('AGRICULTURE')).exists();
    });

    module('when organization is archived', function () {
      test('it should display who archived it', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const archivedAt = new Date('2022-02-22');
        const organization = store.createRecord('organization', { archivistFullName: 'Rob Lochon', archivedAt });

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText('Archivée le 22/02/2022 par Rob Lochon.')).exists();
      });
    });

    module('when organization is parent', function () {
      test('it should display parent label', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const child = store.createRecord('organization', {
          type: 'SCO',
          features,
        });
        const organization = store.createRecord('organization', {
          type: 'SCO',
          features,
          children: [child],
        });

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText('Organisation mère')).exists();
      });
    });

    module('when organization is child', function () {
      test('it displays child label and parent organization name', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const parentOrganization = store.createRecord('organization', {
          id: 5,
          type: 'SCO',
          features,
        });
        const organization = store.createRecord('organization', {
          type: 'SCO',
          features,
          parentOrganizationId: parentOrganization.id,
          parentOrganizationName: 'Shibusen',
        });

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText('Organisation fille de')).exists();
        assert.dom(screen.getByRole('link', { name: 'Shibusen' })).exists();
      });
    });

    module('when organization is neither parent nor children', function () {
      test('it displays no organization network label', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const organization = store.createRecord('organization', {
          type: 'SCO',
          name: 'notParent',
          features,
        });

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert.dom(screen.queryByText('Organisation mère')).doesNotExist();
      });
    });

    module('When organization is SCO or SUP', function () {
      const organization = EmberObject.create({ type: 'SCO', isOrganizationSCO: true });

      test('it should display "Oui" if it is managing students', async function (assert) {
        // given
        organization.features = {
          IS_MANAGING_STUDENTS: { active: true },
        };

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        assert
          .dom(
            screen.getByLabelText(
              `${t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS')} : ${t(
                'common.words.yes',
              )}`,
            ),
          )
          .exists();
      });

      test('it should display "Non" if managing students is false', async function (assert) {
        // given
        organization.features = {
          IS_MANAGING_STUDENTS: { active: false },
        };

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert
          .dom(
            screen.getByLabelText(
              `${t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS')} : ${t(
                'common.words.no',
              )}`,
            ),
          )
          .exists();
      });
    });

    module('When organization is not SCO', function () {
      const organization = EmberObject.create({ type: 'PRO', isOrganizationSCO: false, isOrganizationSUP: false });

      test('it should not display if it is managing students', async function (assert) {
        // given
        organization.features = {
          IS_MANAGING_STUDENTS: { active: false },
        };

        // when
        const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

        // then
        assert.dom(screen.queryByRole('checkbox', { name: 'Gestion d’élèves/étudiants' })).doesNotExist();
      });
    });

    module('Features', function () {
      module('Compute certificability', function () {
        module('when compute certificability is true', function () {
          test('should display text with yes', async function (assert) {
            // given
            const organization = EmberObject.create({
              features: {
                COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: true },
              },
            });

            // when
            const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);
            // then
            assert.ok(
              screen.getByLabelText(
                `${t(
                  'components.organizations.information-section-view.features.COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY',
                )} : ${t('common.words.yes')}`,
              ),
            );
          });
        });

        module('when compute certificability is false', function () {
          test('should display text with no', async function (assert) {
            // given
            const organization = EmberObject.create({
              features: {
                COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: false },
              },
            });

            // when
            const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

            // then
            assert.ok(
              screen.getByLabelText(
                `${t(
                  'components.organizations.information-section-view.features.COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY',
                )} : ${t('common.words.no')}`,
              ),
            );
          });
        });
      });

      module('Attestations', function () {
        module('when attestations is enabled', function () {
          test('should display text with which attestation is activated', async function (assert) {
            // given
            const organization = EmberObject.create({
              features: {
                ATTESTATIONS_MANAGEMENT: { active: true },
              },
            });

            // when
            const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);
            // then
            assert.ok(
              screen.getByLabelText(
                `${t('components.organizations.information-section-view.features.ATTESTATIONS_MANAGEMENT')} : ${t(
                  'common.words.yes',
                )}`,
              ),
            );
          });
        });

        module('when attestations is not enabled', function () {
          test('should display text with no', async function (assert) {
            // given
            const organization = EmberObject.create({
              features: {
                ATTESTATIONS_MANAGEMENT: { active: false },
              },
            });

            // when
            const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);
            // then
            assert.ok(
              screen.getByLabelText(
                `${t('components.organizations.information-section-view.features.ATTESTATIONS_MANAGEMENT')} : ${t(
                  'common.words.no',
                )}`,
              ),
            );
          });
        });
      });

      module('Net Promoter Score', function () {
        module('when NPS is enabled', function () {
          test('should display a link to formNPSUrl', async function (assert) {
            // given
            const NPSUrl = 'http://example.net';
            const organization = EmberObject.create({
              features: {
                SHOW_NPS: { active: true, params: { formNPSUrl: NPSUrl } },
              },
            });

            // when
            const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

            // then
            assert.ok(
              screen.getByLabelText(
                `${t('components.organizations.information-section-view.features.SHOW_NPS')} : ${t(
                  'common.words.yes',
                )}`,
              ),
            );
            assert.ok(screen.getByRole('link', { name: NPSUrl }));
          });
        });

        module('when NPS is not enabled', function () {
          test('should display text with no and not the link', async function (assert) {
            // given
            const NPSUrl = 'http://example.net';
            const organization = EmberObject.create({
              features: {
                SHOW_NPS: { active: false, params: { formNPSUrl: NPSUrl } },
              },
            });

            // when
            const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

            // then
            assert.ok(
              screen.getByLabelText(
                `${t('components.organizations.information-section-view.features.SHOW_NPS')} : ${t('common.words.no')}`,
              ),
            );
            assert.notOk(screen.queryByRole('link', { name: NPSUrl }));
          });
        });
      });
    });
  });

  module('when user does not have access', function () {
    test('it should not allow to edit or archive an organization', async function (assert) {
      // given
      const organization = EmberObject.create({ name: 'Boba Fett' });

      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = false;
      }
      this.owner.register('service:access-control', AccessControlStub);

      // when
      const screen = await render(<template><InformationSectionView @organization={{organization}} /></template>);

      // then
      assert.dom(screen.queryByRole('button', { name: 'Modifier' })).doesNotExist();
      assert.dom(screen.queryByRole('button', { name: "Archiver l'organisation" })).doesNotExist();
    });
  });
});
