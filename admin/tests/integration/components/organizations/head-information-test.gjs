import { render } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import { t } from 'ember-intl/test-support';
import HeadInformation from 'pix-admin/components/organizations/head-information';
import ENV from 'pix-admin/config/environment';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/header-information', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when displaying organization', function () {
    test('it displays organization header information', async function (assert) {
      // given
      const organization = EmberObject.create({ id: 1, name: 'Organization SCO' });

      // when
      const screen = await render(<template><HeadInformation @organization={{organization}} /></template>);

      // then
      assert.dom(screen.getByRole('heading', { name: 'Organization SCO' })).exists();
    });

    test('it generates correct external dashboard URL', async function (assert) {
      // given
      ENV.APP.ORGANIZATION_DASHBOARD_URL = 'https://metabase.pix.fr/dashboard/137/?id=';
      const organization = EmberObject.create({ id: 1, name: 'Test Organization' });

      // when
      const screen = await render(<template><HeadInformation @organization={{organization}} /></template>);

      // then
      const dashboardLink = screen.getByRole('link', { name: 'Tableau de bord' });
      assert.dom(dashboardLink).hasAttribute('href', 'https://metabase.pix.fr/dashboard/137/?id=1');
    });

    module('when organization has tags', function () {
      test('it should display tags', async function (assert) {
        // given
        const organization = EmberObject.create({
          id: 1,
          tags: [
            { id: 1, name: 'CFA' },
            { id: 2, name: 'PRIVE' },
            { id: 3, name: 'AGRICULTURE' },
          ],
        });

        // when
        const screen = await render(<template><HeadInformation @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText('CFA')).exists();
        assert.dom(screen.getByText('PRIVE')).exists();
        assert.dom(screen.getByText('AGRICULTURE')).exists();
      });
    });

    module('when organization is parent', function () {
      test('it should display parent label', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const child = store.createRecord('organization', {
          type: 'SCO',
        });
        const organization = store.createRecord('organization', {
          type: 'SCO',
          children: [child],
        });

        // when
        const screen = await render(<template><HeadInformation @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText(t('components.organizations.head-information.parent-organization'))).exists();
      });
    });

    module('when organization is child', function () {
      test('it displays child label and parent organization name', async function (assert) {
        //given
        const store = this.owner.lookup('service:store');
        const parentOrganization = store.createRecord('organization', {
          id: '5',
          type: 'SCO',
        });
        const organization = store.createRecord('organization', {
          type: 'SCO',
          parentOrganizationId: parentOrganization.id,
          parentOrganizationName: 'Shibusen',
        });

        // when
        const screen = await render(<template><HeadInformation @organization={{organization}} /></template>);

        // then
        assert.dom(screen.getByText(t('components.organizations.head-information.child-organization'))).exists();
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
        });

        // when
        const screen = await render(<template><HeadInformation @organization={{organization}} /></template>);

        // then
        assert
          .dom(screen.queryByText(t('components.organizations.head-information.parent-organization')))
          .doesNotExist();
      });
    });
  });
});
