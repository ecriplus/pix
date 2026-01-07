import { render } from '@1024pix/ember-testing-library';
import Framework from 'pix-admin/components/certification-frameworks/item/framework';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest, { t } from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | complementary-certifications/item/framework', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isCertif: true };

    store = this.owner.lookup('service:store');
    store.queryRecord = sinon.stub().resolves({});
  });

  module('when user has a super admin role', function (hooks) {
    hooks.beforeEach(function () {
      const currentUser = this.owner.lookup('service:currentUser');
      currentUser.adminMember = { isSuperAdmin: true, isCertif: false };
    });

    test('it should display a framework creation button', async function (assert) {
      const complementaryCertification = {
        key: 'complementary-certification-key',
        targetProfilesHistory: [],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().returns();

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert.dom(screen.getByText(t('components.complementary-certifications.item.framework.create-button'))).exists();
    });

    test('it should display the information and not the details component when there is no current consolidated framework', async function (assert) {
      const complementaryCertification = {
        key: 'complementary-certification-key',
        targetProfilesHistory: [],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().returns();

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert
        .dom(screen.getByText(t('components.complementary-certifications.item.framework.no-current-framework')))
        .exists();

      assert
        .dom(
          screen.queryByRole('heading', {
            name: t('components.complementary-certifications.item.framework.details.title'),
          }),
        )
        .doesNotExist();
    });
  });

  module('when user has another accepted role', function () {
    test('it should not display a framework creation button', async function (assert) {
      const complementaryCertification = {
        key: 'complementary-certification-key',
        targetProfilesHistory: [],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().returns();

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert
        .dom(screen.queryByText(t('components.complementary-certifications.item.framework.create-button')))
        .doesNotExist();
    });
  });

  module('when a current consolidated framework exists', function () {
    test('it should display the details component', async function (assert) {
      const complementaryCertification = {
        key: 'complementary-certification-key',
        targetProfilesHistory: [],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.complementary-certifications.item.framework.details.title'),
          }),
        )
        .exists();
    });
  });

  module('#frameworkHistory', function () {
    test('it should not display the framework history when there is no existing framework history', async function (assert) {
      const complementaryCertification = {
        key: 'complementary-certification-key',
        targetProfilesHistory: [],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });
      store.queryRecord = sinon.stub().resolves({ history: [] });

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert
        .dom(
          screen.queryByRole('heading', {
            name: t('components.complementary-certifications.item.framework.history.title'),
          }),
        )
        .doesNotExist();
    });

    test('it should display the framework history when there are existing framework versions', async function (assert) {
      const complementaryCertification = {
        key: 'complementary-certification-key',
        targetProfilesHistory: [],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });
      store.queryRecord = sinon.stub().resolves({ history: ['20250101080000', '20240101080000', '20230101080000'] });

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.complementary-certifications.item.framework.history.title'),
          }),
        )
        .exists();
    });
  });

  module('when the framework is CORE', function () {
    test('it should load and display CORE framework', async function (assert) {
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });
      store.queryRecord = sinon.stub().resolves({ history: [] });

      const screen = await render(<template><Framework /></template>);

      assert.ok(
        store.findRecord.calledWith('certification-consolidated-framework', 'CORE'),
        'should load CORE framework',
      );
      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.complementary-certifications.item.framework.details.title'),
          }),
        )
        .exists();
    });

    test('it should not display target profiles history section', async function (assert) {
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });
      store.queryRecord = sinon.stub().resolves({ history: [] });

      const screen = await render(<template><Framework /></template>);

      assert
        .dom(
          screen.queryByRole('heading', {
            name: t('components.complementary-certifications.target-profiles.history-list.title'),
          }),
        )
        .doesNotExist();
    });
  });

  module('when the framework is a complementary', function () {
    test('it should load and display complementary framework', async function (assert) {
      const complementaryCertification = {
        key: 'DROIT',
        targetProfilesHistory: [{ id: 1 }, { id: 2 }],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });
      store.queryRecord = sinon.stub().resolves({ history: [] });

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert.ok(
        store.findRecord.calledWith('certification-consolidated-framework', 'DROIT'),
        'should load complementary framework',
      );
      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.complementary-certifications.item.framework.details.title'),
          }),
        )
        .exists();
    });

    test('it should display target profiles history section', async function (assert) {
      const complementaryCertification = {
        key: 'DROIT',
        targetProfilesHistory: [{ id: 1 }, { id: 2 }],
        reload: sinon.stub().resolves(),
      };
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });
      store.queryRecord = sinon.stub().resolves({ history: [] });

      const screen = await render(
        <template><Framework @complementaryCertification={{complementaryCertification}} /></template>,
      );

      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.complementary-certifications.target-profiles.history-list.title'),
          }),
        )
        .exists();
    });
  });
});
