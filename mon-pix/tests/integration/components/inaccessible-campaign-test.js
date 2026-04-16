/* eslint ember/no-classic-classes: 0 */
/* eslint ember/require-tagless-components: 0 */

import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | inaccessible-campaign', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('renders component with a title', async function (assert) {
    // when
    const screen = await render(hbs`{{! template-lint-disable no-bare-strings }}
<InaccessibleCampaign>Some title</InaccessibleCampaign>`);

    // then
    assert.dom(screen.getByRole('heading', { name: 'Some title' })).exists();
  });
});
