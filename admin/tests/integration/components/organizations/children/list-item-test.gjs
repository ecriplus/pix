import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import ListItem from 'pix-admin/components/organizations/children/list-item';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/children/list-item', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when admin user has access to detach organization action', function () {
    test('displays child organization items', async function (assert) {
      class AccessControlStub extends Service {
        hasAccessToDetachChildOrganizationScope = true;
      }
      this.owner.register('service:access-control', AccessControlStub);

      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', {
        id: 1,
        name: 'Collège The Night Watch',
        externalId: 'UA123456',
      });

      // when
      const screen = await render(<template><ListItem @childOrganization={{organization}} /></template>);

      // then
      assert.ok(screen.getByRole('cell', { name: '1' }));
      assert.ok(screen.getByRole('cell', { name: 'Collège The Night Watch' }));
      assert.ok(screen.getByRole('cell', { name: 'UA123456' }));
      assert.ok(
        screen.getByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
      );
    });
  });

  module('when admin user does not have access to detach organization action', function () {
    test('should not display "Detach" button', async function (assert) {
      class AccessControlStub extends Service {
        hasAccessToDetachChildOrganizationScope = false;
      }
      this.owner.register('service:access-control', AccessControlStub);

      // given
      const store = this.owner.lookup('service:store');
      const organization = store.createRecord('organization', {
        id: 1,
        name: 'Collège The Night Watch',
        externalId: 'UA123456',
      });

      // when
      const screen = await render(<template><ListItem @childOrganization={{organization}} /></template>);

      // then
      assert.ok(screen.getByRole('cell', { name: 'Collège The Night Watch' }));
      assert.notOk(
        screen.queryByRole('button', { name: t('components.organizations.children-list.actions.detach.button') }),
      );
    });
  });
});
