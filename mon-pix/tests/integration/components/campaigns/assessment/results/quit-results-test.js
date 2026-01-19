import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import { stubCurrentUserService } from '../../../../../helpers/service-stubs';
import setupIntlRenderingTest from '../../../../../helpers/setup-intl-rendering';

module('Integration | Components | Campaigns | Assessment | Results | Quit Results', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    stubCurrentUserService(this.owner, { firstName: 'Alain', isAnonymous: false });
  });

  test('it should display a quit button link', async function (assert) {
    // when
    const screen = await render(hbs`<Campaigns::Assessment::Results::QuitResults />`);

    // then
    assert.ok(
      screen
        .getByRole('link', {
          name: t('pages.skill-review.actions.back-to-pix'),
        })
        .getAttribute('href')
        .includes('/'),
    );
  });
});
