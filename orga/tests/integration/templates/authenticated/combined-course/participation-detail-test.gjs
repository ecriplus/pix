import { render } from '@1024pix/ember-testing-library';
import ParticipationDetail from 'pix-orga/templates/authenticated/combined-course/participation-detail';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Template | combined-course/participation-detail', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders template', async function (assert) {
    const model = {
      combinedCourseParticipation: {
        firstName: 'Jean',
        lastName: 'Bon',
        combinedCourseId: 123,
      },
      combinedCourse: {
        id: 123,
        name: 'Combinix',
      },
    };

    const screen = await render(<template><ParticipationDetail @model={{model}} /></template>);

    assert.ok(screen.getByRole('heading', { name: 'Jean Bon', level: 1 }));
    assert.ok(screen.getByRole('link', { name: 'Campagnes' }));
    assert.ok(screen.getByRole('link', { name: 'Parcours apprenants' }));
    assert.ok(screen.getByRole('link', { name: 'Combinix' }));
    assert.ok(screen.getByText('Participation de Jean Bon'));
  });
});
