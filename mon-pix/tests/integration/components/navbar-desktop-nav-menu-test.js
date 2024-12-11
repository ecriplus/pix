import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import { stubSessionService } from '../../helpers/service-stubs.js';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | navbar desktop menu', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should render links', async function (assert) {
    // given
    stubSessionService(this.owner, { isAuthenticated: true });

    this.set('menu', [
      {
        name: t('navigation.not-logged.sign-in'),
      },
      { name: t('navigation.not-logged.sign-up') },
    ]);

    // when
    const screen = await render(hbs`<NavbarDesktopMenu @menu={{this.menu}} />`);

    // then
    assert.dom(screen.getByRole('link', { name: t('navigation.not-logged.sign-up') })).exists();
    assert.dom(screen.getByRole('link', { name: t('navigation.not-logged.sign-in') })).exists();
  });
});
