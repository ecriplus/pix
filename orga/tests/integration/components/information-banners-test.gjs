import { render } from '@1024pix/ember-testing-library';
import InformationBanners from 'pix-orga/components/banner/information-banners';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | Banner | information-banners', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should not display the banner when no banners', async function (assert) {
    // given
    const banners = [];

    // when
    const screen = await render(<template><InformationBanners @banners={{banners}} /></template>);

    // then
    assert.dom(screen.queryByRole('alert')).doesNotExist();
  });

  test('should display the information banner', async function (assert) {
    // given
    const banners = [
      {
        severity: 'information',
        message: '[fr]texte de la bannière d‘information[/fr][en]information banner text[/en]',
      },
    ];

    // when
    const screen = await render(<template><InformationBanners @banners={{banners}} /></template>);

    // then
    assert.dom(screen.getByText('texte de la bannière d‘information')).exists();
    assert.dom(screen.getByRole('alert')).exists();
  });
});
