import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import Catalogue from 'pix-orga/templates/authenticated/catalogue';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Template | authenticated/catalogue', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders template', async function (assert) {
    // given
    const model = [
      {
        name: 'Combinix',
      },
    ];
    // when
    const screen = await render(<template><Catalogue @model={{model}} /></template>);

    // then
    assert.ok(screen.getByRole('heading', { name: t('pages.catalogue.title'), level: 1 }));
    assert.ok(screen.getByText('Combinix'));
  });
});
