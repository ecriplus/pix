import { render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import CombinedCourseParticipations from 'pix-orga/components/combined-course/participations';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | CombinedCourse | Participations', function (hooks) {
  const participations = [
    {
      id: 123,
      firstName: 'Marcelle',
      lastName: 'Labe',
      status: 'COMPLETED',
    },
    {
      id: 234,
      firstName: 'Vincent',
      lastName: 'Deli',
      status: 'STARTED',
    },
  ];
  participations.meta = { page: 1, pageSize: 1, rowCount: 2, pageCount: 2 };

  setupIntlRenderingTest(hooks);

  test('it should have a caption to describe the table ', async function (assert) {
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{participations}} /></template>,
    );

    // then
    assert.ok(screen.getByRole('table', { name: t('pages.combined-course.table.description') }));
  });

  test('it should display column headers', async function (assert) {
    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{participations}} /></template>,
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
  });

  test('it should display participation details', async function (assert) {
    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{participations}} /></template>,
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
  });

  test('it should display empty state', async function (assert) {
    // given
    const noParticipation = [];

    // when
    const screen = await render(
      <template><CombinedCourseParticipations @participations={{noParticipation}} /></template>,
    );

    assert.notOk(screen.queryByRole('table'));
    assert.ok(screen.getByText(t('pages.campaign.empty-state')));
  });

  module('pagination', function () {
    test('it should display pagination in correct language', async function (assert) {
      // when
      const locale = this.owner.lookup('service:locale');
      locale.setCurrentLocale('en');
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} /></template>,
      );
      assert.ok(screen.getByLabelText(/items/));
    });
    test('should display pagination', async function (assert) {
      const screen = await render(
        <template><CombinedCourseParticipations @participations={{participations}} /></template>,
      );
      assert.ok(screen.getByText(/1-1 sur 2 éléments/));
      assert.ok(screen.getByLabelText("Nombre d'élément à afficher par page"));
      assert.ok(screen.getByRole('button', { name: 'Aller à la page précédente' }));
      assert.ok(screen.getByRole('button', { name: 'Aller à la page suivante' }));
    });
  });
});
