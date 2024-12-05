import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'pix-certif/config/environment';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | communication-banner', function (hooks) {
  setupIntlRenderingTest(hooks);

  const originalBannerContent = ENV.APP.BANNER.CONTENT;
  const originalBannerType = ENV.APP.BANNER.TYPE;

  hooks.afterEach(function () {
    ENV.APP.BANNER.CONTENT = originalBannerContent;
    ENV.APP.BANNER.TYPE = originalBannerType;
  });

  test('should not display the banner when no banner content', async function (assert) {
    // given
    ENV.APP.BANNER.CONTENT = '';
    ENV.APP.BANNER.TYPE = '';

    // when
    const screen = await render(hbs`<CommunicationBanner />`);

    // then
    assert.dom(screen.queryByRole('button', { name: 'Fermer' })).doesNotExist();
  });

  test('should display the information banner', async function (assert) {
    // given
    ENV.APP.BANNER.CONTENT = 'information banner text ...';
    ENV.APP.BANNER.TYPE = 'information';

    // when
    const screen = await render(hbs`<CommunicationBanner />`);

    // then
    assert.dom(screen.getByText('information banner text ...')).exists();
  });
});
