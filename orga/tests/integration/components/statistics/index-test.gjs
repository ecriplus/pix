import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import Statistics from 'pix-orga/components/statistics/index';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Statistics | Index', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display title', async function (assert) {
    //given
    const model = {
      data: [],
    };

    //when
    const screen = await render(<template><Statistics @model={{model}} /></template>);

    //then
    assert.ok(screen.getByRole('heading', { name: t('pages.statistics.title'), level: 1 }));
  });

  test('it should display table headers', async function (assert) {
    //given
    const model = {
      data: [],
    };

    //when
    const screen = await render(<template><Statistics @model={{model}} /></template>);

    //then
    assert.ok(screen.getByRole('columnheader', { name: t('pages.statistics.table.headers.skills') }));
    assert.ok(screen.getByRole('columnheader', { name: t('pages.statistics.table.headers.topics') }));
    assert.ok(screen.getByRole('columnheader', { name: t('pages.statistics.table.headers.reached-level') }));
    assert.ok(screen.getByRole('columnheader', { name: t('pages.statistics.table.headers.positioning') }));
  });

  test('it should display rows data', async function (assert) {
    //given
    const model = {
      data: [
        {
          competence_code: '2.1',
          competence: 'Interagir',
          sujet: 'Gérer ses contacts',
          niveau_par_user: '1.30',
          niveau_par_sujet: '1.50',
        },
      ],
    };

    //when
    const screen = await render(<template><Statistics @model={{model}} /></template>);

    //then
    assert.ok(screen.getByRole('cell', { name: '2.1 Interagir' }));
    assert.ok(screen.getByRole('cell', { name: 'Gérer ses contacts' }));
    assert.ok(screen.getByRole('cell', { name: t('pages.statistics.level.novice') }));
  });

  module('pagination', function () {
    test('should have pagination on page', async function (assert) {
      //given
      const model = {
        data: [
          {
            competence_code: '2.1',
            competence: 'Interagir',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
          {
            competence_code: '2.1',
            competence: 'Interagir',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
        ],
      };
      class Router extends Service {
        currentRoute = {
          queryParams: {
            pageSize: 1,
          },
        };
      }
      this.owner.register('service:router', Router);

      //when
      const screen = await render(<template><Statistics @model={{model}} /></template>);
      //then
      assert.ok(screen.getByText(t('common.pagination.page-info', { start: 1, end: 1, total: 2 })));
      assert.ok(screen.getByLabelText(t('common.pagination.action.select-page-size')));
      assert.ok(screen.getByRole('button', { name: t('common.pagination.action.previous') }));
      assert.ok(screen.getByRole('button', { name: t('common.pagination.action.next') }));
    });

    test('should show first page without pageNumber in query params', async function (assert) {
      //given
      const model = {
        data: [
          {
            competence_code: '2.1',
            competence: 'Interagir',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
          {
            competence_code: '2.1',
            competence: 'Interagir',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
        ],
      };
      class Router extends Service {
        currentRoute = {
          queryParams: {
            pageSize: 1,
          },
        };
      }
      this.owner.register('service:router', Router);

      //when
      const screen = await render(<template><Statistics @model={{model}} /></template>);

      //then
      assert.ok(screen.getByRole('cell', { name: '2.1 Interagir' }));
      assert.ok(screen.getByRole('cell', { name: t('pages.statistics.level.novice') }));
    });

    test('should show specific page when pageNumber is set', async function (assert) {
      //given
      const model = {
        data: [
          {
            competence_code: '2.1',
            competence: 'Foo',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
          {
            competence_code: '2.1',
            competence: 'Interagir',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
        ],
      };
      class Router extends Service {
        currentRoute = {
          queryParams: {
            pageSize: 1,
            pageNumber: 2,
          },
        };
      }
      this.owner.register('service:router', Router);

      //when
      const screen = await render(<template><Statistics @model={{model}} /></template>);

      //then
      assert.ok(screen.getByRole('cell', { name: '2.1 Interagir' }));
      assert.ok(screen.getByRole('cell', { name: t('pages.statistics.level.novice') }));
    });
  });
});
