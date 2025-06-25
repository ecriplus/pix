import { render, within } from '@1024pix/ember-testing-library';
import List from 'pix-admin/components/complementary-certifications/list';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../helpers/setup-intl-rendering';

module('Integration | Component | complementary-certifications/list', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display complementary certification list', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const complementaryCertifications = [
      store.createRecord('complementary-certification', { id: 0, key: 'DROIT', label: 'Pix+Droit' }),
      store.createRecord('complementary-certification', { id: 1, key: 'CLEA', label: 'Cléa' }),
    ];

    // when
    const screen = await render(
      <template><List @complementaryCertifications={{complementaryCertifications}} /></template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('components.complementary-certifications.list.caption') });
    assert
      .dom(within(table).getByRole('columnheader', { name: t('components.complementary-certifications.list.id') }))
      .exists();
    assert
      .dom(within(table).getByRole('columnheader', { name: t('components.complementary-certifications.list.name') }))
      .exists();
    assert.dom(within(table).getByRole('row', { name: '0 Pix+Droit' })).exists();
    assert.dom(within(table).getByRole('row', { name: '1 Cléa' })).exists();
  });

  test('it should display complementary certifications sorted by label', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const complementaryCertifications = [
      store.createRecord('complementary-certification', { id: 1, label: 'Certif+ B' }),
      store.createRecord('complementary-certification', { id: 2, label: 'Certif+ C' }),
      store.createRecord('complementary-certification', { id: 3, label: 'Certif+ A' }),
    ];

    // when
    const screen = await render(
      <template><List @complementaryCertifications={{complementaryCertifications}} /></template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('components.complementary-certifications.list.caption') });
    const rows = within(table).getAllByRole('row');
    assert.dom(rows[1]).hasText('3 Certif+ A');
    assert.dom(rows[2]).hasText('1 Certif+ B');
    assert.dom(rows[3]).hasText('2 Certif+ C');
  });
});
