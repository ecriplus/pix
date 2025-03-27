import { render, within } from '@1024pix/ember-testing-library';
import ListSummaryItems from 'pix-admin/components/trainings/list-summary-items';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../helpers/setup-intl-rendering';

module('Integration | Component | list-summary-items', function (hooks) {
  setupIntlRenderingTest(hooks);

  const noop = () => {};

  test('it should display header with id and internal title', async function (assert) {
    // when
    const screen = await render(<template><ListSummaryItems @triggerFiltering={{noop}} /></template>);

    // then
    assert.dom(screen.getByText('ID')).exists();
    assert.dom(screen.getByText('Titre à usage interne')).exists();
  });

  test('it should display trainings summaries list', async function (assert) {
    // given
    const summaries = [
      { id: 1, title: "Apprendre en s'amusant", internalTitle: 'Apprendre pour + de fun' },
      { id: 2, title: 'Speed training', internalTitle: 'training long...' },
    ];
    summaries.meta = {
      pagination: { rowCount: 2 },
    };

    // when
    const screen = await render(
      <template><ListSummaryItems @summaries={{summaries}} @triggerFiltering={{noop}} /></template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('pages.trainings.training.list.caption') });
    const rows = within(table).getAllByRole('row');
    assert.strictEqual(rows.length, 3);
  });

  test('it should display trainings summaries data', async function (assert) {
    // given
    const internalTitle = 'Comment avoir un beau chien tout propre !';
    const id = 123;
    const title = 'Comment toiletter son chien';
    const summaries = [{ id, title, internalTitle }];

    summaries.meta = {
      pagination: { rowCount: 2 },
    };

    // when
    const screen = await render(
      <template><ListSummaryItems @summaries={{summaries}} @triggerFiltering={{noop}} /></template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('pages.trainings.training.list.caption') });
    assert.dom(within(table).getByRole('cell', { name: id })).exists();
    assert.dom(within(table).getByRole('cell', { name: internalTitle })).exists();
  });
});
