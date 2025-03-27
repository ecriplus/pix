import { render, within } from '@1024pix/ember-testing-library';
import ListSummaryItems from 'pix-admin/components/target-profiles/list-summary-items';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../../../helpers/setup-intl-rendering';

module('Integration | Component | routes/authenticated/target-profiles | list-summary-items', function (hooks) {
  setupIntlRenderingTest(hooks);

  const triggerFiltering = function () {};
  const goToTargetProfilePage = function () {};

  test('it should display search inputs (name, id and status)', async function (assert) {
    // when
    const screen = await render(
      <template>
        <ListSummaryItems @triggerFiltering={{triggerFiltering}} @goToTargetProfilePage={{goToTargetProfilePage}} />
      </template>,
    );

    // then
    assert
      .dom(screen.getByRole('textbox', { name: t('pages.target-profiles.filters.search-by-id.aria-label') }))
      .exists();
    assert
      .dom(screen.getByRole('textbox', { name: t('pages.target-profiles.filters.search-by-internal-name.aria-label') }))
      .exists();
    assert.dom(screen.getByRole('button', { name: t('common.filters.target-profile.label') })).exists();
  });

  test('it should display target profile summaries list', async function (assert) {
    // given
    const summaries = [{ id: 1 }, { id: 2 }];
    summaries.meta = {
      rowCount: 2,
    };
    this.summaries = summaries;

    // when
    const screen = await render(
      <template>
        <ListSummaryItems
          @summaries={{summaries}}
          @triggerFiltering={{triggerFiltering}}
          @goToTargetProfilePage={{goToTargetProfilePage}}
        />
      </template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('components.target-profiles.list.table.caption') });
    const rows = within(table).getAllByRole('row');
    assert.strictEqual(rows.length, 3);
  });

  test('it should display target profile summaries data', async function (assert) {
    // given
    const summaries = [{ id: 123, internalName: 'Profile Cible 1' }];
    summaries.meta = {
      rowCount: 2,
    };
    this.summaries = summaries;

    // when
    const screen = await render(
      <template>
        <ListSummaryItems
          @summaries={{summaries}}
          @triggerFiltering={{triggerFiltering}}
          @goToTargetProfilePage={{goToTargetProfilePage}}
        />
      </template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('components.target-profiles.list.table.caption') });
    assert.dom(within(table).getByRole('cell', { name: 123 })).exists();
    assert.dom(within(table).getByRole('cell', { name: 'Profile Cible 1' })).exists();
  });

  test('it should display target profile status as "Obsolète" when target profile is outdated', async function (assert) {
    // given
    const summaries = [{ id: 123, internalName: 'Profile Cible - outdated', outdated: true }];
    summaries.meta = {
      rowCount: 2,
    };
    this.summaries = summaries;

    // when
    const screen = await render(
      <template>
        <ListSummaryItems
          @summaries={{summaries}}
          @triggerFiltering={{triggerFiltering}}
          @goToTargetProfilePage={{goToTargetProfilePage}}
        />
      </template>,
    );

    // then
    assert.dom(screen.getByText('Obsolète')).exists();
  });

  test('it should display target profile status as "Actif" when target profile is not outdated', async function (assert) {
    // given
    const summaries = [{ id: 123, internalName: 'Profile Cible - active', outdated: false }];
    summaries.meta = {
      rowCount: 2,
    };
    this.summaries = summaries;

    // when
    const screen = await render(
      <template>
        <ListSummaryItems
          @summaries={{summaries}}
          @triggerFiltering={{triggerFiltering}}
          @goToTargetProfilePage={{goToTargetProfilePage}}
        />
      </template>,
    );

    // then
    assert.dom(screen.getByText('Actif')).exists();
  });
});
