import { render } from '@1024pix/ember-testing-library';
import FrameworkHistory from 'pix-admin/components/complementary-certifications/item/framework/framework-history';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../../../helpers/setup-intl-rendering';

module('Integration | Component | Complementary certifications/Item/Framework | Framework history', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display the framework history', async function (assert) {
    // given
    const frameworkHistory = ['20250101080000', '20240101080000', '20230101080000'];

    // when
    const screen = await render(<template><FrameworkHistory @history={{frameworkHistory}} /></template>);

    // then
    assert
      .dom(
        screen.getByRole('heading', {
          name: t('components.complementary-certifications.item.framework.history.title'),
        }),
      )
      .exists();

    assert
      .dom(
        screen.getByRole('table', {
          name: t('components.complementary-certifications.item.framework.history.table.caption'),
        }),
      )
      .exists();

    assert.strictEqual(screen.getAllByRole('row').length, frameworkHistory.length + 1);
    assert.dom(screen.getByRole('cell', { name: frameworkHistory[0] })).exists();
    assert.dom(screen.getByRole('cell', { name: frameworkHistory[1] })).exists();
    assert.dom(screen.getByRole('cell', { name: frameworkHistory[2] })).exists();
  });
});
