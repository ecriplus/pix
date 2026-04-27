import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import Catalogue from 'pix-orga/templates/authenticated/catalogue';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Template | authenticated/catalogue', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders template', async function (assert) {
    // when
    const screen = await render(<template><Catalogue /></template>);

    // then
    assert.ok(screen.getByRole('heading', { name: t('pages.catalogue.title'), level: 1 }));
  });
});
