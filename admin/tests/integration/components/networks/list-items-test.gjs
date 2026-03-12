import { render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ListItems from 'pix-admin/components/networks/list-items';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Networks | ListItems', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when there are networks', function () {
    test('it renders a table with networks IDs and name', async function (assert) {
      // given
      const network1 = { id: 123, name: 'Network1' };
      const network2 = { id: 456, name: 'Network2' };
      const networks = [network1, network2];

      // when
      const screen = await render(<template><ListItems @networks={{networks}} /></template>);

      // then
      const table = screen.getByRole('table', {
        name: t('components.networks.list.table.caption'),
      });

      assert.dom(within(table).getByRole('cell', { name: network1.id })).exists();
      assert.dom(within(table).getByRole('cell', { name: network1.id })).exists();
      assert.dom(within(table).getByRole('cell', { name: network1.name })).exists();
      assert.dom(within(table).getByRole('cell', { name: network2.name })).exists();
    });
  });

  module('when there are no networks', function () {
    test('it does not render a table', async function (assert) {
      // given
      const networks = [];

      // when
      const screen = await render(<template><ListItems @networks={{networks}} /></template>);

      // then
      assert
        .dom(
          await screen.queryByRole('table', {
            name: t('components.networks.list.table.caption'),
          }),
        )
        .doesNotExist();

      assert.dom(screen.getByText(t('common.tables.empty-result'))).exists();
    });
  });
});
