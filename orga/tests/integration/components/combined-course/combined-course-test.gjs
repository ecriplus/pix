import { render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import CombinedCourse from 'pix-orga/components/combined-course/combined-course';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | CombinedCourse', function (hooks) {
  const combinedCourse = {
    id: 1,
    name: 'Parcours MagiPix',
    code: '1234PixTest',
    campaignIds: [123],
    combinedCourseParticipations: [
      {
        id: 123,
        firstName: 'TOTO',
        lastName: 'Cornichon',
        status: 'STARTED',
      },
    ],
  };

  setupIntlRenderingTest(hooks);

  test('it should display course name', async function (assert) {
    // given
    const combinedCourse = {
      id: 1,
      name: 'Parcours MagiPix',
      code: '1234PixTest',
      campaignIds: [123],
    };

    // when
    const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

    // then
    const title = screen.getByRole('heading', { level: 1 });

    assert.ok(within(title).getByRole('img', { name: t('components.activity-type.explanation.COMBINED_COURSE') }));
    assert.ok(within(title).getByText('Parcours MagiPix'));
    assert.ok(screen.getByText('1234PixTest'));
  });

  test('it should have a caption to describe the table ', async function (assert) {
    const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

    // then
    assert.ok(screen.getByRole('table', { name: t('pages.combined-course.table.description') }));
  });

  test('it should display column headers', async function (assert) {
    // when
    const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

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
    const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

    const table = screen.getByRole('table');
    // then
    assert.ok(
      within(table).getByRole('cell', {
        name: combinedCourse.combinedCourseParticipations[0].lastName,
      }),
    );
    assert.ok(
      within(table).getByRole('cell', {
        name: combinedCourse.combinedCourseParticipations[0].firstName,
      }),
    );
    assert.ok(
      within(table).getByRole('cell', {
        name: t(`components.participation-status.${combinedCourse.combinedCourseParticipations[0].status}`),
      }),
    );
  });

  module('combined course code display', function () {
    test('it should display combined course code', async function (assert) {
      // given
      const combinedCourse = {
        id: 1,
        name: 'Parcours Magipix',
        code: '1234PixTest',
        campaignIds: [123],
      };

      // when
      const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

      // then
      assert.ok(screen.getByText('1234PixTest'));
      assert.ok(screen.getByText(t('pages.campaign.code')));
    });
  });
});
