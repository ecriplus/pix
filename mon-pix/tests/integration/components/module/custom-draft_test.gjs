import { clickByName, render } from '@1024pix/ember-testing-library';
// eslint-disable-next-line no-restricted-imports
import { find } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModulixCustomDraft from 'mon-pix/components/module/element/custom-draft';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | CustomDraft', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display a customDraft with instruction', async function (assert) {
    // given
    const customDraft = {
      id: 'id',
      title: 'title',
      url: 'https://example.org',
      instruction: '<p>Instruction du POIC</p>',
      height: 400,
    };

    // when
    const screen = await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

    // then
    assert.ok(screen);
    const expectedIframe = screen.getByTitle(customDraft.title);
    assert.strictEqual(expectedIframe.getAttribute('src'), customDraft.url);
    assert.strictEqual(window.getComputedStyle(expectedIframe).getPropertyValue('height'), `${customDraft.height}px`);
    assert
      .dom(screen.queryByRole('button', { name: t('pages.modulix.buttons.interactive-element.reset.ariaLabel') }))
      .exists();
    assert.dom(screen.getByText('Instruction du POIC')).exists();
  });

  test('should display a customDraft without instruction', async function (assert) {
    // given
    const customDraft = {
      id: 'id',
      title: 'title',
      isCompletionRequired: false,
      url: 'https://example.org',
      height: 400,
    };

    // when
    await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

    // then
    assert.dom(find('.element-customDraft__instruction')).doesNotExist();
  });

  module('when user clicks on reset button', function () {
    test('should focus on the iframe', async function (assert) {
      // given
      const customDraft = {
        id: 'id',
        title: 'title',
        isCompletionRequired: false,
        url: 'https://example.org',
        height: 400,
      };
      const screen = await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

      // when
      await clickByName(t('pages.modulix.buttons.interactive-element.reset.ariaLabel'));

      // then
      const iframe = screen.getByTitle(customDraft.title);
      assert.strictEqual(document.activeElement, iframe);
    });
  });
});
