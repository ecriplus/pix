import { render } from '@1024pix/ember-testing-library';
import { fillIn } from '@ember/test-helpers';
import List from 'pix-admin/components/autonomous-courses/list';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

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
    assert.dom(screen.getByText('Id')).exists();
    assert.dom(screen.getByText('1002')).exists();
    assert.dom(screen.getByText('1001')).exists();

    assert.dom(screen.getByText('Nom')).exists();
    assert.dom(screen.getByRole('link', { name: 'Parcours autonome 2023' })).exists();
    assert.dom(screen.getByRole('link', { name: 'Parcours autonome 2020' })).exists();

    assert.dom(screen.getByText('Date de création')).exists();
    assert.dom(screen.getByText('01/01/2023')).exists();
    assert.dom(screen.getByText('01/01/2020')).exists();

    assert.dom(screen.getByText('Statut')).exists();
    assert.strictEqual(screen.getAllByText('Actif').length, 2);
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
      await fillIn(screen.getByPlaceholderText('Filtrer par ID'), 9);

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
      await fillIn(screen.getByPlaceholderText('Filtrer par nom'), 'qui va être filtré');

      // then
      assert.dom(screen.getByText('Parcours autonome qui va être filtré')).exists();
      assert.dom(screen.queryByText('Parcours autonome avec un 9 dedans')).doesNotExist();
    });
  });
});
