import { render } from '@1024pix/ember-testing-library';
import BannerCommunication from 'pix-orga/components/banner/communication';
import ENV from 'pix-orga/config/environment';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Banner::Communication', function (hooks) {
  setupIntlRenderingTest(hooks);

  const originalBannerContent = ENV.APP.BANNER_CONTENT;
  const originalBannerType = ENV.APP.BANNER_TYPE;

  hooks.afterEach(function () {
    ENV.APP.BANNER_CONTENT = originalBannerContent;
    ENV.APP.BANNER_TYPE = originalBannerType;
  });

  test('should not display the banner when no banner content', async function (assert) {
    // given
    ENV.APP.BANNER_CONTENT = '';
    ENV.APP.BANNER_TYPE = '';

    // when
    await render(<template><BannerCommunication /></template>);

    // then
    assert.dom('.pix-banner-alert').doesNotExist();
  });

  test('should display the information banner', async function (assert) {
    // given
    ENV.APP.BANNER_CONTENT = 'information banner text ...';
    ENV.APP.BANNER_TYPE = 'information';

    // when
    const screen = await render(<template><BannerCommunication /></template>);

    // then
    assert.dom('.pix-banner-alert--information').exists();
    assert.ok(screen.getByText('information banner text ...'));
  });
});
