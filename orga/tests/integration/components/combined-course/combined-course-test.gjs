import { render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import CombinedCourse from 'pix-orga/components/combined-course/combined-course';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | CombinedCourse', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display campaign name', async function (assert) {
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

  module('campaign code display', function () {
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
