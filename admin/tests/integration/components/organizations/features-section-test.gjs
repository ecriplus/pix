import { render, waitForElementToBeRemoved, within } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import FeaturesSection from 'pix-admin/components/organizations/features-section';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/features-section', function (hooks) {
  setupIntlRenderingTest(hooks);

  let findAllStub, store, onSubmitStub;

  hooks.beforeEach(function () {
    onSubmitStub = sinon.stub();
    store = this.owner.lookup('service:store');
    findAllStub = sinon.stub(store, 'findAll');
    findAllStub
      .withArgs('organization-learner-import-format')
      .resolves([
        store.createRecord('organization-learner-import-format', { id: '123', name: 'GENERIC' }),
        store.createRecord('organization-learner-import-format', { id: '456', name: 'ONDE' }),
      ]);

    class AccessControlStub extends Service {
      hasAccessToOrganizationActionsScope = false;
    }
    this.owner.register('service:access-control', AccessControlStub);
  });

  module('view mode', function () {
    module('When organization is SCO or SUP', function () {
      const organization = EmberObject.create({ type: 'SCO', isOrganizationSCO: true });
      const onSubmit = onSubmitStub;

      test('it should display "Oui" if it is managing students', async function (assert) {
        // given
        organization.features = {
          IS_MANAGING_STUDENTS: { active: true },
        };

        // when
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );

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
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );

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

      test('it should not display a checkbox for IS_MANAGING_STUDENTS', async function (assert) {
        // given
        organization.features = {
          IS_MANAGING_STUDENTS: { active: false },
        };
        const onSubmit = onSubmitStub;

        // when
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );

        // then
        assert
          .dom(
            screen.queryByRole('checkbox', {
              name: t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS'),
            }),
          )
          .doesNotExist();
      });
    });

    module('Compute certificability', function () {
      module('when compute certificability is true', function () {
        test('should display text with yes', async function (assert) {
          // given
          const onSubmit = onSubmitStub;
          const organization = EmberObject.create({
            features: {
              COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: true },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );
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
          const onSubmit = onSubmitStub;
          const organization = EmberObject.create({
            features: {
              COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: false },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );

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
          const onSubmit = onSubmitStub;
          const organization = EmberObject.create({
            features: {
              ATTESTATIONS_MANAGEMENT: { active: true, params: ['PARENTHOOD'] },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );
          // then
          assert.ok(
            screen.getByLabelText(
              `${t('components.organizations.information-section-view.features.ATTESTATIONS_MANAGEMENT')} : ${t(
                'common.words.yes',
              )}`,
            ),
          );

          assert.ok(
            screen.getByText(
              `${t('components.organizations.information-section-view.features.ATTESTATIONS_MANAGEMENT')} : ${t(
                'components.organizations.information-section-view.features.attestation-list.PARENTHOOD',
              )}`,
            ),
          );
        });
      });

      module('when attestations is not enabled', function () {
        test('should display text with no', async function (assert) {
          // given
          const onSubmit = onSubmitStub;
          const organization = EmberObject.create({
            features: {
              ATTESTATIONS_MANAGEMENT: { active: false },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );
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

    module('Places', function () {
      module('when places in pixOrga is enabled', function () {
        test('should display block enabled message, if this features is enabled', async function (assert) {
          // given
          const onSubmit = onSubmitStub;
          const organization = EmberObject.create({
            features: {
              PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: true } },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );
          // then
          assert.ok(
            screen.getByText(
              `${t('components.organizations.information-section-view.features.PLACES_MANAGEMENT')} : ${t(
                'components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.enabled',
              )}`,
            ),
          );
        });
        test('should display block disabled message, if this features is not enabled', async function (assert) {
          // given
          const onSubmit = onSubmitStub;
          const organization = EmberObject.create({
            features: {
              PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: false } },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );
          // then
          assert.ok(
            screen.getByText(
              `${t('components.organizations.information-section-view.features.PLACES_MANAGEMENT')} : ${t(
                'components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.disabled',
              )}`,
            ),
          );
        });
      });

      module('when places in pixOrga is not enabled', function () {
        test('should display label with no', async function (assert) {
          // given
          const onSubmit = onSubmitStub;
          const organization = EmberObject.create({
            features: {
              PLACES_MANAGEMENT: { active: false },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );
          // then
          assert.ok(
            screen.getByLabelText(
              `${t('components.organizations.information-section-view.features.PLACES_MANAGEMENT')} : ${t(
                'common.words.no',
              )}`,
            ),
          );
        });
      });
    });

    module('CAMPAIGN_WITHOUT_USER_PROFILE', function () {
      test('should display block enabled message, if this features is enabled', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          features: {
            CAMPAIGN_WITHOUT_USER_PROFILE: { active: true, params: null },
          },
        });

        // when
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        // then
        assert.ok(
          screen.getByText(
            t('components.organizations.information-section-view.features.CAMPAIGN_WITHOUT_USER_PROFILE'),
          ),
        );
      });

      test('should display block disabled message, if this features is not enabled', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          features: {
            CAMPAIGN_WITHOUT_USER_PROFILE: { active: false },
          },
        });

        // when
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );

        // then
        assert.ok(
          screen.getByLabelText(
            `${t(
              'components.organizations.information-section-view.features.CAMPAIGN_WITHOUT_USER_PROFILE',
            )} : ${t('common.words.no')}`,
          ),
        );
      });
    });

    module('Net Promoter Score', function () {
      module('when NPS is enabled', function () {
        test('should display a link to formNPSUrl', async function (assert) {
          // given
          const onSubmit = onSubmitStub;
          const NPSUrl = 'http://example.net';
          const organization = EmberObject.create({
            features: {
              SHOW_NPS: { active: true, params: { formNPSUrl: NPSUrl } },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );

          // then
          assert.ok(
            screen.getByLabelText(
              `${t('components.organizations.information-section-view.features.SHOW_NPS')} : ${t('common.words.yes')}`,
            ),
          );
          assert.ok(screen.getByRole('link', { name: NPSUrl }));
        });
      });

      module('when NPS is not enabled', function () {
        test('should display text with no and not the link', async function (assert) {
          // given
          const onSubmit = onSubmitStub;
          const NPSUrl = 'http://example.net';
          const organization = EmberObject.create({
            features: {
              SHOW_NPS: { active: false, params: { formNPSUrl: NPSUrl } },
            },
          });

          // when
          const screen = await render(
            <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
          );

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

  module('edit mode', function (hooks) {
    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
    });

    module('PLACES_MANAGEMENT', function () {
      test('should display features as deactivated', async function (assert) {
        //given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          features: {
            PLACES_MANAGEMENT: { active: false, params: null },
          },
        });

        // when
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        // then
        assert.false(
          screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT'))
            .checked,
        );
        assert.notOk(
          screen.queryByLabelText(
            t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.label'),
          ),
        );
      });

      test('should display features as activated and lockThreshold deactivated', async function (assert) {
        const onSubmit = onSubmitStub;

        const organization = EmberObject.create({
          features: {
            PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: false } },
          },
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        assert.true(
          screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT'))
            .checked,
        );
        assert.false(
          screen.getByLabelText(
            t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.label'),
          ).checked,
        );
      });

      test('should display features as activated and lockThreshold activated', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          features: {
            PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: true } },
          },
        });

        // when
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        // then
        assert.true(
          screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT'))
            .checked,
        );
        assert.true(
          screen.getByLabelText(
            t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.label'),
          ).checked,
        );
      });
    });

    module('CAMPAIGN_WITHOUT_USER_PROFILE', function () {
      test('should display features as deactivated', async function (assert) {
        // given
        const onSubmit = onSubmitStub;

        const organization = EmberObject.create({
          features: { CAMPAIGN_WITHOUT_USER_PROFILE: { active: false, params: null } },
        });

        // when
        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        // then
        assert.false(
          screen.getByLabelText(
            t('components.organizations.information-section-view.features.CAMPAIGN_WITHOUT_USER_PROFILE'),
          ).checked,
        );
      });

      test('should display features as activated', async function (assert) {
        // given
        const onSubmit = onSubmitStub;

        const organization = EmberObject.create({
          features: { CAMPAIGN_WITHOUT_USER_PROFILE: { active: true, params: null } },
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        assert.true(
          screen.getByLabelText(
            t('components.organizations.information-section-view.features.CAMPAIGN_WITHOUT_USER_PROFILE'),
          ).checked,
        );
      });
    });

    module('when Learner Import is not selected', function () {
      test('it should hide IS_MANAGING_STUDENTS feature for non SCO organization', async function (assert) {
        // given
        const onSubmit = onSubmitStub;

        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: false,
          isLearnerImportEnabled: true,
          features: {},
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        assert.notOk(
          screen.queryByRole('checkbox', {
            name: `${t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS')}`,
          }),
        );
      });

      test('it should hide LEARNER IMPORT feature when there is no import format available', async function (assert) {
        findAllStub.withArgs('organization-learner-import-format').resolves([]);
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: false,
          features: {},
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        assert.notOk(
          screen.queryByRole('checkbox', {
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
      });

      test('should display a modal when user activate learner import', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: false,
          features: {},
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        // when
        await click(
          screen.getByRole('checkbox', {
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
        const modale = await screen.findByRole('dialog');

        assert.ok(
          within(modale).getByRole('heading', {
            level: 1,
            name: t('components.organizations.editing.organization-learner-import-format.dialog.title'),
          }),
        );
      });

      test('should unchecked import feature when user close dialog', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: false,
          features: {},
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        // when
        await click(
          screen.getByRole('checkbox', {
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
        const modale = await screen.findByRole('dialog');
        await click(within(modale).getByRole('button', { name: t('common.actions.close') }));
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

        assert.ok(
          screen.getByRole('checkbox', {
            checked: false,
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
      });

      test('should close dialog feature and leave import feature active', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: false,
          features: {},
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        // when
        await click(
          screen.getByRole('checkbox', {
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
        const modale = await screen.findByRole('dialog');
        await click(
          within(modale).getByRole('checkbox', {
            name: t('components.organizations.editing.organization-learner-import-format.dialog.confirmation'),
          }),
        );
        await click(within(modale).getByRole('button', { name: t('common.actions.confirm') }));
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

        assert.ok(
          screen.getByRole('checkbox', {
            checked: true,
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
      });
    });

    module('when Learner Import is active', function () {
      test('it should hide IS_MANAGING_STUDENTS feature for SCO organization', async function (assert) {
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: true,
          isLearnerImportEnabled: true,
          features: { LEARNER_IMPORT: { active: true, params: { name: 'GENERIC' } } },
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        assert.notOk(
          screen.queryByRole('checkbox', {
            name: `${t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS')}`,
          }),
        );
      });

      test('it should display selected import format', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: false,
          isLearnerImportEnabled: true,
          features: { LEARNER_IMPORT: { active: true, params: { name: 'ONDE' } } },
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        assert.ok(
          screen.getByRole('checkbox', {
            checked: true,
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
        const select = screen.getByRole('button', { name: /Format d'import/ });
        assert.ok(within(select).getByText('ONDE'));
      });

      test('it should hide the select import format', async function (assert) {
        // given
        const onSubmit = onSubmitStub;
        const organization = EmberObject.create({
          id: 1,
          name: 'Organization',
          isOrganizationSCO: false,
          features: { LEARNER_IMPORT: { active: true, params: { name: 'ONDE' } } },
        });

        const screen = await render(
          <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
        );
        await click(screen.getByRole('button', { name: t('common.actions.edit') }));

        // when
        await click(
          screen.getByRole('checkbox', {
            checked: true,
            name: `${t('components.organizations.information-section-view.features.LEARNER_IMPORT')}`,
          }),
        );
        assert.notOk(
          screen.queryByLabelText(
            t('components.organizations.editing.organization-learner-import-format.selector.label'),
          ),
        );
      });
    });
  });
});
