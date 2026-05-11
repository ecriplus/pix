import { render } from '@1024pix/ember-testing-library';
import List from 'pix-orga/templates/authenticated/catalogue/list';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Template | authenticated/catalogue/list', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders template', async function (assert) {
    // given
    const controller = { updateFilter: () => {}, resetFilters: () => {} };
    const model = {
      courses: [
        {
          name: 'Combinix',
        },
      ],
      type: 'all',
    };
    // when
    const screen = await render(<template><List @controller={{controller}} @model={{model}} /></template>);

    // then
    assert.ok(screen.getByText('Combinix'));
  });
});
