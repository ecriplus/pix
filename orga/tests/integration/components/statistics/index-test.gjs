import { clickByName, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import dayjs from 'dayjs';
import { t } from 'ember-intl/test-support';
import Statistics from 'pix-orga/components/statistics/index';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Statistics | Index', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display title and extracted date', async function (assert) {
    //given
    const extractionDate = '2024-12-08';
    const model = {
      data: [
        {
          competence_code: '2.1',
          competence: 'Interagir',
          sujet: 'Gérer ses contacts',
          niveau_par_user: '1.30',
          niveau_par_sujet: '1.50',
          extraction_date: extractionDate,
        },
      ],
    };

    //when
    const screen = await render(<template><Statistics @model={{model}} /></template>);

    //then
    assert.ok(screen.getByRole('heading', { name: t('pages.statistics.title'), level: 1 }));
    assert.ok(screen.getByText(dayjs(extractionDate).format('D MMM YYYY'), { exact: false }));
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
          domaine: '2. Communication et collaboration',
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
            domaine: '2. Communication et collaboration',
            competence_code: '2.1',
            competence: 'Interagir',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
          {
            domaine: '2. Communication et collaboration',
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
            domaine: '2. Communication et collaboration',
            competence_code: '2.1',
            competence: 'Interagir',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
          {
            domaine: '2. Communication et collaboration',
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
            domaine: '2. Communication et collaboration',
            competence_code: '2.1',
            competence: 'Foo',
            sujet: 'Gérer ses contacts',
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
          {
            domaine: '2. Communication et collaboration',
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

  module('filter', function () {
    test('should filtered analysis', async function (assert) {
      //given
      const model = {
        data: [
          {
            domaine: '1. Information et données',
            competence_code: '1.1 ',
            competence: 'Mener une recherche et une veille d’information',
            sujet: "Indices de qualité d'une page web",
            niveau_par_user: '1.30',
            niveau_par_sujet: '1.50',
          },
          {
            domaine: '2. Communication et collaboration',
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
        replaceWith = ({ queryParams }) => {
          this.currentRoute.queryParams.pageNumber = queryParams.pageNumber;
        };
      }
      this.owner.register('service:router', Router);

      //when
      const screen = await render(<template><Statistics @model={{model}} /></template>);

      //then
      assert.ok(screen.getByText(t('common.pagination.page-info', { start: 2, end: 2, total: 2 })));

      // when
      const select = screen.getByRole('button', { name: t('pages.statistics.select-label') });
      await click(select);
      const option = await screen.findByRole('option', { name: '2. Communication et collaboration' });
      await click(option);

      // then
      assert.ok(screen.getByText(t('common.pagination.page-results', { total: 1 })));
      assert.ok(screen.getByRole('cell', { name: '2.1 Interagir' }));
      assert.ok(screen.getByRole('cell', { name: 'Gérer ses contacts' }));
      assert.ok(screen.getByRole('cell', { name: t('pages.statistics.level.novice') }));

      // when
      await clickByName(t('common.filters.actions.clear'));

      // then
      assert.ok(screen.getByText(t('common.pagination.page-info', { start: 1, end: 1, total: 2 })));
    });
  });
});
