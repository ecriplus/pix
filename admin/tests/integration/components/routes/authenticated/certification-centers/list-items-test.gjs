import { render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ListItems from 'pix-admin/components/certification-centers/list-items';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../../helpers/setup-intl-rendering';

module('Integration | Component | routes/authenticated/certification-centers | list-items', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display certification-centers list', async function (assert) {
    // given
    const certificationCenters = [
      { id: 1, name: 'John', type: 'SCO', externalId: '123' },
      { id: 2, name: 'Jane', type: 'SUP', externalId: '456' },
      { id: 3, name: 'Lola', type: 'PRO', externalId: '789' },
    ];
    certificationCenters.meta = {
      rowCount: 3,
    };
    const triggerFiltering = () => {};

    // when
    const screen = await render(
      <template>
        <ListItems @certificationCenters={{certificationCenters}} @triggerFiltering={{triggerFiltering}} />
      </template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('components.certification-centers.list-items.table.caption') });

    assert.dom(within(table).getByRole('link', { name: '1' })).exists();
    assert.dom(within(table).getByRole('cell', { name: 'John' })).exists();
    assert.dom(within(table).getByRole('cell', { name: 'SCO' })).exists();
    assert.dom(within(table).getByRole('cell', { name: '123' })).exists();
    const rows = within(table).getAllByRole('row');
    assert.strictEqual(rows.length, 4);
  });

  test('it should display filters', async function (assert) {
    // given
    const certificationCenters = [{ id: 1, name: 'John', type: 'SCO', externalId: '123' }];
    certificationCenters.meta = {
      rowCount: 1,
    };
    const triggerFiltering = () => {};

    // when
    const screen = await render(
      <template>
        <ListItems @certificationCenters={{certificationCenters}} @triggerFiltering={{triggerFiltering}} />
      </template>,
    );

    // then
    assert.dom(screen.getByRole('textbox', { name: 'Type' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'Identifiant' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'Nom' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'ID externe' })).exists();
  });
});
