import { render, within } from '@1024pix/ember-testing-library';
import { click, fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import CombinedCourseParticipations from 'pix-orga/components/combined-course/participations';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | CombinedCourse | Participations', function (hooks) {
  const participations = [
    {
      id: 123,
      firstName: 'Marcelle',
      lastName: 'Labe',
      status: 'COMPLETED',
      nbCampaigns: 3,
      nbModules: 5,
      nbCampaignsCompleted: 2,
      nbModulesCompleted: 2,
    },
    {
      id: 234,
      firstName: 'Vincent',
      lastName: 'Deli',
      status: 'STARTED',
      nbCampaigns: 2,
      nbModules: 2,
      nbCampaignsCompleted: 0,
      nbModulesCompleted: 0,
    },
  ];
  participations.meta = { page: 1, pageSize: 1, rowCount: 2, pageCount: 2 };
  const onFilter = sinon.stub();

  setupIntlRenderingTest(hooks);
  module('table', function () {
    test('it should have a caption to describe the table ', async function (assert) {
      // when
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} @onFilter={{onFilter}} /></template>,
      );

      // then
      assert.ok(screen.getByRole('table', { name: t('pages.combined-course.table.description') }));
    });

    test('it should display column headers', async function (assert) {
      // when
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} @onFilter={{onFilter}} /></template>,
      );

      const table = screen.getByRole('table');

      // then
      assert.ok(
        within(table).getByRole('columnheader', {
          name: t('pages.combined-course.table.column.first-name'),
        }),
      );
      assert.ok(
        within(table).getByRole('columnheader', {
          name: t('pages.combined-course.table.column.last-name'),
        }),
      );
      assert.ok(
        within(table).getByRole('columnheader', {
          name: t('pages.combined-course.table.column.status'),
        }),
      );
      assert.ok(
        within(table).getByRole('columnheader', {
          name: new RegExp(t('pages.combined-course.table.column.campaigns')),
        }),
      );
      assert.ok(
        within(table).getByRole('columnheader', {
          name: new RegExp(t('pages.combined-course.table.column.modules')),
        }),
      );
    });

    test('it should render a tooltip for campaign column', async function (assert) {
      // when
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} /></template>,
      );
      const campaignHeader = screen.getByRole('columnheader', {
        name: new RegExp(t('pages.combined-course.table.column.campaigns')),
      });

      // then
      assert.ok(within(campaignHeader).getByText(t('pages.combined-course.table.tooltip.campaigns-column')));
    });

    test('it should render a tooltip for module column', async function (assert) {
      // when
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} /></template>,
      );
      const campaignHeader = screen.getByRole('columnheader', {
        name: new RegExp(t('pages.combined-course.table.column.modules')),
      });

      // then
      assert.ok(within(campaignHeader).getByText(t('pages.combined-course.table.tooltip.modules-column')));
    });
  });

  test('it should display participation details', async function (assert) {
    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{participations}} @onFilter={{onFilter}} /></template>,
    );

    const table = screen.getByRole('table');

    // then
    assert.ok(
      within(table).getByRole('cell', {
        name: participations[0].lastName,
      }),
    );
    assert.ok(
      within(table).getByRole('cell', {
        name: participations[0].firstName,
      }),
    );
    assert.ok(
      within(table).getByRole('cell', {
        name: t(`components.participation-status.${participations[0].status}`),
      }),
    );
    assert.ok(
      within(table).getByText(
        t('pages.combined-course.table.campaign-completion', {
          count: participations[0].nbCampaignsCompleted,
          nbCampaigns: participations[0].nbCampaigns,
        }),
      ),
    );
    assert.ok(
      within(table).getByText(
        t('pages.combined-course.table.module-completion', {
          count: participations[0].nbModulesCompleted,
          nbModules: participations[0].nbModules,
        }),
      ),
    );
  });

  test('it should display empty state', async function (assert) {
    // given
    const noParticipation = [];

    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{noParticipation}} @onFilter={{onFilter}} /></template>,
    );

    // then
    assert.notOk(screen.queryByRole('table'));
    assert.ok(screen.getByText(t('pages.campaign.empty-state')));
  });

  module('pagination', function () {
    test('it should display pagination in correct language', async function (assert) {
      // when
      const locale = this.owner.lookup('service:locale');
      locale.setCurrentLocale('en');
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} @onFilter={{onFilter}} /></template>,
      );

      // then
      assert.ok(screen.getByLabelText(/items/));
    });
    test('should display pagination', async function (assert) {
      //when
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} @onFilter={{onFilter}} /></template>,
      );

      // then
      assert.ok(screen.getByText(/1-1 sur 2 éléments/));
      assert.ok(screen.getByLabelText("Nombre d'élément à afficher par page"));
      assert.ok(screen.getByRole('button', { name: 'Aller à la page précédente' }));
      assert.ok(screen.getByRole('button', { name: 'Aller à la page suivante' }));
    });
  });

  module('filters', function () {
    module('clearFilters', function () {
      test('it should trigger clearFilters', async function (assert) {
        // given
        const clearFilters = sinon.stub();

        const statusFilter = [];

        // when
        const screen = await render(
          <template>
            <CombinedCourseParticipations
              @statusFilter={{statusFilter}}
              @clearFilters={{clearFilters}}
              @participations={{participations}}
              @onFilter={{onFilter}}
            />
          </template>,
        );

        await screen.getByRole('button', { name: t('common.filters.actions.clear') }).click();

        // then
        assert.true(clearFilters.calledOnce);
      });
    });

    module('fullName filter', function () {
      test('it should trigger onFilter on fullName change', async function (assert) {
        // given
        const onFilter = sinon.stub();
        const fullNameFilter = '';

        // when
        const screen = await render(
          <template>
            <CombinedCourseParticipations
              @fullNameFilter={{fullNameFilter}}
              @onFilter={{onFilter}}
              @participations={{participations}}
            />
          </template>,
        );

        const input = screen.getByLabelText(t('common.filters.fullname.label'));

        assert.ok(screen.getByPlaceholderText(t('common.filters.fullname.placeholder')));

        await fillIn(input, 'marcelle');

        // then
        assert.true(onFilter.calledOnce);
        assert.deepEqual(onFilter.args[0], ['fullName', 'marcelle']);
      });

      test('it should init the fullName filter value', async function (assert) {
        // given
        const onFilter = sinon.stub();
        const fullNameFilter = 'Marcelo';

        // when
        const screen = await render(
          <template>
            <CombinedCourseParticipations
              @fullNameFilter={{fullNameFilter}}
              @onFilter={{onFilter}}
              @participations={{participations}}
            />
          </template>,
        );

        // then
        assert.ok(screen.getByDisplayValue('Marcelo'));
      });
    });

    module('status filter', function () {
      test('it should trigger onFilter on change statuses', async function (assert) {
        // given
        const onFilter = sinon.stub();
        const participations = [
          {
            id: 123,
            firstName: 'Marcelle',
            lastName: 'Labe',
            status: 'COMPLETED',
            nbCampaigns: 1,
            nbModules: 0,
            nbCampaignsCompleted: 1,
            nbModulesCompleted: 0,
          },
        ];

        const statusFilter = [];

        // when
        const screen = await render(
          <template>
            <CombinedCourseParticipations
              @statusFilter={{statusFilter}}
              @onFilter={{onFilter}}
              @participations={{participations}}
            />
          </template>,
        );

        const select = screen.getByLabelText(t('pages.combined-course.filters.by-status'));

        await click(select);
        await screen.findByRole('menu');
        await click(screen.getByLabelText(t('pages.combined-course.filters.status.COMPLETED')));

        // then
        assert.true(onFilter.calledOnce);
        assert.deepEqual(onFilter.args[0], ['statuses', ['COMPLETED']]);
      });
    });
  });
});
