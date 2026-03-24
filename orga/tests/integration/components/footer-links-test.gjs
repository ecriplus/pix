import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import FooterLinks from 'pix-orga/components/footer-links';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | Authentication-layout | footer-links', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it displays a navigation with a list of links', async function (assert) {
    // when
    const screen = await render(<template><FooterLinks /></template>);

    // then
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.legal-notice') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.a11y') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.server-status') }));
    assert.ok(screen.getByRole('link', { name: t('navigation.footer.help-center') }));
  });
});
