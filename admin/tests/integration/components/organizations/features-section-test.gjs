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

  module('access control', function () {
    test('it shows save and cancel buttons when user has access', async function (assert) {
      // given
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({ features: {} });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.dom(screen.getByRole('button', { name: t('common.actions.save') })).exists();
      assert.dom(screen.getByRole('button', { name: t('common.actions.cancel') })).exists();
    });

    test('it hides save and cancel buttons when user has no access', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({ features: {} });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.dom(screen.queryByRole('button', { name: t('common.actions.save') })).doesNotExist();
      assert.dom(screen.queryByRole('button', { name: t('common.actions.cancel') })).doesNotExist();
    });

    test('it disables all checkboxes when user has no access', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: true,
        features: {
          PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: false } },
          CAMPAIGN_WITHOUT_USER_PROFILE: { active: true },
          IS_MANAGING_STUDENTS: { active: true },
        },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      const checkboxes = screen.getAllByRole('checkbox');
      assert.true(checkboxes.length > 0);
      assert.true(
        checkboxes.every((checkbox) => checkbox.disabled),
        'all checkboxes should be disabled',
      );
    });
  });

  module('IS_MANAGING_STUDENTS', function () {
    test('it shows checked checkbox for SCO organization with active feature', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        type: 'SCO',
        isOrganizationSCO: true,
        features: { IS_MANAGING_STUDENTS: { active: true } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.true(
        screen.getByLabelText(t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS'))
          .checked,
      );
    });

    test('it shows unchecked checkbox for SCO organization with inactive feature', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        type: 'SCO',
        isOrganizationSCO: true,
        features: { IS_MANAGING_STUDENTS: { active: false } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.false(
        screen.getByLabelText(t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS'))
          .checked,
      );
    });

    test('it shows a disabled IS_MANAGING_STUDENTS checkbox for non SCO/SUP organization', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        type: 'PRO',
        isOrganizationSCO: false,
        isOrganizationSUP: false,
        features: { IS_MANAGING_STUDENTS: { active: false } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert
        .dom(
          screen.getByRole('checkbox', {
            name: t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS'),
          }),
        )
        .isDisabled();
    });
  });

  module('COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY', function () {
    test('it shows a disabled checked checkbox when feature is active', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: true } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      const checkbox = screen.getByLabelText(
        t('components.organizations.information-section-view.features.COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY'),
      );
      assert.true(checkbox.checked);
      assert.true(checkbox.disabled);
    });

    test('it shows a disabled unchecked checkbox when feature is inactive', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY: { active: false } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      const checkbox = screen.getByLabelText(
        t('components.organizations.information-section-view.features.COMPUTE_ORGANIZATION_LEARNER_CERTIFICABILITY'),
      );
      assert.false(checkbox.checked);
      assert.true(checkbox.disabled);
    });
  });

  module('ATTESTATIONS_MANAGEMENT', function () {
    test('it shows a disabled checked checkbox when feature is active', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { ATTESTATIONS_MANAGEMENT: { active: true, params: ['PARENTHOOD'] } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      const checkbox = screen.getByLabelText(
        t('components.organizations.information-section-view.features.ATTESTATIONS_MANAGEMENT'),
      );
      assert.true(checkbox.checked);
      assert.true(checkbox.disabled);
    });

    test('it shows a disabled unchecked checkbox when feature is inactive', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { ATTESTATIONS_MANAGEMENT: { active: false } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      const checkbox = screen.getByLabelText(
        t('components.organizations.information-section-view.features.ATTESTATIONS_MANAGEMENT'),
      );
      assert.false(checkbox.checked);
      assert.true(checkbox.disabled);
    });
  });

  module('SHOW_NPS', function () {
    test('it shows a disabled checked checkbox when NPS is active', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { SHOW_NPS: { active: true, params: { formNPSUrl: 'http://example.net' } } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      const checkbox = screen.getByLabelText(t('components.organizations.information-section-view.features.SHOW_NPS'));
      assert.true(checkbox.checked);
      assert.true(checkbox.disabled);
    });

    test('it shows a disabled unchecked checkbox when NPS is inactive', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { SHOW_NPS: { active: false, params: { formNPSUrl: 'http://example.net' } } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      const checkbox = screen.getByLabelText(t('components.organizations.information-section-view.features.SHOW_NPS'));
      assert.false(checkbox.checked);
      assert.true(checkbox.disabled);
    });
  });

  module('PLACES_MANAGEMENT', function (hooks) {
    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
    });

    test('it shows unchecked checkbox and no sub-checkbox when feature is inactive', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { PLACES_MANAGEMENT: { active: false, params: null } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.false(
        screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT'))
          .checked,
      );
      const subCheckbox = screen.getByLabelText(
        t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.label'),
      );
      assert.true(subCheckbox.disabled);
    });

    test('it shows checked checkbox and unchecked sub-checkbox when feature is active without limit', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: false } } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
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

    test('it shows checked checkbox and checked sub-checkbox when feature is active with limit', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: true } } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

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

    test('it unchecks the limit sub-checkbox when PLACES_MANAGEMENT is unchecked', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { PLACES_MANAGEMENT: { active: true, params: { enableMaximumPlacesLimit: true } } },
      });

      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // when
      await click(
        screen.getByLabelText(t('components.organizations.information-section-view.features.PLACES_MANAGEMENT')),
      );

      // then
      assert.false(
        screen.getByLabelText(
          t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.label'),
        ).checked,
      );
    });
  });

  module('CAMPAIGN_WITHOUT_USER_PROFILE', function (hooks) {
    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
    });

    test('it shows unchecked checkbox when feature is inactive', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { CAMPAIGN_WITHOUT_USER_PROFILE: { active: false, params: null } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.false(
        screen.getByLabelText(
          t('components.organizations.information-section-view.features.CAMPAIGN_WITHOUT_USER_PROFILE'),
        ).checked,
      );
    });

    test('it shows checked checkbox when feature is active', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        features: { CAMPAIGN_WITHOUT_USER_PROFILE: { active: true, params: null } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.true(
        screen.getByLabelText(
          t('components.organizations.information-section-view.features.CAMPAIGN_WITHOUT_USER_PROFILE'),
        ).checked,
      );
    });
  });

  module('LEARNER_IMPORT', function (hooks) {
    hooks.beforeEach(function () {
      class AccessControlStub extends Service {
        hasAccessToOrganizationActionsScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);
    });

    test('it shows a disabled LEARNER_IMPORT checkbox when no import formats are available', async function (assert) {
      // given
      findAllStub.withArgs('organization-learner-import-format').resolves([]);
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: false,
        features: {},
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert
        .dom(
          screen.getByRole('checkbox', {
            name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
          }),
        )
        .isDisabled();
    });

    test('it disables IS_MANAGING_STUDENTS for SCO when learner import is active', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: true,
        isLearnerImportEnabled: true,
        features: { LEARNER_IMPORT: { active: true, params: { name: 'GENERIC' } } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.true(
        screen.getByRole('checkbox', {
          name: t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS'),
        }).disabled,
      );
    });

    test('it shows a disabled IS_MANAGING_STUDENTS checkbox for non-SCO organization', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: false,
        isLearnerImportEnabled: true,
        features: {},
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert
        .dom(
          screen.getByRole('checkbox', {
            name: t('components.organizations.information-section-view.features.IS_MANAGING_STUDENTS'),
          }),
        )
        .isDisabled();
    });

    test('it shows checked checkbox with format select when learner import is active', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: false,
        isLearnerImportEnabled: true,
        features: { LEARNER_IMPORT: { active: true, params: { name: 'ONDE' } } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );

      // then
      assert.true(
        screen.getByRole('checkbox', {
          checked: true,
          name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
        }).checked,
      );
      const select = screen.getByRole('button', { name: /Format d'import/ });
      assert.ok(within(select).getByText('ONDE'));
    });

    test('it hides the format select when learner import is unchecked', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: false,
        features: { LEARNER_IMPORT: { active: true, params: { name: 'ONDE' } } },
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );
      await click(
        screen.getByRole('checkbox', {
          checked: true,
          name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
        }),
      );

      // then
      assert.notOk(
        screen.queryByLabelText(
          t('components.organizations.editing.organization-learner-import-format.selector.label'),
        ),
      );
    });

    test('it displays a modal when user activates learner import', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: false,
        features: {},
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );
      await click(
        screen.getByRole('checkbox', {
          name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
        }),
      );
      const modale = await screen.findByRole('dialog');

      // then
      assert.ok(
        within(modale).getByRole('heading', {
          level: 1,
          name: t('components.organizations.editing.organization-learner-import-format.dialog.title'),
        }),
      );
    });

    test('it unchecks learner import when user closes the modal', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: false,
        features: {},
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );
      await click(
        screen.getByRole('checkbox', {
          name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
        }),
      );
      const modale = await screen.findByRole('dialog');
      await click(within(modale).getByRole('button', { name: t('common.actions.close') }));
      await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

      // then
      assert.ok(
        screen.getByRole('checkbox', {
          checked: false,
          name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
        }),
      );
    });

    test('it keeps learner import checked when user confirms in the modal', async function (assert) {
      // given
      const onSubmit = onSubmitStub;
      const organization = EmberObject.create({
        isOrganizationSCO: false,
        features: {},
      });

      // when
      const screen = await render(
        <template><FeaturesSection @organization={{organization}} @onSubmit={{onSubmit}} /></template>,
      );
      await click(
        screen.getByRole('checkbox', {
          name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
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

      // then
      assert.ok(
        screen.getByRole('checkbox', {
          checked: true,
          name: t('components.organizations.information-section-view.features.LEARNER_IMPORT'),
        }),
      );
    });
  });
});
