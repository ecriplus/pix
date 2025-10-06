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
    campaignIds: [123, 234],
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

  module('combine course campaign link', function () {
    test('it should display a link button for each associated campaign', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        name: 'Parcours MagiPix',
        code: '1234PixTest',
        campaignIds: [123, 234],
        combinedCourseParticipations: [
          store.createRecord('combined-course-participation', {
            id: 123,
            firstName: 'TOTO',
            lastName: 'Cornichon',
            status: 'STARTED',
          }),
        ],
      });

      // when
      const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

      // then
      const link1 = screen.getByRole('link', { name: t('pages.combined-course.campaigns', { count: 2, index: 1 }) });
      assert.ok(link1.getAttribute('href').endsWith('campagnes/123'));
      const link2 = screen.getByRole('link', { name: t('pages.combined-course.campaigns', { count: 2, index: 2 }) });
      assert.ok(link2.getAttribute('href').endsWith('campagnes/234'));
    });
    test('it should not display a campaign link button if no associated campaign', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const combinedCourse = store.createRecord('combined-course', {
        id: 1,
        name: 'Parcours MagiPix',
        code: '1234PixTest',
        campaignIds: [],
        combinedCourseParticipations: [],
      });

      // when
      const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

      // then
      assert.notOk(screen.queryByRole('link', { name: t('pages.combined-course.campaigns', { count: 0, index: 0 }) }));
    });
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

  test('it should display empty state', async function (assert) {
    // given
    const emptyCombinedCourse = {
      id: 1,
      name: 'Parcours MagiPix',
      code: '1234PixTest',
      campaignIds: [123, 234],
      combinedCourseParticipations: [],
    };
    // when
    const screen = await render(<template><CombinedCourse @model={{emptyCombinedCourse}} /></template>);

    assert.notOk(screen.queryByRole('table'));
    assert.ok(screen.getByText(t('pages.campaign.empty-state')));
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

  module('combined course statistics', function () {
    test('it should display participations count', async function (assert) {
      // given
      const combinedCourse = {
        id: 1,
        name: 'Parcours Magipix',
        code: '1234PixTest',
        campaignIds: [123],
        combinedCourseStatistics: {
          participationsCount: 20,
          completedParticipationsCount: 8,
        },
      };

      // when
      const screen = await render(<template><CombinedCourse @model={{combinedCourse}} /></template>);

      // then
      const totalParticipationsBlock = screen.getByText(t('pages.combined-course.statistics.total-participations'));
      const totalParticipationsElement = within(totalParticipationsBlock.closest('dl')).getByRole('definition');
      assert.strictEqual(
        totalParticipationsElement.innerText,
        combinedCourse.combinedCourseStatistics.participationsCount.toString(),
      );
      const completedParticipationsBlock = screen.getByText(
        t('pages.combined-course.statistics.completed-participations'),
      );
      const completedParticipationsElement = within(completedParticipationsBlock.closest('dl')).getByRole('definition');
      assert.strictEqual(
        completedParticipationsElement.innerText,
        combinedCourse.combinedCourseStatistics.completedParticipationsCount.toString(),
      );
    });
  });
});
