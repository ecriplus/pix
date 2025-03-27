import { render, within } from '@1024pix/ember-testing-library';
import { fillIn } from '@ember/test-helpers';
import List from 'pix-admin/components/autonomous-courses/list';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | AutonomousCourses | List', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a autonomous courses list', async function (assert) {
    // given
    const autonomousCoursesList = [
      {
        id: 1002,
        name: 'Parcours autonome 2023',
        createdAt: new Date('2023-01-01'),
      },
      {
        id: 1001,
        name: 'Parcours autonome 2020',
        createdAt: new Date('2020-01-01'),
      },
    ];

    // when
    const screen = await render(<template><List @items={{autonomousCoursesList}} /></template>);

    // then
    const table = screen.getByRole('table', { name: t('components.autonomous-courses.list.title') });
    assert.dom(within(table).getByRole('columnheader', { name: 'Id' })).exists();
    assert.dom(within(table).getByRole('cell', { name: '1002' })).exists();
    assert.dom(within(table).getByRole('cell', { name: '1001' })).exists();

    assert.dom(within(table).getByRole('columnheader', { name: 'Nom' })).exists();
    assert.dom(screen.getByRole('link', { name: 'Parcours autonome 2023' })).exists();
    assert.dom(screen.getByRole('link', { name: 'Parcours autonome 2020' })).exists();

    assert.dom(within(table).getByRole('columnheader', { name: 'Date de création' })).exists();
    assert.dom(within(table).getByRole('cell', { name: '01/01/2023' })).exists();
    assert.dom(within(table).getByRole('cell', { name: '01/01/2020' })).exists();

    assert.dom(within(table).getByRole('columnheader', { name: 'Statut' })).exists();
    assert.strictEqual(within(table).getAllByText('Actif').length, 2);
  });

  test('it should display a autonomous course with archived tag', async function (assert) {
    // given
    const autonomousCoursesList = [
      {
        id: 1002,
        name: 'Parcours autonome 2023',
        createdAt: new Date('2023-01-01'),
        archivedAt: new Date('2023-02-02'),
      },
    ];

    // when
    const screen = await render(<template><List @items={{autonomousCoursesList}} /></template>);

    // then
    assert.dom(screen.getByText('Archivé')).exists();
  });

  module('filterable columns', function () {
    test('it should be possible to filter ID column', async function (assert) {
      // given
      const autonomousCoursesList = [
        {
          id: '1002',
          name: 'Parcours autonome qui va être filtré',
          createdAt: new Date('2023-01-01'),
        },
        {
          id: '999',
          name: 'Parcours autonome avec un 9 dedans',
          createdAt: new Date('2023-01-01'),
          archivedAt: new Date('2023-02-02'),
        },
      ];

      // when
      const screen = await render(<template><List @items={{autonomousCoursesList}} /></template>);
      await fillIn(screen.getByRole('textbox', { name: 'Filtrer par ID' }), 9);

      // then
      assert.dom(screen.getByText('Parcours autonome avec un 9 dedans')).exists();
      assert.dom(screen.queryByText('Parcours autonome qui va être filtré')).doesNotExist();
    });

    test('it should be possible to filter name column', async function (assert) {
      // given
      const autonomousCoursesList = [
        {
          id: '1002',
          name: 'Parcours autonome qui va être filtré',
          createdAt: new Date('2023-01-01'),
        },
        {
          id: '999',
          name: 'Parcours autonome avec un 9 dedans',
          createdAt: new Date('2023-01-01'),
          archivedAt: new Date('2023-02-02'),
        },
      ];

      // when
      const screen = await render(<template><List @items={{autonomousCoursesList}} /></template>);
      await fillIn(screen.getByRole('textbox', { name: 'Filtrer par nom' }), 'qui va être filtré');

      // then
      assert.dom(screen.getByText('Parcours autonome qui va être filtré')).exists();
      assert.dom(screen.queryByText('Parcours autonome avec un 9 dedans')).doesNotExist();
    });
  });
});
