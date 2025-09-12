import { render } from '@1024pix/ember-testing-library';
import Framework from 'pix-admin/components/complementary-certifications/item/framework';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest, { t } from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | complementary-certifications/item/framework', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isSuperAdmin: true };

    store = this.owner.lookup('service:store');

    const serviceRouter = this.owner.lookup('service:router');
    sinon.stub(serviceRouter, 'currentRoute').value({
      parent: {
        parent: {
          params: {
            complementary_certification_id: 'complementary-certification-id',
          },
        },
      },
    });

    store.peekRecord = sinon.stub().resolves('complementary-certification-key');
    store.queryRecord = sinon.stub().resolves({});
  });

  test('it should display a creation form button for framework', async function (assert) {
    // given
    store.findRecord = sinon.stub().returns();

    // when
    const screen = await render(<template><Framework /></template>);

    // then
    assert.dom(screen.getByText(t('components.complementary-certifications.item.framework.create-button'))).exists();
  });

  module('when a current consolidated framework exists', function () {
    test('it should display the details component', async function (assert) {
      // given
      store.findRecord = sinon.stub().resolves({
        hasMany: sinon.stub().returns({
          value: sinon.stub().returns([]),
        }),
      });

      // when
      const screen = await render(<template><Framework /></template>);

      // then
      assert
        .dom(
          screen.getByRole('heading', {
            name: t('components.complementary-certifications.item.framework.details.title'),
          }),
        )
        .exists();
    });
  });

  module('when there is no current consolidated framework', function () {
    test('it should display the information and not the details component', async function (assert) {
      // given
      store.findRecord = sinon.stub().returns();

      // when
      const screen = await render(<template><Framework /></template>);

      // then
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

  module('#frameworkHistory', function () {
    module('when there is no existing framework history', function () {
      test('it should not display the framework history', async function (assert) {
        // given
        store.findRecord = sinon.stub().resolves({
          hasMany: sinon.stub().returns({
            value: sinon.stub().returns([]),
          }),
        });
        store.queryRecord = sinon.stub().resolves({ history: [] });

        // when
        const screen = await render(<template><Framework /></template>);

        // then
        assert
          .dom(
            screen.queryByRole('heading', {
              name: t('components.complementary-certifications.item.framework.history.title'),
            }),
          )
          .doesNotExist();
      });
    });

    module('when there are existing framework versions', function () {
      test('it should display the framework history', async function (assert) {
        // given
        store.findRecord = sinon.stub().resolves({
          hasMany: sinon.stub().returns({
            value: sinon.stub().returns([]),
          }),
        });
        store.queryRecord = sinon.stub().resolves({ history: ['20250101080000', '20240101080000', '20230101080000'] });

        // when
        const screen = await render(<template><Framework /></template>);

        // then
        assert
          .dom(
            screen.getByRole('heading', {
              name: t('components.complementary-certifications.item.framework.history.title'),
            }),
          )
          .exists();
      });
    });
  });
});
