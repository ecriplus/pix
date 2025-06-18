import { render } from '@1024pix/ember-testing-library';
import Framework from 'pix-admin/components/complementary-certifications/item/framework';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | complementary-certifications/item/target-profile', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a creation form button for framework', async function (assert) {
    // given
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isSuperAdmin: true };

    // when
    const screen = await render(<template><Framework /></template>);

    // then
    assert.dom(screen.getByText(t('components.complementary-certifications.item.framework.create-button'))).exists();
  });
});
