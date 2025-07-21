import { render } from '@1024pix/ember-testing-library';
import { findAll } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModuleElementText from 'mon-pix/components/module/element/text';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Text', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display a Text', async function (assert) {
    // given
    const textElement = { content: 'toto', type: 'text' };

    //  when
    const screen = await render(<template><ModuleElementText @text={{textElement}} /></template>);

    // then
    assert.ok(screen);
    assert.strictEqual(findAll('.element-text').length, 1);
    assert.ok(screen.getByText('toto'));
  });

  module('when text content contains an iframe tag', function () {
    test('should display a legend above', async function (assert) {
      // given
      const textElement = {
        content: '<iframe src="https://my-source.org" height="400"></iframe>',
        type: 'text',
      };

      //  when
      const screen = await render(<template><ModuleElementText @text={{textElement}} /></template>);

      // then
      assert.ok(screen);
      assert.dom(screen.getByRole('group', { name: t('pages.modulix.interactiveElement.label') })).exists();
    });
  });
});
