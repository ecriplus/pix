import { render } from '@1024pix/ember-testing-library';
import ParticipationDetail from 'pix-orga/components/combined-course/participation-detail';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | combined-course/participation-detail', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders title', async function (assert) {
    const participation = {
      firstName: 'Jean',
      lastName: 'Bon',
      combinedCourseId: 123,
    };
    const combinedCourse = {
      id: 123,
      name: 'Combinix',
    };

    const screen = await render(
      <template><ParticipationDetail @participation={{participation}} @combinedCourse={{combinedCourse}} /></template>,
    );

    assert.ok(screen.getByRole('heading', { name: 'Jean Bon', level: 1 }));
  });

  test('it renders breadcrumb', async function (assert) {
    const participation = {
      firstName: 'Jean',
      lastName: 'Bon',
      combinedCourseId: 123,
    };
    const combinedCourse = {
      id: 123,
      name: 'Combinix',
    };

    const screen = await render(
      <template><ParticipationDetail @participation={{participation}} @combinedCourse={{combinedCourse}} /></template>,
    );

    assert.ok(screen.getByRole('link', { name: 'Campagnes' }));
    assert.ok(screen.getByRole('link', { name: 'Parcours apprenants' }));
    assert.ok(screen.getByRole('link', { name: 'Combinix' }));
    assert.ok(screen.getByText('Participation de Jean Bon'));
  });
});
