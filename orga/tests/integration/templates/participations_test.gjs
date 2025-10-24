import { render, within } from '@1024pix/ember-testing-library';
import { click, fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import CombinedCourseParticipations from 'pix-orga/components/combined-course/participations';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Template | CombinedCourse | participations', function (hooks) {
  setupIntlRenderingTest(hooks);

  const participations = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      status: 'STARTED',
      nbCampaigns: 2,
      nbCampaignsCompleted: 1,
      nbModules: 4,
      nbModulesCompleted: 2,
    },
  ];
  participations.meta = { total: 20, count: 1, limit: 10, offset: 0 };

  test('it renders empty state when there are no participations', async function (assert) {
    // given
    const noParticipations = [];

    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{noParticipations}} /></template>,
    );

    // then
    assert.notOk(screen.queryByRole('table'));
    assert.ok(screen.getByText(t('pages.campaign.empty-state')));
  });

  test('it renders the table and filters when there are participations', async function (assert) {
    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{participations}} /></template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('pages.combined-course.table.description') });
    assert.ok(table);
    assert.ok(within(table).getByRole('cell', { name: 'Doe' }));
    assert.ok(within(table).getByRole('cell', { name: 'John' }));
  });

  test('it calls onFilter when searching by full name', async function (assert) {
    // given
    const onFilter = sinon.spy();

    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{participations}} @onFilter={{onFilter}} /></template>,
    );
    const searchInput = screen.getByLabelText(t('common.filters.fullname.label'));
    await fillIn(searchInput, 'Toto');

    // then
    assert.ok(onFilter.calledWith('fullName', 'Toto'));
  });

  test('it calls onFilter when filtering by status', async function (assert) {
    // given
    const onFilter = sinon.spy();

    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{participations}} @onFilter={{onFilter}} /></template>,
    );
    await click(screen.getByLabelText(t('pages.combined-course.filters.by-status')));
    await screen.findByRole('menu');
    await click(screen.getByLabelText(t('pages.combined-course.filters.status.STARTED')));

    // then
    assert.ok(onFilter.calledWith('statuses', ['STARTED']));
  });

  test('it calls clearFilters when clicking on the clear filters button', async function (assert) {
    // given
    const clearFilters = sinon.spy();

    // when
    const screen = await render(
      <template>
        <CombinedCourseParticipations @participations={{participations}} @clearFilters={{clearFilters}} />
      </template>,
    );
    await click(screen.getByRole('button', { name: t('common.filters.actions.clear') }));

    // then
    assert.ok(clearFilters.calledOnce);
  });
});
